from autogen import ConversableAgent

class ExtendedConversableAgent(ConversableAgent):
    def __init__(self, name, llm_config: dict, metadata=None, **kwargs):
        super().__init__(name=name, llm_config=llm_config, **kwargs)  # Initialize parent class
        if metadata is None:
            metadata = {}
        self.metadata = metadata
