import logging
from functools import lru_cache
from pathlib import Path
from typing import Optional

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer

from .services import (
    AdminService,
    ChatService,
    CodegenService,
    ExtensionService,
    SupabaseClient,
    ToolService,
)

logger = logging.getLogger(__name__)

api_key_scheme = APIKeyHeader(name="X-API-Key", auto_error=False)
security_scheme = HTTPBearer(auto_error=False)


async def get_supabase_client(
    api_key: Optional[str] = Security(api_key_scheme),
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
) -> SupabaseClient:
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
    elif credentials:
        access_token = credentials.credentials
        user = supabase.authenticate_with_tokens(access_token)
        if user:
            print(f"Authenticated with tokens: {user.id}")
            logger.debug(f"User authenticated with tokens: {user}")
        else:
            logger.error("Authentication with tokens failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication with tokens failed",
            )
        return supabase
    else:
        logger.error("No authentication credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication credentials provided",
        )


def get_extension_service(
    supabase: SupabaseClient = Depends(get_supabase_client),
) -> ExtensionService:
    extensions_path = Path(__file__).parent / "extensions"
    return ExtensionService(
        supabase=supabase, extensions_path=extensions_path.as_posix()
    )


def get_tool_service(
    supabase: SupabaseClient = Depends(get_supabase_client),
) -> ExtensionService:
    return ToolService(supabase=supabase)


def get_codegen_service(
    supabase: SupabaseClient = Depends(get_supabase_client),
) -> CodegenService:
    return CodegenService(supabase=supabase)


# Using @lru_cache() effectively makes get_chat_service a singleton provider, as it caches the result of the first call and returns it for subsequent calls.
@lru_cache()
def create_chat_service(
    codegen_service: CodegenService, supabase: SupabaseClient
) -> ChatService:
    print("Creating ChatService singleton")
    return ChatService(codegen_service=codegen_service, supabase=supabase)


# Global variable to hold the singleton
chat_service_singleton = None


def get_chat_service(
    codegen_service: CodegenService = Depends(get_codegen_service),
    supabase: SupabaseClient = Depends(get_supabase_client),
) -> ChatService:
    global chat_service_singleton
    if chat_service_singleton is None:
        print("No global chat service singleton found. Creating...")
        chat_service_singleton = create_chat_service(codegen_service, supabase)
    return chat_service_singleton


def get_admin_service(
    supabase: SupabaseClient = Depends(get_supabase_client),
) -> AdminService:
    return AdminService(supabase=supabase)
