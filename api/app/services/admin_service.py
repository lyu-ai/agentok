import secrets
from typing import Dict, List

from ..models import ApiKey, ApiKeyCreate
from .supabase_client import SupabaseClient

class AdminService:
    def __init__(self, supabase: SupabaseClient):
      self.supabase = supabase

    def generate_api_key(self):
        return 'atk_' + secrets.token_urlsafe(32)

    def issue_apikey(self, key_to_create: ApiKeyCreate) -> Dict:
        key_to_create.key = self.generate_api_key()
        return self.supabase.save_apikey(key_to_create)

    def get_apikeys(self) -> List[ApiKey]:
        return self.supabase.get_apikeys()

    def delete_apikey(self, apikey_id: str) -> Dict:
        key_info = self.supabase.get_apikey(apikey_id)

        if key_info.get('user_id') != self.user.id:
            raise Exception('Not allowed to delete this apikey')

        return self.supabase.delete_apikey(apikey_id)
