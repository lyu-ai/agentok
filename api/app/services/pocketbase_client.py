from base64 import b64decode
from io import BytesIO
import json
import os
from httpx import AsyncClient, RequestError, HTTPStatusError
from anyio import EndOfStream
import jwt
import requests
from fastapi import HTTPException, status
from typing import Dict, Literal
from dotenv import load_dotenv
from termcolor import colored
import logging

logger = logging.getLogger(__name__)

from ..models import User
load_dotenv()  # This will load all environment variables from .env

class PocketBaseClient:
    def __init__(self):
        self.base_url = os.environ.get("POCKETBASE_URL")
        self.session = requests.Session()  # Utilizes a session object for connection pooling
        admin_account = os.environ.get("POCKETBASE_ADMIN_ACCOUNT")
        admin_password = os.environ.get("POCKETBASE_ADMIN_PASSWORD")
        response = self.session.post(
            f'{self.base_url}/api/admins/auth-with-password',
            json={
                "identity": admin_account,
                "password": admin_password,
            },
        )
        response.raise_for_status()
        self.admin_auth = response.json()
        """
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN5d2JoZWNuaDQ2cmhtMCIsInR5cGUiOiJhZG1pbiIsImV4cCI6MjIwODk4MTYwMH0.han3_sG65zLddpcX2ic78qgy7FKecuPfOpFa8Dvi5Bg",
          "admin": {
            "id": "b6e4b08274f34e9",
            "created": "2022-06-22 07:13:09.735Z",
            "updated": "2022-06-22 07:13:09.735Z",
            "email": "test@example.com",
            "avatar": 0
          }
        }
        """


    async def authenticate_with_bearer(self, token: str) -> User:
      try:
        async with AsyncClient() as client:  # Use AsyncClient context manager for async operations
            payload = jwt.decode(token, options={"verify_signature": False})
            print('payload', payload)
            response = await client.get(
                f'{self.base_url}/api/collections/users/records/{payload["id"]}',
                headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            )
            if response.status_code == 200:
                user_data = response.json()
                if user_data:
                    user = User(**user_data)
                    print(colored(f"Retrieved user {user}", 'green'))
                    return user
            else:
                print(colored(f"Failed to retrieve user for the provided token {response.status_code} {response.text}", 'red'))

            return None
      except RequestError as exc:
        logger.error(f"An error occurred while requesting {exc.request.url!r}: {exc}")
        raise
      except HTTPStatusError as exc:
          logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}: {exc}")
          raise
      except EndOfStream as exc:
          logger.error("Unexpected end of stream during TLS handshake")
          raise

    async def authenticate_with_apikey(self, apikey: str) -> User:
        async with AsyncClient(timeout=httpx.Timeout(10.0, read=30.0)) as client:  # Use AsyncClient context manager for async operations
            response = await client.get(
                f'{self.base_url}/api/collections/api_keys/records?filter=(key=\'{apikey}\')',
                headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            )
            if response.status_code == 200:
                user_id = response.json().get('items', [])[0].get('owner')
                if user_id:
                    response = await client.get(
                        f'{self.base_url}/api/collections/users/records/{user_id}',
                        headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
                    )
                    if response.status_code == 200:
                        print('response.json()', response.json())
                        user_data = response.json()
                        if user_data:
                            user = User(**user_data)
                            print(colored(f"Authenticated with user {user}", 'green'))
                            return user
            else:
                print(colored(f"Failed to authenticate with apikey {apikey}", 'red'))

            return None
    def authenticate_with_session(self, session_token: str) -> User:
        response = self.session.post(
            f'{self.base_url}/api/users/me',
            headers={"Authorization": f"Bearer {session_token}"},
        )
        if response.status_code == 200:
            user_data = response.json()
            if user_data:
                user = User(**user_data)
                print(colored(f"Retrieved user {user}", 'green'))
                return user
        else:
            print(colored(f"Failed to retrieve user for the provided token {response.status_code} {response.text}", 'red'))

        return None

    def save_apikey(self, key_to_create: dict) -> Dict:
        response = self.session.post(
            f'{self.base_url}/api/collections/api_keys/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json=key_to_create,
        )
        response.raise_for_status()
        return response.json()

    def verify_apikey(self, apikey: str, owner: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/api_keys/records/{apikey}?filter=(owner=\'{owner}\'&&key=\'{apikey}\')',
        )
        response.raise_for_status()
        return response.json()

    def get_apikeys(self, owner: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/api_keys/records?filter=(owner=\'{owner}\')',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        return response.json().get('items', [])

    def get_apikey(self, apikey_id: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/api_keys/records/{apikey_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        return response.json()

    def delete_apikey(self, apikey_id: str) -> Dict:
        response = self.session.delete(
            f'{self.base_url}/api/collections/api_keys/records/{apikey_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        return { "message": f"Successfully deleted {apikey_id}" }

    def get_chats(self, user: dict) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/chats/records?filter=(owner=\'{user.id}\')',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        get_result = response.json()
        return get_result.get('items', [])

    def get_chat(self, user: dict, chat_id: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/chats/records/{chat_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        chat = response.json()
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return chat

    def create_chat(self, user: dict, chat_to_create: dict) -> Dict:
        print('chat_to_create', chat_to_create)
        chat_to_create['owner'] = user.id
        response = self.session.post(
            f'{self.base_url}/api/collections/chats/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json=chat_to_create
        )
        response.raise_for_status()
        return response.json()

    def add_message(self, user: dict, message: dict) -> Dict:
        message_to_persist = message
        message_to_persist.pop('id', None)  # Should remove id for auto-generation
        message_to_persist['owner'] = user.id
        response = self.session.post(
            f'{self.base_url}/api/collections/chat_messages/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json=message_to_persist
        )
        response.raise_for_status()
        return response.json()

    def get_source_metadata(self, chat_id: str) -> Dict:
        response = requests.get(
            f'{self.base_url}/api/collections/chats/records/{chat_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        chat = response.json()
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if chat['from_type'] == 'project':
            response = requests.get(
                f'{self.base_url}/api/collections/projects/records/{chat["from_project"]}',
                headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            )
            response.raise_for_status()
            return response.json()
        elif chat['from_type'] == 'template':
            response = requests.get(
                f'{self.base_url}/api/collections/templates/records/{chat["from_template"]}',
                headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            )
            response.raise_for_status()
            return response.json()

    def set_chat_status(self, chat_id: str, status: Literal['ready', 'running', 'wait_for_human_input', 'completed', 'aborted', 'failed']):
        print('set_chat_status', chat_id, status)
        response = self.session.patch(
            f'{self.base_url}/api/collections/chats/records/{chat_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json={"status": status}
        )
        response.raise_for_status()
        return response.json()

    def upload_image(self, name, file, owner, tags, metadata):
        # Create the `files` dictionary for the `requests.post` call
        files = {}
        headers={"Authorization": f"Bearer {self.admin_auth['token']}", "Content-Type": "multipart/form-data"}

        # If file is a string, it means either a remote URL or a DataURL is being used
        if file and isinstance(file, str):
            if file.startswith('http'):  # Remote file
                response = requests.get(file)
                # Assuming the fetched file is an image
                files['file'] = (name, BytesIO(response.content))  # You might need to provide the file name
            else:  # DataURL
                if file.startswith('data:image'):
                    file = file.split(',')[1]
                file_buffer = b64decode(file)
                files['file'] = (name, BytesIO(file_buffer))  # The file name is optionally provided here
        else:
            files['file'] = (name, open(file, 'rb'))  # Local file path

        # Prepare form data
        data = {}
        if name:
            data['name'] = name
        if owner:
            data['owner'] = owner
        if tags:
            data['tags'] = tags
        if metadata:
            # Ensure that `metadata` is properly converted to a JSON string
            data['metadata'] = json.dumps(metadata)

        # Make the POST request
        response = self.session.post(f'{self.base_url}/api/collections/assets/records', data=data, files=files)
        # It's important to close files after use to free up system resources
        if isinstance(files['file'], tuple):  # If using BytesIO or equivalent
            files['file'][1].close()
        else:  # If we opened a file
            files['file'].close()

        # Check the response
        if response.status_code == 200:
            print('Success! File uploaded.')
            created_record = response.json()
            print(created_record)

            # Build the access url
            access_url = f'{self.base_url}/api/files/{created_record["collectionId"]}/{created_record["id"]}/{created_record["file"]}'
            print('access_url', access_url)

            return response.status_code, { "access_url": access_url, "record": created_record}
        else:
            print('Failed to upload the file.')
            print(response.json())
            return response.status_code, response.json()

# A single reusable client instance
pocketbase_client = PocketBaseClient()

# pocketbase_client.upload_image('img-1GxeEv5trBMjT7wcOEFIqpWb.png', 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-nJhe0aW6oC7eG9EdUFiZXtgT/user-1tjEAwFXFilgD1vrmxlJrwMV/img-1GxeEv5trBMjT7wcOEFIqpWb.png?st=2024-02-02T03%3A58%3A47Z&se=2024-02-02T05%3A58%3A47Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-01T22%3A40%3A04Z&ske=2024-02-02T22%3A40%3A04Z&sks=b&skv=2021-08-06&sig=mkDnV3NXN1he6RzWGHyWwBiW/SfD8/F9avlrxUyn0%2BQ%3D', '', ['dalle'], {'image_url': 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-nJhe0aW6oC7eG9EdUFiZXtgT/user-1tjEAwFXFilgD1vrmxlJrwMV/img-1GxeEv5trBMjT7wcOEFIqpWb.png?st=2024-02-02T03%3A58%3A47Z&se=2024-02-02T05%3A58%3A47Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-01T22%3A40%3A04Z&ske=2024-02-02T22%3A40%3A04Z&sks=b&skv=2021-08-06&sig=mkDnV3NXN1he6RzWGHyWwBiW/SfD8/F9avlrxUyn0%2BQ%3D'})