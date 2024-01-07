import secrets
from typing import Dict
from .pocketbase_admin_client import pocketbase_admin_client

class AdminService:
    def __init__(self):
      self.client = pocketbase_admin_client

    def generate_api_key(self):
        return 'fg_' + secrets.token_urlsafe(32)

    def issue_apikey(self, token: str, key_to_create: dict) -> Dict:
        auth_info = self.client.get_auth_info(token)

        key_to_create['owner'] = auth_info.get('id')
        key_to_create['key'] = self.generate_api_key()

        return self.client.save_apikey(key_to_create)

    def verify_apikey(self, apikey: str, token: str) -> Dict:
        auth_info = self.client.get_auth_info(token)

        return self.client.verify_apikey(apikey, auth_info.get('id'))

    def get_apikeys(self, token: str) -> Dict:
        auth_info = self.client.get_auth_info(token)

        return self.client.get_apikeys(auth_info.get('id'))

    def delete_apikey(self, token: str, apikey_id: str) -> Dict:
        auth_info = self.client.get_auth_info(token)
        key_info = self.client.get_apikey(apikey_id)

        if key_info.get('owner') != auth_info.get('id'):
            raise Exception('Not allowed to delete this apikey')

        return self.client.delete_apikey(apikey_id)
