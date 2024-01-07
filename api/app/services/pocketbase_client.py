import os
from httpx import AsyncClient
import requests
from fastapi import HTTPException, status
from typing import Dict, Literal
from dotenv import load_dotenv
from termcolor import colored

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
        async with AsyncClient() as client:  # Use AsyncClient context manager for async operations
            response = await client.post(
                f'{self.base_url}/api/collections/users/auth-refresh',
                headers={"Authorization": f"Bearer {token}"},
            )
            if response.status_code == 200:
                user_data = response.json().get('record')
                if user_data:
                    user = User(**user_data)
                    print(colored(f"Authenticated with user {user}", 'green'))
                    return user
            else:
                print(colored(f"Failed to authenticate with apikey {token}", 'red'))

            return None

    async def authenticate_with_apikey(self, apikey: str) -> User:
        async with AsyncClient() as client:  # Use AsyncClient context manager for async operations
            response = await client.get(
                f'{self.base_url}/api/collections/api_keys/records?filter=(key = \'{apikey}\')',
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
            f'{self.base_url}/api/collections/api_keys/records/{apikey}?filter=(owner = \'{owner}\' && key = \'{apikey}\')',
        )
        response.raise_for_status()
        return response.json()

    def get_apikeys(self, owner: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/api_keys/records?filter=(owner = \'{owner}\')',
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
            f'{self.base_url}/api/collections/chats/records?filter=(owner = \'{user.id}\')',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
        )
        response.raise_for_status()
        get_result = response.json()
        return get_result.get('items', [])

    def create_chat(self, chat_to_create: dict) -> Dict:
        print('chat_to_create', chat_to_create)
        chat_to_create['owner'] = self.user.id
        response = self.session.post(
            f'{self.base_url}/api/collections/chats/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json=chat_to_create
        )
        response.raise_for_status()
        return response.json()

    def add_message(self, message: dict) -> Dict:
        message_to_persist = message
        message_to_persist.pop('id', None)  # Should remove id for auto-generation
        response = self.session.post(
            f'{self.base_url}/api/collections/messages/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json=message_to_persist
        )
        response.raise_for_status()
        return response.json()

    def get_source_metadata(self, token: str, chat: str) -> Dict:
        response = requests.get(
            f'{self.base_url}/api/collections/chats/records/{chat}',
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

        if chat['from_type'] == 'flow':
            response = requests.get(
                f'{self.base_url}/api/collections/flows/records/{chat["from_flow"]}',
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

    def set_chat_status(self, token: str, chat_id: str, status: Literal['running', 'wait_for_human_input']):
        print('set_chat_status', chat_id, status)
        response = requests.patch(
            f'{self.base_url}/api/collections/chats/records/{chat_id}',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json={"status": status}
        )
        response.raise_for_status()
        return response.json()

# A single reusable client instance
pocketbase_client = PocketBaseClient()