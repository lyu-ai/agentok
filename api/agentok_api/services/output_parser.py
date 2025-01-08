import re
import json


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
        self.version_pattern = re.compile(r"^\d+\.\d+\.\d+[a-z]?\d*")
        self.meta_pattern = re.compile(r"^>>>>>>>> (.*?)")
        self.from_to_pattern = re.compile(r"^(.*?) \(to (.*?)\):")
        self.end_pattern = re.compile(r"^-{80}")  # Assuming 80 dashes as a separator

        # Patterns for tool-related messages
        self.tool_response_pattern = re.compile(
            r"^\*\*\*\*\* Response from calling tool \((.*?)\) \*\*\*\*\*"
        )
        self.suggested_tool_call_pattern = re.compile(
            r"^\*\*\*\*\* Suggested tool call \((.*?)\): (.*?) \*\*\*\*\*"
        )
        self.arguments_pattern = re.compile(r"^Arguments:\s*(\{.*\})")

    def _reset_current_message(self):
        """Reset (or initialize) the current message structure."""
        self.current_message = {
            "version": "",
            "meta": {},
            "sender": "",
            "receiver": "",
            "content": "",
            "type": "assistant",  # Default to 'assistant'
        }
        self.message_content = []

    def parse_line(self, line):
        """
        Parse a single line of stdout depending on the current state.
        """
        line = line.strip()
        if line == "":
            # Skip empty lines
            return

        # Add handling for chat result
        if line.startswith("__CHAT_RESULT__ "):
            result = line.replace("__CHAT_RESULT__ ", "").strip()
            self.on_message({
                "type": "assistant",
                "content": result,
                "is_summary": True  # Optional flag to indicate this is the final result
            })
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
            self.current_message["version"] = line
            self.state = self.STATE_CHAT

    def _handle_chat_state(self, line):
        if self.meta_pattern.match(line):
            match = self.meta_pattern.match(line)
            if match:
                self.current_message["meta"]["general"] = match.group(1)
                self.current_message["type"] = "assistant"
        elif self.from_to_pattern.match(line):
            match = self.from_to_pattern.match(line)
            if match:
                self.current_message["sender"] = match.group(1)
                self.current_message["receiver"] = match.group(2)
                # Determine message type based on sender
                # TODO: This rule does not work when there is a tool call/response
                # self.current_message["type"] = (
                #     "user"
                #     if self.current_message["sender"].lower() == "user"
                #     else "assistant"
                # )
                self.current_message["type"] = "assistant"
                self.state = self.STATE_CONTENT
        elif self.end_pattern.match(line):
            self._end_of_message()

    def _handle_content_state(self, line):
        if self.end_pattern.match(line):
            self._end_of_message()
        elif self.tool_response_pattern.match(line):
            match = self.tool_response_pattern.match(line)
            if match:
                self.current_message["meta"]["tool_info"] = {
                    "type": "tool_response",
                    "meta": match.group(1),
                }
                # Ensure type is 'assistant' for tool responses
                self.current_message["type"] = "assistant"
        elif self.suggested_tool_call_pattern.match(line):
            match = self.suggested_tool_call_pattern.match(line)
            if match:
                self.current_message["meta"]["tool_info"] = {
                    "type": "suggested_tool_call",
                    "meta": match.group(1),
                    "tool": match.group(2),
                }
                # Ensure type is 'assistant' for suggested tool calls
                self.current_message["type"] = "assistant"
        elif (
            self.arguments_pattern.match(line)
            and self.current_message["meta"].get("tool_info", {}).get("type")
            == "suggested_tool_call"
        ):
            match = self.arguments_pattern.match(line)
            if match:
                try:
                    self.current_message["meta"]["tool_info"]["arguments"] = json.loads(
                        match.group(1).replace("'", '"')
                    )
                except json.JSONDecodeError:
                    self.current_message["meta"]["tool_info"]["arguments"] = None
        else:
            # Filter out redundant 'User (to Assistant):' lines and trailing asterisks
            if not (
                self.from_to_pattern.match(line)
                and self.message_content
                and self.message_content[-1] == line
            ):
                if (
                    not line == "User (to Assistant):"
                    and not line.startswith("*****")
                    and not line.startswith("Arguments:")
                ):
                    self.message_content.append(line)

    def _end_of_message(self):
        self.current_message["content"] = "\n".join(self.message_content).strip()

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
