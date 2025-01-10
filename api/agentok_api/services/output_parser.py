import re
import json
from dataclasses import dataclass
from typing import List, Dict, Optional
import ast

from fastapi import logger

@dataclass
class ChatResult:
    chat_id: Optional[str]
    chat_history: List[Dict[str, str]]
    summary: str
    cost: Dict
    human_input: List

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
        self.next_speaker_pattern = re.compile(r"^Next speaker: (.*?)$")

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
            "metadata": {},
            "sender": "",
            "receiver": "",
            "content": "",
            "type": "assistant",  # Default to 'assistant'
        }
        self.message_content = []

    def parse_line(self, line: str):
        """Parse a single line of output.
        
        This method maintains state between calls and handles different types of output:
        - Chat messages
        - Status updates
        - Chat results
        """
        # Skip empty lines
        if not line:
            return

        # Handle status messages first
        if self._handle_status_message(line):
            return

        # Handle chat results
        if "__CHAT_RESULT__ " in line:
            result = self.parse_chat_result(line)
            if result:
                self.on_message({
                    "type": "summary",
                    "content": result.summary,
                    "metadata": {
                        "summary": result.summary,
                        "chat_history": result.chat_history,
                        "cost": result.cost,
                        "human_input": result.human_input
                    },
                })
            else:
                print(f"Error parsing chat result: {line}")
            return

        # Handle multiple chat results
        if "__CHAT_RESULTS__ " in line:
            results = self.parse_chat_results(line)
            if results:
                # Combine all results into one message
                self.on_message({
                    "type": "summary",
                    "content": "\n\n".join(r.summary.strip() for r in results).strip(),
                    "metadata": {
                        "summaries": [result.summary for result in results],
                        "chat_histories": [result.chat_history for result in results],
                        "costs": [result.cost for result in results],
                        "human_inputs": [result.human_input for result in results]
                    },
                })
            else:
                print(f"Error parsing chat results: {line}")
            return

        # Handle normal chat messages
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
                self.current_message["metadata"]["general"] = match.group(1)
                self.current_message["type"] = "assistant"
        elif self.next_speaker_pattern.match(line):
            match = self.next_speaker_pattern.match(line)
            if match:
                # Store next speaker info in metadata
                self.current_message["metadata"]["next_speaker"] = match.group(1)
        elif self.from_to_pattern.match(line):
            match = self.from_to_pattern.match(line)
            if match:
                self.current_message["sender"] = match.group(1)
                self.current_message["receiver"] = match.group(2)
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
                self.current_message["metadata"]["tool_info"] = {
                    "type": "tool_response",
                    "meta": match.group(1),
                }
                # Ensure type is 'assistant' for tool responses
                self.current_message["type"] = "assistant"
        elif self.suggested_tool_call_pattern.match(line):
            match = self.suggested_tool_call_pattern.match(line)
            if match:
                self.current_message["metadata"]["tool_info"] = {
                    "type": "suggested_tool_call",
                    "meta": match.group(1),
                    "tool": match.group(2),
                }
                # Ensure type is 'assistant' for suggested tool calls
                self.current_message["type"] = "assistant"
        elif (
            self.arguments_pattern.match(line)
            and self.current_message["metadata"].get("tool_info", {}).get("type")
            == "suggested_tool_call"
        ):
            match = self.arguments_pattern.match(line)
            if match:
                try:
                    self.current_message["metadata"]["tool_info"]["arguments"] = json.loads(
                        match.group(1).replace("'", '"')
                    )
                except json.JSONDecodeError:
                    self.current_message["metadata"]["tool_info"]["arguments"] = None
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

    def parse_chat_result(self, result_str: str) -> Optional[ChatResult]:
        """Parse a chat result string into a ChatResult object.
        
        Args:
            result_str: The string containing the chat result in JSON format
            
        Returns:
            Optional[ChatResult]: The parsed chat result, or None if parsing failed
        """
        try:
            # Remove the "__CHAT_RESULT__ " prefix
            clean_str = result_str.replace("__CHAT_RESULT__ ", "")
            
            # Parse the JSON string
            result_dict = json.loads(clean_str)
            
            # Convert the dictionary to a ChatResult object
            return ChatResult(**result_dict)
            
        except Exception as e:
            logger.error(f"Error parsing chat result: {e}")
            logger.error(f"Input string was: {result_str}")
            return None

    def parse_chat_results(self, results_str: str) -> Optional[List[ChatResult]]:
        """Parse multiple chat results string into a list of ChatResult objects.
        
        Args:
            results_str: The string containing multiple chat results in JSON format
            
        Returns:
            Optional[List[ChatResult]]: The parsed chat results, or None if parsing failed
        """
        try:
            # Remove the "__CHAT_RESULTS__ " prefix
            clean_str = results_str.replace("__CHAT_RESULTS__ ", "")
            
            # Parse the JSON string
            results_list = json.loads(clean_str)
            
            # Convert each dictionary to a ChatResult object
            return [ChatResult(**result_dict) for result_dict in results_list]
            
        except Exception as e:
            logger.error(f"Error parsing chat results: {e}")
            logger.error(f"Input string was: {results_str}")
            return None

    def _handle_status_message(self, message: str) -> bool:
        """
        Handle status messages and return True if the message was a status message.
        Returns False otherwise.
        """
        status_prefixes = [
            "__STATUS_RECEIVED_HUMAN_INPUT__",
            "__STATUS_WAIT_FOR_HUMAN_INPUT__",
            "__STATUS_COMPLETED__"
        ]
        
        for prefix in status_prefixes:
            if prefix in message:
                content = self._strip_prefix(message, status_prefixes)
                self.on_message({
                    "type": "assistant",
                    "content": content,
                })
                return True
        return False

    def _strip_prefix(self, input_string: str, substrings: list[str]) -> str:
        """Strip status prefix from a message."""
        for substring in substrings:
            if substring in input_string:
                index = input_string.find(substring)
                return input_string[index:]
        return input_string

    def get_chat_status(self, message: str) -> Optional[str]:
        """
        Determine chat status from a message.
        Returns None if the message doesn't indicate a status change.
        """
        if "__STATUS_WAIT_FOR_HUMAN_INPUT__" in message:
            return "wait_for_human_input"
        elif "__STATUS_RECEIVED_HUMAN_INPUT__" in message:
            return "running"
        elif "__STATUS_COMPLETED__" in message:
            if "TERMINATED" in message:
                return "aborted"
            elif any(str(i) for i in range(10) if str(i) in message):
                return "failed"
            else:
                return "completed"
        return None
