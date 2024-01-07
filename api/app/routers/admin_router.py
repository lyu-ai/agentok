from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from ..models import ApiKey, ApiKeyCreate
from ..services.admin_service import AdminService
from ..dependencies import oauth2_scheme, get_admin_service

router = APIRouter()

@router.get('/api-keys', summary=f"Get generated API keys", response_model=List[ApiKey])
async def get_apikeys(service: AdminService = Depends(get_admin_service), token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  return service.get_apikeys(token)

@router.post('/api-keys', summary=f"Generate API key", response_model=ApiKey)
async def issue_apikey(key_to_create: ApiKeyCreate, service: AdminService = Depends(get_admin_service), token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  return service.issue_apikey(token, key_to_create.model_dump())

@router.delete('/api-keys/{key_id}', summary=f"Delete API key")
async def delete_apikey(key_id: str, service: AdminService = Depends(get_admin_service), token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  return service.delete_apikey(token, key_id)
