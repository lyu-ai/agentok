from base64 import b64decode
from io import BytesIO
import json
import os
import logging
import jwt
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import HTTPException, requests, status
from typing import Dict, List, Literal, Optional
from termcolor import colored

logger = logging.getLogger(__name__)

from ..models import User

load_dotenv()  # Load environment variables from .env

class SupabaseClient:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    async def authenticate_with_bearer(self, token: str) -> User:
        try:
            response = self.supabase.auth.get_user(token)
            if response.user:
                return response.user
            else:
                print(colored(f"Failed to retrieve user: {response.error}", 'red'))
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    async def authenticate_with_apikey(self, apikey: str) -> User:
        try:
            response = self.supabase.table("api_keys").select("*").eq("key", apikey).execute()
            if response.status_code == 200 and response.data:
                user_id = response.data[0].get("user_id")
                if user_id:
                    response = self.supabase.table("users").select("*").eq("id", user_id).execute()
                    if response.status_code == 200 and response.data:
                        user_data = response.data[0]
                        user = User(**user_data)
                        print(colored(f"Authenticated with user {user}", 'green'))
                        return user
            else:
                print(colored(f"Failed to authenticate with apikey {apikey}", 'red'))
            return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    def authenticate_with_session(self, session_token: str) -> User:
        try:
            response = self.supabase.auth.get_user(token=session_token)
            if response.user:
                user_data = response.user
                user = User(**user_data)
                print(colored(f"Retrieved user {user}", 'green'))
                return user
            else:
                print(colored(f"Failed to retrieve user: {response.error}", 'red'))
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    def save_apikey(self, key_to_create: dict) -> Dict:
        try:
            response = self.supabase.table("api_keys").insert(key_to_create).execute()
            if response.data:
                return response.data[0]
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create API key")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create API key")

    def verify_apikey(self, apikey: str, user_id: str) -> Optional[Dict]:
        try:
            response = self.supabase.table("api_keys").select("*").eq("key", apikey).eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            else:
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")

    def get_apikeys(self, user_id: str) -> List[Dict]:
        try:
            response = self.supabase.table("api_keys").select("*").eq("user_id", user_id).execute()
            if response.data:
                return response.data
            else:
                return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to retrieve API keys")

    def get_apikey(self, apikey_id: str) -> Optional[Dict]:
        try:
            response = self.supabase.table("api_keys").select("*").eq("id", apikey_id).execute()
            if response.data:
                return response.data[0]
            else:
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to retrieve API key")

    def delete_apikey(self, apikey_id: str) -> Dict:
        try:
            response = self.supabase.table("api_keys").delete().eq("id", apikey_id).execute()
            if response.data:
                return {"message": f"Successfully deleted {apikey_id}"}
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete API key")
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete API key")

    def get_settings(self, user: User) -> Dict:
        response = self.supabase.table('users').select('settings').eq('id', user.id).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User settings not found: {response.error['message']}",
            )
        return response['data']['settings']

    def get_chats(self, user: User) -> Dict:
        try:
            response = self.supabase.table('chats').select('*').execute()
            if response.data:
              return response.data
            else:
              return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to get chats for user {user.id}: {exc}",
            )

    def get_chat(self, user: User, chat_id: str) -> Dict:
        response = self.supabase.table('chats').select('*').eq('id', chat_id).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found: {response['error']['message']}",
            )
        return response['data']

    def create_chat(self, user: User, chat_to_create: dict) -> Dict:
        chat_to_create['user_id'] = user.id
        response = self.supabase.table('chats').insert(chat_to_create).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create chat: {response['error']['message']}",
            )
        return response['data']

    def add_message(self, user: User, message: dict) -> Dict:
        message_to_persist = message.copy()
        message_to_persist.pop('id', None)
        message_to_persist['user_id'] = user.id
        response = self.supabase.table('chat_messages').insert(message_to_persist).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add message: {response['error']['message']}",
            )
        return response['data']

    def get_source_metadata(self, chat_id: str) -> Dict:
        response = self.supabase.table('chats').select('*').eq('id', chat_id).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found: {response['error']['message']}",
            )
        chat = response['data']

        if chat['from_type'] == 'project':
            response = self.supabase.table('projects').select('*').eq('id', chat['from_project']).single()
        elif chat['from_type'] == 'template':
            response = self.supabase.table('templates').select('*').eq('id', chat['from_template']).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Source metadata not found: {response['error']['message']}",
            )
        return response['data']

    def set_chat_status(self, chat_id: str, status: Literal['ready', 'running', 'wait_for_human_input', 'completed', 'aborted', 'failed']):
        response = self.supabase.table('chats').update({'status': status}).eq('id', chat_id).single()
        if response.error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to set chat status: {response['error']['message']}",
            )
        return response['data']

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

# A single reusable client instance
supabase_client = SupabaseClient()