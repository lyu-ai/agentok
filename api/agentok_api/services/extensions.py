import pkgutil
import importlib

from ..extensions import ExtendedConversableAgent
from .supabase import SupabaseClient

class ExtensionService:
    def __init__(self, supabase: SupabaseClient, extensions_path: str):
        self.extensions_path = extensions_path
        self.supabase = supabase

    def load_extensions(self):
        extensions_metadata = []
        for _, name, _ in pkgutil.iter_modules([self.extensions_path]):
            module = importlib.import_module(f".{name}", "agentok_api.extensions")
            for attribute_name in dir(module):
                attribute = getattr(module, attribute_name)
                if isinstance(attribute, type) and issubclass(
                    attribute, ExtendedConversableAgent
                ):
                    # Ensure the attribute is not the base class itself
                    if attribute is not ExtendedConversableAgent:
                        # Collect the metadata instead of instantiating the class
                        if hasattr(attribute, "metadata"):
                            extensions_metadata.append(attribute.metadata)
        return extensions_metadata
