from datetime import datetime
import os
from fastapi import APIRouter, Depends
import tempfile

from termcolor import colored

from ..schemas import Autoflow, Message
from ..utils import flow2py, add_message, get_source_metadata, run_assistant, send_human_input, set_chat_status
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/chats/{chat_id}/messages', tags=["Chat"])
async def api_start_chat(message: Message, chat_id: str, token: str = Depends(oauth2_scheme)):
    # No matter what happnes next, persist the message to the database beforehand
    add_message(token, message)

    # Check the existence of latest code
    source = get_source_metadata(token, chat_id)
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
        assistant_message['owner'] = message.owner
        add_message(token, assistant_message)

    await run_assistant(chat_id, message.content, source_path, on_message=on_message)

@router.post('/chats/{chat_id}/inputs', tags=["Chat"])
async def api_human_input(message: Message, chat_id: str, token: str = Depends(oauth2_scheme)):
    # No matter what happnes next, persist the message to the database beforehand
    add_message(token, message)

    return await send_human_input(chat_id, message.content)
