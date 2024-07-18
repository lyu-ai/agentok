from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from typing import Optional

from .models import User
from .services.chat_manager import chat_manager, ChatManager
from .services.chat_service import ChatService
from .services.codegen_service import CodegenService
from .services.supabase_client import SupabaseClient, supabase_client
from .services.extension_service import ExtensionService
from .services.admin_service import AdminService

from pathlib import Path
import logging

logger = logging.getLogger(__name__)

api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)
token = HTTPBearer()

async def get_current_user(
    api_key: Optional[str] = Security(api_key_header),
    credentials: HTTPAuthorizationCredentials = Security(token)
) -> User:
    logger.debug("Attempting to authenticate user")
    if credentials:
        logger.debug("Bearer token provided")
        try:
            token = credentials.credentials
            user = await supabase_client.authenticate_with_bearer(token)
            if user:
                logger.debug(f"User authenticated with bearer token: {user}")
                return user
        except HTTPException as e:
            logger.error(f"Bearer token authentication failed: {e.detail}")
            raise e
    elif api_key:
        logger.debug("API key provided")
        try:
            user = await supabase_client.authenticate_with_apikey(api_key)
            if user:
                logger.debug(f"User authenticated with API key: {user}")
                return user
        except HTTPException as e:
            logger.error(f"API key authentication failed: {e.detail}")
            raise e
    logger.error("Could not validate credentials")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

def get_extension_service(user: User = Depends(get_current_user)) -> ExtensionService:
    extensions_path = Path(__file__).parent / 'extensions'
    return ExtensionService(user=user, extensions_path=extensions_path)

def get_supabase_client() -> SupabaseClient:
    return supabase_client

def get_chat_manager() -> ChatManager:
    return chat_manager

def get_codegen_service(user: User = Depends(get_current_user)) -> CodegenService:
    return CodegenService(user=user, supabase_client=supabase_client)

def get_chat_service(
    user: User = Depends(get_current_user),
    codegen_service: CodegenService = Depends(get_codegen_service),
    supabase_client: SupabaseClient = Depends(get_supabase_client)
) -> ChatService:
    return ChatService(user=user, codegen_service=codegen_service, supabase_client=supabase_client)

def get_admin_service(user: User = Depends(get_current_user)) -> AdminService:
    return AdminService(user=user)