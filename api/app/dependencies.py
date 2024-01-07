from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from termcolor import colored

from .services.chat_manager import chat_manager, ChatManager
from .services.chat_service import ChatService
from .services.pocketbase_client import PocketBaseClient, pocketbase_client
from .services.extension_service import ExtensionService

from pathlib import Path

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# A function to be used as a dependency in your routers
def get_extension_service():
    extensions_path = Path(__file__).parent / 'extensions'
    return ExtensionService(extensions_path=extensions_path)

def get_pocketbase_client():
    return pocketbase_client

# Modify or create a new dependency function to provide a ChatManager instance
def get_chat_manager() -> ChatManager:
    return chat_manager

def get_chat_service(token: str = Depends(oauth2_scheme), pocketbase_client: PocketBaseClient = Depends(get_pocketbase_client)) -> ChatService:
    return ChatService(token=token, pocketbase_client=pocketbase_client)