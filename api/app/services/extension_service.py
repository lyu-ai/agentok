from autogen import ConversableAgent
from pathlib import Path
import pkgutil
import importlib

class ExtensionService:
    def __init__(self, user: dict, extensions_path: Path):
        self.extensions_path = extensions_path
        self.user = user

    def load_extensions(self):
        extensions = []
        for (_, name, _) in pkgutil.iter_modules([self.extensions_path]):
            module = importlib.import_module(f".{name}", 'app.extensions')
            for attribute_name in dir(module):
                attribute = getattr(module, attribute_name)
                if isinstance(attribute, type) and issubclass(attribute, ConversableAgent) and attribute is not ConversableAgent:
                    extensions.append(attribute.metadata)
        return extensions