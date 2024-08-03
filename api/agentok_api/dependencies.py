from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional

from .services import ChatService,CodegenService,SupabaseClient,ExtensionService,AdminService,DatasetService, ToolService

from pathlib import Path
import logging

logger = logging.getLogger(__name__)

api_key_scheme = APIKeyHeader(name='X-API-Key', auto_error=False)
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
            print(f'Authenticated with tokens: {user.id}')
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

def get_extension_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> ExtensionService:
    extensions_path = Path(__file__).parent / 'extensions'
    return ExtensionService(supabase=supabase, extensions_path=extensions_path.as_posix())

def get_tool_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> ExtensionService:
    return ToolService(supabase=supabase)

def get_codegen_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> CodegenService:
    return CodegenService(supabase=supabase)

def get_dataset_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> DatasetService:
    return DatasetService(supabase)

def get_chat_service(
    codegen_service: CodegenService = Depends(get_codegen_service),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> ChatService:
    return ChatService(codegen_service=codegen_service, supabase=supabase)

def get_admin_service(supabase: SupabaseClient = Depends(get_supabase_client)) -> AdminService:
    return AdminService(supabase=supabase)