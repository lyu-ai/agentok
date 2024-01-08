from typing import List
from fastapi import APIRouter, Depends
from ..models import Chat, ChatCreate, Message
from ..services.chat_service import ChatService
from ..dependencies import get_chat_service

router = APIRouter()

@router.get('', summary="Get existing chats",  response_model=List[Chat])
async def get_chats(service: ChatService = Depends(get_chat_service)):
    return await service.get_chats()

@router.post('', response_model=Chat, summary="Create a new chat")
async def new_chat(chat_to_create: ChatCreate, service: ChatService = Depends(get_chat_service)):
    # print('chat_to_create', chat_to_create, chat_to_create.model_dump_json())
    return await service.create_chat(chat_to_create.model_dump())

@router.get('/{chat_id}', summary="Get chat status", response_model=Chat)
async def get_chat(chat_id: str, service: ChatService = Depends(get_chat_service)):
    return await service.get_chat(chat_id)

@router.post('/{chat_id}/messages', summary="Start chat")
async def start_chat(message: Message, chat_id: str, service: ChatService = Depends(get_chat_service)):
    return await service.start_chat(message.model_dump(), chat_id)

@router.post('/{chat_id}/input',
             summary="Send human input",
             description="Send human input to the chat. The current chat status must be `wait_for_human_input`.",
             )
async def send_human_input(message: Message, chat_id: str, service: ChatService = Depends(get_chat_service)):
    return await service.human_input(message.model_dump(), chat_id)