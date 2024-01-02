from fastapi import APIRouter, Depends
router = APIRouter()
from ..dependencies import oauth2_scheme

import pkgutil
import importlib
from autogen import ConversableAgent
from pathlib import Path

# Path to your 'extensions' directory, ensure this is correct relative to the file where this code runs
extensions_path = Path(__file__).parent.parent / 'extensions'

print('extensions_path', extensions_path)

def load_extensions():
    for (_, name, _) in pkgutil.iter_modules([extensions_path]):
        # Import the module
        module = importlib.import_module(f".{name}", 'app.extensions')
        # Iterate through attributes of the module
        for attribute_name in dir(module):
            attribute = getattr(module, attribute_name)
            # Check if the attribute is a class and is a subclass of ConversableAgent
            if isinstance(attribute, type) and issubclass(attribute, ConversableAgent) and attribute is not ConversableAgent:
                yield attribute.metadata

@router.get('/agents/extension', tags=["Agent"])
async def api_get_agents():
    return load_extensions()
