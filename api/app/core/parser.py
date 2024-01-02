import json
import re

from ..utils.id import gen_id

class OutputParser:
    # Define states
    STATE_VERSION = 1
    STATE_CHAT = 2
    STATE_META = 3
    STATE_CONTENT = 4
    STATE_END_OF_MESSAGE = 5

    def __init__(self, on_message=None):
        # Initial state
        self.state = self.STATE_CHAT

        # Internal structure for captured data
        self.version = ""
        self.current_message = {}
        self.message_content = []
        self.on_message = on_message

        # Regular expression patterns
        self.version_pattern = re.compile(r'^\d+\.\d+\.\d+[a-z]?\d*')
        self.meta_pattern = re.compile(r'^>>>>>>>> (.*?)')
        self.from_to_pattern = re.compile(r'^(.*?) \(to (.*?)\):')
        self.end_pattern = re.compile(r'^-{80}')  # Assuming 80 dashes as a separator

    def parse_line(self, line):
        line = line.strip()

        if line == "":
            # Skip empty lines
            return

        if self.state == self.STATE_VERSION and self.version_pattern.match(line):
            # Capture the version once
            self.version = line
            self.state = self.STATE_CHAT
            return

        if self.state == self.STATE_CHAT and self.meta_pattern.match(line):
            # Meta information line detected
            self.current_message['meta'] = self.meta_pattern.match(line).group(1)
            self.state = self.STATE_CHAT
            return

        if self.state == self.STATE_CHAT and self.from_to_pattern.match(line):
            # Beginning of a new message
            self.current_message['sender'] = self.from_to_pattern.match(line).group(1)
            self.current_message['receiver'] = self.from_to_pattern.match(line).group(2)
            self.message_content = []  # Reset message content
            self.state = self.STATE_CONTENT
            return

        if self.state == self.STATE_CONTENT and not self.end_pattern.match(line):
            # Accumulate message content lines
            self.message_content.append(line)
            return

        if self.state == self.STATE_CONTENT and self.end_pattern.match(line):
            # End of message content
            self.current_message['content'] = "\n".join(self.message_content).strip()
            self.current_message['type'] = 'assistant'

            # Trigger the callback with the complete message
            if self.on_message:
                self.on_message(self.current_message)

            self.current_message = {}
            self.state = self.STATE_CHAT

    def parse_output(self, stdout):
        for line in stdout:
            self.parse_line(line)

