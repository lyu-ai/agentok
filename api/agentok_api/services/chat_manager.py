import asyncio
import os
from asyncio import subprocess
import signal
from termcolor import colored
from .supabase import SupabaseClient

from .output_parser import OutputParser


class ChatManager:
    def __init__(self, supabase: SupabaseClient):
        # Private dictionary to store references to subprocesses
        self._subprocesses = {}
        self.supabase = supabase

    async def _print_message(self, message):
        print("New message received:", message)

    def strip_prefix(self, input_string, substrings):
        # Loop through the list of substrings
        for substring in substrings:
            # Check if the substring is in the input
            if substring in input_string:
                # Find the index where the substring is found
                index = input_string.find(substring)
                # Return the remaining string starting with the found substring
                return input_string[index:]
        # If none of the substrings are found, return the original string
        return input_string

    async def run_assistant(
        self, chat_id: str, message: str, source_path: str, on_message=None
    ):
        # If on_message is None, fallback to default print
        if on_message is None:
            on_message = self._print_message

        command = ["python3", source_path, f'"{message}"']
        print(colored(text=f'Running {" ".join(command)}', color="blue"))

        env = os.environ.copy()
        env["PYTHONPATH"] = os.getcwd()

        # Check if there is already a subprocess for given chat_id
        if chat_id in self._subprocesses:
            print(
                colored(
                    text=f"Found existing subprocess for chat_id {chat_id}. Terminating...",
                    color="yellow",
                )
            )
            old_process_info = self._subprocesses[chat_id]
            old_process = old_process_info["process"]

            # Terminate the old process
            old_process.terminate()
            await old_process.wait()

        self.supabase.set_chat_status(chat_id, "running")

        # Remove the capture_output context manager as it might interfere with subprocess communication
        process = await asyncio.create_subprocess_exec(
            *command,
            env=env,
            stdout=subprocess.PIPE,
            stdin=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        # Store the process and its stdin so we can use it to send input later
        self._subprocesses[chat_id] = {"process": process, "stdin": process.stdin}

        output_parser = OutputParser(on_message=on_message)

        on_message(
            {
                "type": "assistant",
                "content": "__STATUS_RUNNING__",
            }
        )

        # Process the subprocess output until it terminates
        if process.stdout is not None:
            async for line in process.stdout:
                if line:
                    response_message = line.decode().rstrip()
                    # Use the configured logger
                    # logger.info(response_message)
                    print("📺 ", response_message)
                    if any(
                        status in response_message
                        for status in (
                            "__STATUS_RECEIVED_HUMAN_INPUT__",
                            "__STATUS_WAIT_FOR_HUMAN_INPUT__",
                        )
                    ):
                        on_message(
                            {
                                "type": "assistant",
                                "content": self.strip_prefix(
                                    response_message,
                                    (
                                        "__STATUS_RECEIVED_HUMAN_INPUT__",
                                        "__STATUS_WAIT_FOR_HUMAN_INPUT__",
                                    ),
                                ),
                            }
                        )
                        if "__STATUS_WAIT_FOR_HUMAN_INPUT__" in response_message:
                            self.supabase.set_chat_status(
                                chat_id, "wait_for_human_input"
                            )
                        else:
                            self.supabase.set_chat_status(chat_id, "running")
                    else:
                        output_parser.parse_line(response_message)

        # Wait for the subprocess to finish if it hasn't already
        await process.wait()

        # Cleanup happens here regardless of whether there was an error or not
        print(
            colored(text=f"Cleaning up subprocess for chat_id {chat_id}", color="green")
        )
        self._subprocesses.pop(chat_id, None)

        # Check the exit code of the subprocess to see if there were errors
        if process.returncode == -signal.SIGTERM:
            print(
                colored(
                    text=f"Assistant process {process.pid} terminated by user",
                    color="yellow",
                )
            )
            self.supabase.set_chat_status(chat_id, "aborted")
            on_message(
                {
                    "type": "assistant",
                    "content": "__STATUS_COMPLETED__ TERMINATED",
                }
            )
        elif process.returncode != 0:
            self.supabase.set_chat_status(chat_id, "failed")
            # Read the error message from stderr (optional)
            if process.stderr is not None:
                err = await process.stderr.read()
                error_message = err.decode().strip()
                print(
                    colored(
                        text=f"Assistant process exited with return code {process.returncode} and error message: {error_message}",
                        color="red",
                    )
                )
                # You might want to handle the error or propagate it
                # Splits the message by lines and takes the last one
                last_line = error_message.splitlines()[-1]
                on_message(
                    {
                        "type": "assistant",
                        "content": f"__STATUS_COMPLETED__ {process.returncode}: {last_line}",
                    }
                )
        else:
            self.supabase.set_chat_status(chat_id, "completed")
            on_message(
                {
                    "type": "assistant",
                    "content": "__STATUS_COMPLETED__ DONE",
                }
            )

    async def send_human_input(self, chat_id: str, user_input: str):
        proc_info = self._subprocesses.get(chat_id)
        if not proc_info:
            return {"error": f"No assistant found with that chat ID. {chat_id}"}

        try:
            # Send input to the process's stdin
            print("👤", user_input)
            proc_info["stdin"].write(user_input.encode() + b"\n")
            await proc_info["stdin"].drain()
            self.supabase.set_chat_status(chat_id, "running")
            return {"detail": "Input sent to assistant."}
        except Exception as e:
            return {"error": str(e)}

    async def abort_assistant(self, chat_id: str):
        proc_info = self._subprocesses.get(chat_id)
        if not proc_info:
            print(
                colored(
                    f"No assistant found with that chat ID. {chat_id}, {self._subprocesses}",
                    "red",
                )
            )
            return {"error": f"No assistant found with that chat ID. {chat_id}"}

        process = proc_info["process"]

        print(f"Terminating assistant {process.pid} for chat {chat_id}...")

        try:
            # First, try to terminate gracefully
            process.terminate()

            # Wait for a short time to see if the process exits
            try:
                await asyncio.wait_for(process.wait(), timeout=5.0)
                return {
                    "detail": f"Assistant for chat {chat_id} terminated gracefully."
                }
            except asyncio.TimeoutError:
                # If the process doesn't exit within 5 seconds, force kill it
                print(
                    f"Process for chat {chat_id} did not terminate gracefully. Forcing termination."
                )

                # On Unix-like systems, send SIGKILL
                if os.name != "nt":  # Not Windows
                    os.kill(process.pid, signal.SIGKILL)
                else:
                    # On Windows, use taskkill to forcefully terminate the process and its children
                    os.system(f"taskkill /F /T /PID {process.pid}")

                # Wait again to ensure the process is terminated
                await process.wait()

                return {
                    "detail": f"Assistant for chat {chat_id} forcefully terminated."
                }
        except Exception as e:
            return {"error": f"Error terminating assistant: {str(e)}"}
        finally:
            # Clean up the subprocess entry
            self._subprocesses.pop(chat_id, None)
            print(f"Assistant for chat {chat_id} terminated. Cleaning up.")
            self.supabase.set_chat_status(chat_id, "aborted")
