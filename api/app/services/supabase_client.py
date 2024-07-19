from base64 import b64decode
from io import BytesIO
import json
import os
import logging
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from gotrue import User
from fastapi import HTTPException, status, Request
from typing import Dict, List, Literal, Optional
from termcolor import colored

logger = logging.getLogger(__name__)

from ..models import ApiKey, ApiKeyCreate, Chat, ChatCreate, Message, MessageCreate

load_dotenv()  # Load environment variables from .env

class SupabaseClient:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.user_id = None

    def get_user(self) -> User:
        try:
            user_data = self.supabase.auth.get_user()
            if user_data:
                return user_data.user
            else:
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")

    # Load the user from the cookie. This is for the situation where the user is already logged in on client side.
    # The request should be called with credentials: 'include'
    def authenticate_with_tokens(self, access_token: str, refresh_token: Optional[str] = "dummy_refresh_token") -> User:
        try:
            # Set the session in Supabase
            self.supabase.auth.set_session(access_token=access_token, refresh_token=refresh_token)
            user_data = self.supabase.auth.get_user()
            if user_data:
                self.user_id = user_data.user.id
                return user_data.user
            else:
                print(colored(f"Failed to retrieve user", 'red'))
                raise Exception(status_code=status.HTTP_401_UNAUTHORIZED, detail="Failed to retrieve user from token")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")

    def authenticate_with_apikey(self, apikey: str) -> User:
        try:
            response = (self.supabase.table("api_keys")
                        .select("users:user_id(*)")
                        .eq("key", apikey)
                        .execute())

            if response.data and response.data[0].get('users'):
                user_data = response.data[0]['users']
                user = User(**user_data)
                print(colored(f"Authenticated with user {user}", 'green'))
                return user
            else:
                print(colored(f"Failed to authenticate with apikey {apikey}", 'red'))
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    def save_apikey(self, key_to_create: ApiKeyCreate) -> ApiKey:
        try:
            # Create a new instance with the user_id
            chat_data = key_to_create.model_dump()
            chat_data['user_id'] = self.user_id
            response = self.supabase.table("api_keys").insert(chat_data).execute()
            if response.data:
                return response.data[0]
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create API key")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create API key")

    def get_apikeys(self) -> List[ApiKey]:
        try:
            response = self.supabase.table("api_keys").select("*").eq("user_id", self.user_id).execute()
            print(colored(f"Retrieved api keys: {response.data} for {self.user_id}", 'blue'))
            if response.data:
                return [ApiKey(**item) for item in response.data]
            else:
                return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to retrieve API keys")

    def get_apikey(self, apikey_id: str) -> Optional[ApiKey]:
        try:
            response = self.supabase.table("api_keys").select("*").eq("id", apikey_id).eq("user_id", self.user_id).execute()
            if response.data:
                return ApiKey(**response.data[0])
            else:
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to retrieve API key")

    def delete_apikey(self, apikey_id: str) -> Dict:
        try:
            response = self.supabase.table("api_keys").delete().eq("id", apikey_id).eq("user_id", self.user_id).execute()
            if response.data:
                return {"message": f"Successfully deleted {apikey_id}"}
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete API key")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete API key")

    def get_settings(self) -> Dict:
        try:
            response = self.supabase.table('users').select('settings').execute()
            if response.data:
                return response.data[0]
            else:
                return {}
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User settings not found: {exc}",
            )

    def get_chats(self) -> List[Chat]:
        try:
            response = self.supabase.table('chats').select('*').execute()
            if response.data:
              return [Chat(**item) for item in response.data]
            else:
              return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to get chats for user {self.user_id}: {exc}",
            )

    def get_chat(self, chat_id: str) -> Chat:
        try:
            response = self.supabase.table('chats').select('*').eq('id', chat_id).execute()
            if response.data:
                return Chat(**response.data[0])
            else:
                return None
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found: {exc}",
            )

    def create_chat(self, chat_to_create: ChatCreate) -> Chat:
        try:
            # Create a new instance with the user_id
            chat_data = chat_to_create.model_dump(exclude={"id"})
            chat_data['user_id'] = self.user_id
            response = self.supabase.table('chats').insert(chat_data).execute()

            if response.data:
                return Chat(**response.data[0])
            else:
                print(colored(f"Insertion failed: {response}", 'red'))
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create chat"
                )
        except Exception as exc:
            print(colored(f"Failed to create chat: {exc}", 'red'))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create chat: {exc}",
            )

    def add_message(self, message: MessageCreate, chat_id: str) -> Message:
        try:
            # Convert the message to a dictionary while excluding the 'id' field
            message_dict = message.model_dump(exclude={"id"})
            message_dict['user_id'] = self.user_id
            message_dict['chat_id'] = int(chat_id)
            print(colored(f"Adding message: {message_dict}", 'green'))
            response = self.supabase.table('chat_messages').insert(message_dict).execute()
            if response.data:
                return Message(**response.data[0])
            else:
                return None
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add message: {exc}",
            )

    def get_source_metadata(self, chat_id: str) -> Dict:
        try:
            response = self.supabase.table('chats').select('*').eq('id', int(chat_id)).execute()
            if response.data:
                chat = response.data[0]

                if chat['from_type'] == 'project':
                    response = self.supabase.table('projects').select('*').eq('id', chat['from_project']).execute()
                elif chat['from_type'] == 'template':
                    response = self.supabase.table('templates').select('*').eq('id', chat['from_template']).execute()

                if response.data:
                    return response.data[0]
                else:
                    return None
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Source metadata not found: {exc}",
            )

    def set_chat_status(self, chat_id: str, status: Literal['ready', 'running', 'wait_for_human_input', 'completed', 'aborted', 'failed']):
        try:
          response = self.supabase.table('chats').update({'status': status}).eq('id', chat_id).execute()
          if response.data:
            return response.data
          else:
            return None
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to set chat status: {exc}",
            )

    def upload_image(self, name, file, user_id, tags, metadata):
        files = {}
        headers = {"Authorization": f"Bearer {self.admin_auth['token']}", "Content-Type": "multipart/form-data"}

        if file and isinstance(file, str):
            if file.startswith('http'):
                response = requests.get(file)
                files['file'] = (name, BytesIO(response.content))
            else:
                if file.startswith('data:image'):
                    file = file.split(',')[1]
                file_buffer = b64decode(file)
                files['file'] = (name, BytesIO(file_buffer))
        else:
            files['file'] = (name, open(file, 'rb'))

        data = {}
        if name:
            data['name'] = name
        if user_id:
            data['user_id'] = user_id
        if tags:
            data['tags'] = tags
        if metadata:
            data['metadata'] = json.dumps(metadata)

        response = requests.post(f'{self.base_url}/api/collections/assets/records', data=data, files=files)
        if isinstance(files['file'], tuple):
            files['file'][1].close()
        else:
            files['file'].close()

        if response.status_code == 200:
            created_record = response.json()
            access_url = f'{self.base_url}/api/files/{created_record["collectionId"]}/{created_record["id"]}/{created_record["file"]}'
            return response.status_code, {"access_url": access_url, "record": created_record}
        else:
            return response.status_code, response.json()

def create_supabase_client():
    return SupabaseClient()