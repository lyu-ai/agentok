from fastapi import APIRouter, Depends
from typing import List
from ..models import Tool, ToolCreate
from ..services import ToolService
from ..dependencies import get_tool_service

router = APIRouter()

@router.get('', summary="Get all tools", response_model=List[Tool])
async def get_tools(service: ToolService = Depends(get_tool_service)):
    return await service.get_tools()

@router.post('', summary="Create a new tool", response_model=Tool)
async def create_tool(tool: ToolCreate, service: ToolService = Depends(get_tool_service)):
    return await service.create_tool(tool)

@router.get('/{tool_id}', summary="Get a tool", response_model=Tool)
async def get_tool(tool_id: str, service: ToolService = Depends(get_tool_service)):
    return await service.get_tool(tool_id)

@router.delete('/{tool_id}', summary="Delete a tool", response_model=dict)
async def delete_tool(tool_id: str, service: ToolService = Depends(get_tool_service)):
    return await service.delete_tool(tool_id)

@router.put('/{tool_id}', summary="Update a tool", response_model=Tool)
async def update_tool(tool_id: str, tool: ToolCreate, service: ToolService = Depends(get_tool_service)):
    return await service.update_tool(tool_id, tool)
