from datetime import datetime
import os
import tempfile

from ..models import Autoflow, User

from .dev_service import flow2py
from .chat_manager import chat_manager
from .pocketbase_client import PocketBaseClient  # Import your PocketBaseClient

class ChatService:
    def __init__(self, user: User, pocketbase_client: PocketBaseClient):
        self.user = user
        self.pocketbase_client = pocketbase_client  # Keep an instance of PocketBaseClient
        self.chat_manager = chat_manager  # Injecting PocketBaseClient instance

    async def get_chats(self):
        chats = self.pocketbase_client.get_chats(self.user)
        return chats

    async def create_chat(self, chat: dict):
        """Create a new chat session"""
        new_chat = self.pocketbase_client.create_chat(self.user, chat)
        return new_chat

    async def start_chat(self, message: dict, chat_id: str):
        # No matter what happnes next, persist the message to the database beforehand
        self.pocketbase_client.add_message(self.user, message)

        # Check the existence of latest code
        source = self.pocketbase_client.get_source_metadata(chat_id)
        datetime_obj = datetime.strptime(source['updated'], '%Y-%m-%d %H:%M:%S.%fZ')

        source_file = f"{source['id']}-{datetime_obj.timestamp()}.py"
        source_path = os.path.join(tempfile.gettempdir(), 'flowgen/generated/', source_file)

        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(source_path), exist_ok=True)

        if not os.path.exists(source_path):
            generated_code = flow2py(Autoflow(**source))
            with open(source_path, 'w', encoding='utf-8') as file:
                file.write(generated_code)

        # Launch the agent instance and intialize the chat
        def on_message(assistant_message):
            assistant_message['chat'] = chat_id
            assistant_message['owner'] = message.get('owner', None)
            self.pocketbase_client.add_message(self.user, assistant_message)

        # When it's time to run the assistant:
        return await self.chat_manager.run_assistant(chat_id, message.get('content', '\n'), source_path, on_message=on_message)

    async def human_input(self, message: dict, chat_id: str):
        self.pocketbase_client.add_message(self.user, message)

        # Then send human input to the running assistant
        return await self.chat_manager.send_human_input(chat_id, message.get('content', '\n'))