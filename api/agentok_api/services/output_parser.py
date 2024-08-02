import re

class OutputParser:

    # Define states as class-level immutable constants
    STATE_VERSION = 1
    STATE_CHAT = 2
    STATE_META = 3
    STATE_CONTENT = 4
    STATE_END_OF_MESSAGE = 5

    def __init__(self, on_message=None):
        # Initial state
        self.state = self.STATE_CHAT
        self.on_message = on_message

        # Initialize patterns
        self._initialize_patterns()

        # Data structure for current parsed message
        self._reset_current_message()

    def _initialize_patterns(self):
        """Compile regex patterns."""
        self.version_pattern = re.compile(r'^\d+\.\d+\.\d+[a-z]?\d*')
        self.meta_pattern = re.compile(r'^>>>>>>>> (.*?)')
        self.from_to_pattern = re.compile(r'^(.*?) \(to (.*?)\):')
        self.end_pattern = re.compile(r'^-{80}')  # Assuming 80 dashes as a separator

    def _reset_current_message(self):
        """Reset (or initialize) the current message structure."""
        self.current_message = {'version': '', 'meta': '', 'sender': '', 'receiver': '', 'content': '', 'type': 'assistant'}
        self.message_content = []

    def parse_line(self, line):
        """
        Parse a single line of stdout depending on the current state.
        """
        line = line.strip()
        if line == "":
            # Skip empty lines
            return

        handlers = {
            self.STATE_VERSION: self._handle_version_state,
            self.STATE_CHAT: self._handle_chat_state,
            self.STATE_CONTENT: self._handle_content_state,
        }

        handler = handlers.get(self.state, lambda x: None)
        handler(line)

    def _handle_version_state(self, line):
        if self.version_pattern.match(line):
            self.current_message['version'] = line
            self.state = self.STATE_CHAT

    def _handle_chat_state(self, line):
        if self.meta_pattern.match(line):
            match = self.meta_pattern.match(line)
            if match:
                self.current_message['meta'] = match.group(1)
        elif self.from_to_pattern.match(line):
            match = self.from_to_pattern.match(line)
            if match:
                self.current_message['sender'] = match.group(1)
                self.current_message['receiver'] = match.group(2)
                self.state = self.STATE_CONTENT
        elif self.end_pattern.match(line):
            self._end_of_message()

    def _handle_content_state(self, line):
        if self.end_pattern.match(line):
            self._end_of_message()
        else:
            self.message_content.append(line)

    def _end_of_message(self):
        self.current_message['content'] = "\n".join(self.message_content).strip()

        if self.on_message:
            self.on_message(self.current_message)

        # Prepare for the next message
        self._reset_current_message()
        self.state = self.STATE_CHAT

    def parse_output(self, stdout):
        """
        Parse multiple lines of output from stdout.
        """
        for line in stdout:
            self.parse_line(line)