import os
import requests
from typing import Dict
from dotenv import load_dotenv
from termcolor import colored
load_dotenv()  # This will load all environment variables from .env

class PocketBaseAdminClient:
    def __init__(self):
        self.base_url = os.environ.get("POCKETBASE_URL")
        admin_account = os.environ.get("POCKETBASE_ADMIN_ACCOUNT")
        admin_password = os.environ.get("POCKETBASE_ADMIN_PASSWORD")
        self.session = requests.Session()  # Utilizes a session object for connection pooling
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

    def get_auth_info(self, token) -> Dict:
        response = self.session.post(
            f'{self.base_url}/api/collections/users/auth-refresh',
            headers={"Authorization": f"Bearer {token}"},
        )
        response.raise_for_status()
        auth_info = response.json().get('record')
        return auth_info

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
            f'{self.base_url}/api/collections/api_keys/records/{apikey}',
            json={
                "filter": f"owner = '{owner}' AND key = '{apikey}'",
            },
        )
        response.raise_for_status()
        return response.json()

    def get_apikeys(self, owner: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/api_keys/records',
            headers={"Authorization": f"Bearer {self.admin_auth['token']}"},
            json={
                "filter": f"owner = '{owner}'",
            },
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


pocketbase_admin_client = PocketBaseAdminClient()