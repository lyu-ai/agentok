from autogen import ConversableAgent
from pathlib import Path
import pkgutil
import importlib

from ..common.base_classes import ExtendedConversableAgent

from .supabase_client import SupabaseClient

class ExtensionService:
    def __init__(self, supabase: SupabaseClient, extensions_path: str):
        self.extensions_path = extensions_path
        self.supabase = supabase

    def load_extensions(self):
        extensions = []
        for (_, name, _) in pkgutil.iter_modules([self.extensions_path]):
            module = importlib.import_module(f".{name}", 'app.extensions')
            for attribute_name in dir(module):
                attribute = getattr(module, attribute_name)
                if isinstance(attribute, type) and issubclass(attribute, ExtendedConversableAgent):
                    extensions.append(attribute.metadata)
        return extensions