from fastapi import Depends, HTTPException, Header, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional

from gotrue import User
from .services.chat_service import ChatService
from .services.codegen_service import CodegenService
from .services.supabase_client import SupabaseClient
from .services.extension_service import ExtensionService
from .services.admin_service import AdminService

from pathlib import Path
import logging

logger = logging.getLogger(__name__)

api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

security = HTTPBearer()

async def get_supabase_client(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    api_key: Optional[str] = Security(api_key_header),
) -> User:
    supabase = SupabaseClient()
    logger.debug("Attempting to authenticate user")
    if api_key:
        logger.debug("API key provided")
        user = supabase.authenticate_with_apikey(api_key)
        if user:
            logger.debug(f"User authenticated with API key: {user}")
        else:
            logger.error("API key authentication failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API key authentication failed",
            )
        return supabase
    else:
        access_token = credentials.credentials
        user = supabase.authenticate_with_tokens(access_token)
        if user:
            print(f'Authenticated with tokens: {user.id}')
            logger.debug(f"User authenticated with tokens: {user}")
        else:
            logger.error("Authentication with tokens failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication with tokens failed",
            )
        return supabase

def get_extension_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> ExtensionService:
    extensions_path = Path(__file__).parent / 'extensions'
    return ExtensionService(supabase=supabase, extensions_path=extensions_path)

def get_codegen_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> CodegenService:
    return CodegenService(supabase=supabase)

def get_chat_service(
    codegen_service: CodegenService = Depends(get_codegen_service),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> ChatService:
    return ChatService(codegen_service=codegen_service, supabase=supabase)

def get_admin_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> AdminService:
    return AdminService(supabase=supabase)