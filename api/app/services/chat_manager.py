import asyncio
import os
from asyncio import subprocess
import signal
from termcolor import colored

from .pocketbase_client import pocketbase_client

from .output_parser import OutputParser  # Assuming OutputParser is in `services/output_parser.py`

class ChatManager:
    def __init__(self):
        # Private dictionary to store references to subprocesses
        print(colored(text=f'Initializing ChatManager', color='green'))
        self._subprocesses = {}

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

    async def run_assistant(self, chat_id: str, message: str, source_path: str, on_message=None):
        # If on_message is None, fallback to default print
        if on_message is None:
            on_message = self._print_message

        command = ["python3", source_path, message]
        print(colored(text=f'Running {" ".join(command)}', color='green'))

        env = os.environ.copy()
        env['PYTHONPATH'] = os.getcwd()

        # Check if there is already a subprocess for given chat_id
        if chat_id in self._subprocesses:
            print(colored(text=f'Found existing subprocess for chat_id {chat_id}. Terminating...', color='yellow'))
            old_process_info = self._subprocesses[chat_id]
            old_process = old_process_info['process']

            # Terminate the old process
            old_process.terminate()
            # Optionally, you can also use old_process.kill() if terminate is not forceful enough

            # Wait for the process to terminate before moving on
            await old_process.wait()

        pocketbase_client.set_chat_status(chat_id, 'running')

        # Start the subprocess with the provided command
        process = await asyncio.create_subprocess_exec(
            *command,
            env=env,  # This is crucial when need to import local code such as app.extensions.dalle_agent
            stdout=subprocess.PIPE,
            stdin=subprocess.PIPE,
            stderr=subprocess.PIPE  # Capture stderr too, if you need to handle errors
        )

        # Store the process and its stdin so we can use it to send input later
        self._subprocesses[chat_id] = {"process": process, "stdin": process.stdin}

        output_parser = OutputParser(on_message=on_message)

        on_message({
            'type': 'assistant',
            'content': '__STATUS_RUNNING__',
        })

        # Process the subprocess output until it terminates
        async for line in process.stdout:
            if line:  # Truthy if the line is not empty
                response_message = line.decode().rstrip()  # Remove trailing newline/whitespace
                print('📺', response_message)
                if any(status in response_message for status in ('__STATUS_RECEIVED_HUMAN_INPUT__', '__STATUS_WAIT_FOR_HUMAN_INPUT__')):
                    on_message({
                        'type': 'assistant',
                        'content': self.strip_prefix(response_message, ('__STATUS_RECEIVED_HUMAN_INPUT__', '__STATUS_WAIT_FOR_HUMAN_INPUT__')),
                    })
                    if '__STATUS_WAIT_FOR_HUMAN_INPUT__' in response_message:
                        pocketbase_client.set_chat_status(chat_id, 'wait_for_human_input')
                    else:
                        pocketbase_client.set_chat_status(chat_id, 'running')
                else:
                    output_parser.parse_line(response_message)

        # Wait for the subprocess to finish if it hasn't already
        await process.wait()

        # Cleanup happens here regardless of whether there was an error or not
        print(colored(text=f'Cleaning up subprocess for chat_id {chat_id}', color='green'))
        self._subprocesses.pop(chat_id, None)

        # Check the exit code of the subprocess to see if there were errors
        if process.returncode == -signal.SIGTERM:
            print(colored(text=f'Assistant process terminated by user', color='yellow'))
            pocketbase_client.set_chat_status(chat_id, 'aborted')
            on_message({
                'type': 'assistant',
                'content': '__STATUS_COMPLETED__ TERMINATED',
            })
        elif process.returncode != 0:
            pocketbase_client.set_chat_status(chat_id, 'failed')
            # Read the error message from stderr (optional)
            err = await process.stderr.read()
            error_message = err.decode().strip()
            print(colored(text=f'Assistant process exited with return code {process.returncode} and error message: {error_message}', color='red'))
            # You might want to handle the error or propagate it
            # Splits the message by lines and takes the last one
            last_line = error_message.splitlines()[-1]
            on_message({
                'type': 'assistant',
                'content': f'__STATUS_COMPLETED__ {process.returncode}: {last_line}',
            })
        else:
            pocketbase_client.set_chat_status(chat_id, 'completed')
            on_message({
                'type': 'assistant',
                'content': '__STATUS_COMPLETED__ DONE',
            })

    async def send_human_input(self, chat_id: str, user_input: str):
        proc_info = self._subprocesses.get(chat_id)
        if not proc_info:
            return {"error": f"No assistant found with that chat ID. {chat_id}"}

        try:
            # Send input to the process's stdin
            print('👤', user_input)
            proc_info["stdin"].write(user_input.encode() + b'\n')
            await proc_info["stdin"].drain()
            pocketbase_client.set_chat_status(chat_id, 'running')
            return {"detail": "Input sent to assistant."}
        except Exception as e:
            return {"error": str(e)}

    async def abort_assistant(self, chat_id: str):
        proc_info = self._subprocesses.get(chat_id)
        if not proc_info:
            return {"error": f"No assistant found with that chat ID. {chat_id}"}

        try:
            proc_info["process"].terminate()
            await proc_info["process"].wait()
            return {"detail": f"Assistant for chat {chat_id} terminated."}
        except Exception as e:
            return {"error": str(e)}

chat_manager = ChatManager() # Create a singleton instance of ChatManager
