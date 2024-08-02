import secrets
from typing import Dict, List

from ..models import ApiKey, ApiKeyCreate
from .supabase import SupabaseClient

class AdminService:
    def __init__(self, supabase: SupabaseClient):
      self.supabase = supabase

    def generate_api_key(self):
        return 'atk_' + secrets.token_urlsafe(32)

    def issue_apikey(self, key_to_create: ApiKeyCreate) -> ApiKey:
        key_to_create.key = self.generate_api_key()
        return self.supabase.save_apikey(key_to_create)

    def get_apikeys(self) -> List[ApiKey]:
        return self.supabase.fetch_apikeys()

    def delete_apikey(self, apikey_id: str) -> Dict:
        return self.supabase.delete_apikey(apikey_id)
