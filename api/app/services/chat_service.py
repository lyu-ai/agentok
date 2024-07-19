from datetime import datetime
import os
import tempfile
from typing import List

from .codegen_service import CodegenService
from ..models import Chat, ChatCreate, MessageCreate, Message, Project
from .chat_manager import ChatManager
from .supabase_client import SupabaseClient  # Import your SupabaseClient

class ChatService:
    def __init__(self, supabase: SupabaseClient, codegen_service: CodegenService):
        self.codegen_service = codegen_service  # Injecting CodegenService instance
        self.supabase = supabase  # Keep an instance of SupabaseClient
        self.chat_manager = ChatManager(supabase)  # Injecting SupabaseClient instance

    async def get_chats(self) -> List[Chat]:
        chats = self.supabase.get_chats()
        return chats

    async def get_chat(self, chat_id: str) -> Chat:
        chat = self.supabase.get_chat(chat_id)
        return chat

    async def create_chat(self, chat: ChatCreate) -> Chat:
        """Create a new chat session"""
        new_chat = self.supabase.create_chat(chat)
        return new_chat

    async def start_chat(self, message: MessageCreate, chat_id: str):
        # No matter what happnes next, persist the message to the database beforehand
        self.supabase.add_message(message, chat_id)

        # Check the existence of latest code
        source = self.supabase.get_source_metadata(chat_id)
        datetime_obj = datetime.fromisoformat(source['updated_at'])

        source_file = f"{source['id']}-{datetime_obj.timestamp()}.py"
        source_path = os.path.join(tempfile.gettempdir(), 'agentok/generated/', source_file)

        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(source_path), exist_ok=True)

        if not os.path.exists(source_path):
            generated_code = self.codegen_service.project2py(Project(**source))
            with open(source_path, 'w', encoding='utf-8') as file:
                file.write(generated_code)

        # Launch the agent instance and intialize the chat
        def on_message(assistant_message):
            self.supabase.add_message(MessageCreate(**assistant_message), chat_id)

        # When it's time to run the assistant:
        return await self.chat_manager.run_assistant(chat_id, message.content or '\n', source_path, on_message)

    async def abort_chat(self, chat_id: str):
        return await self.chat_manager.abort_assistant(chat_id)

    async def human_input(self, message: MessageCreate, chat_id: str):
        self.supabase.add_message(message, chat_id)

        # Then send human input to the running assistant
        return await self.chat_manager.send_human_input(chat_id, message.content or '\n')