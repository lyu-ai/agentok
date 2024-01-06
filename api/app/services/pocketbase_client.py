import os
import requests
from fastapi import HTTPException, status
from typing import Dict, Literal
from dotenv import load_dotenv
load_dotenv()  # This will load all environment variables from .env

from ..models import Chat, ChatCreate, Message

class PocketBaseClient:
    def __init__(self):
        self.base_url = os.environ.get("POCKETBASE_URL")
        self.session = requests.Session()  # Utilizes a session object for connection pooling

    def _get_auth_headers(self, token: str) -> Dict[str, str]:
        return {"Authorization": f"Bearer {token}"}

    def get_chats(self, token: str) -> Dict:
        response = self.session.get(
            f'{self.base_url}/api/collections/chats/records',
            headers=self._get_auth_headers(token),
        )
        response.raise_for_status()
        get_result = response.json()
        return get_result.get('items', [])

    def create_chat(self, token: str, chat_to_create: dict) -> Dict:
        print('chat_to_create', chat_to_create)
        response = self.session.post(
            f'{self.base_url}/api/collections/chats/records',
            headers=self._get_auth_headers(token),
            json=chat_to_create
        )
        response.raise_for_status()
        return response.json()

    def add_message(self, token: str, message: dict) -> Dict:
        message_to_persist = message
        message_to_persist.pop('id', None)  # Should remove id for auto-generation
        response = self.session.post(
            f'{self.base_url}/api/collections/messages/records',
            headers=self._get_auth_headers(token),
            json=message_to_persist
        )
        response.raise_for_status()
        return response.json()

    def get_source_metadata(self, token: str, chat: str) -> Dict:
        response = requests.get(
          f'{self.base_url}/api/collections/chats/records/{chat}',
          headers={"Authorization": f"Bearer {token}"},
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
            headers={"Authorization": f"Bearer {token}"},
          )
          response.raise_for_status()
          return response.json()
        elif chat['from_type'] == 'template':
          response = requests.get(
            f'{self.base_url}/api/collections/templates/records/{chat["from_template"]}',
            headers={"Authorization": f"Bearer {token}"},
          )
          response.raise_for_status()
          return response.json()

    def set_chat_status(self, token: str, chat_id: str, status: Literal['running', 'wait_for_human_input']):
        print('set_chat_status', chat_id, status)
        response = requests.patch(
          f'{self.base_url}/api/collections/chats/records/{chat_id}',
          headers={"Authorization": f"Bearer {token}"},
          json={"status": status}
        )
        response.raise_for_status()
        return response.json()

# A single reusable client instance
pocketbase_client = PocketBaseClient()