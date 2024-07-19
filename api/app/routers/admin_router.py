from typing import List
from fastapi import APIRouter, Depends

from ..models import ApiKey, ApiKeyCreate
from ..services.admin_service import AdminService
from ..dependencies import get_admin_service

router = APIRouter()

@router.get('/api-keys', summary=f"Get generated API keys", response_model=List[ApiKey])
async def get_apikeys(service: AdminService = Depends(get_admin_service)):
  return service.get_apikeys()

@router.post('/api-keys', summary=f"Generate API key", response_model=ApiKey)
async def issue_apikey(key_to_create: ApiKeyCreate, service: AdminService = Depends(get_admin_service)):
  print('key_to_create', key_to_create)
  return service.issue_apikey(key_to_create)

@router.delete('/api-keys/{key_id}', summary=f"Delete API key")
async def delete_apikey(key_id: str, service: AdminService = Depends(get_admin_service)):
  return service.delete_apikey(key_id)
