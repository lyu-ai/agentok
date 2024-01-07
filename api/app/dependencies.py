from enum import auto
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from regex import F
from termcolor import colored

from .models import User

from .services.chat_manager import chat_manager, ChatManager
from .services.chat_service import ChatService
from .services.pocketbase_client import PocketBaseClient, pocketbase_client
from .services.extension_service import ExtensionService
from .services.admin_service import AdminService

from pathlib import Path

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)
api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

async def get_current_user(
    api_key: str = Security(api_key_header),
    token: str = Depends(oauth2_scheme),
) -> User:
    print('api_key', api_key)
    if token:
        # Here you would validate the bearer token
        user = await pocketbase_client.authenticate_with_bearer(token)
        if user:
            return user
    elif api_key:
        # Here you would validate the API key
        user = await pocketbase_client.authenticate_with_apikey(api_key)
        if user:
            return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

# A function to be used as a dependency in your routers
def get_extension_service(user: User = Depends(get_current_user)):
    extensions_path = Path(__file__).parent / 'extensions'
    return ExtensionService(user=user, extensions_path=extensions_path)

def get_pocketbase_client():
    return pocketbase_client

def get_chat_manager() -> ChatManager:
    return chat_manager

def get_chat_service(user: User = Depends(get_current_user), pocketbase_client: PocketBaseClient = Depends(get_pocketbase_client)) -> ChatService:
    print('get_chat_service', user)
    return ChatService(user=user, pocketbase_client=pocketbase_client)

def get_admin_service(user: User = Depends(get_current_user)) -> AdminService:
    return AdminService(user=user)