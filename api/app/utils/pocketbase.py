import os
from typing import Literal
from fastapi import HTTPException, status
import requests

from dotenv import load_dotenv

from ..schemas import Message
load_dotenv()  # This will load all environment variables from .env

POCKETBASE_URL: str = os.environ.get("POCKETBASE_URL")

def add_message(token: str, message: Message):
  # Send requests to PocketBase instance
  message_to_persist = dict(message)
  message_to_persist.pop('id', None) # Should remove id for auto-generation
  response = requests.post(
    f'{POCKETBASE_URL}/api/collections/messages/records',
    headers={"Authorization": f"Bearer {token}"},
    json=message_to_persist
  )
  response.raise_for_status()
  return response.json()

def get_source_metadata(token: str, chat: str):
  response = requests.get(
    f'{POCKETBASE_URL}/api/collections/chats/records/{chat}',
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
      f'{POCKETBASE_URL}/api/collections/flows/records/{chat["from_flow"]}',
      headers={"Authorization": f"Bearer {token}"},
    )
    response.raise_for_status()
    return response.json()
  elif chat['from_type'] == 'template':
    response = requests.get(
      f'{POCKETBASE_URL}/api/collections/templates/records/{chat["from_template"]}',
      headers={"Authorization": f"Bearer {token}"},
    )
    response.raise_for_status()
    return response.json()

def set_chat_status(token: str, chat_id: str, status: Literal['running', 'wait_for_human_input']):
  print('set_chat_status', chat_id, status)
  response = requests.patch(
    f'{POCKETBASE_URL}/api/collections/chats/records/{chat_id}',
    headers={"Authorization": f"Bearer {token}"},
    json={"status": status}
  )
  response.raise_for_status()
  return response.json()