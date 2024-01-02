import asyncio
from asyncio import subprocess
import os
from termcolor import colored

from .pocketbase import add_message, set_chat_status
from .parser import OutputParser  # Assuming OutputParser is in output_parser.py

# Global dictionary to store references to subprocesses
# Structure: {chat_id: {"process": <process_obj>, "stdin": <StreamWriter_obj>}}
subprocesses = {}

# Callback example
def print_message(message):
    print("New message received:", message)

def strip_prefix(input_string, substrings):
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

async def run_assistant(chat_id: str, message: str, source_path: str, on_message=print_message):
    command = ["python3", source_path, message]
    print(colored(text=f'Running {" ".join(command)}', color='green'))

    env = os.environ.copy()
    env['PYTHONPATH'] = os.getcwd()

    # Check if there is already a subprocess for given chat_id
    if subprocesses.get(chat_id):
        print(colored(text=f'Found existing subprocess for chat_id {chat_id}. Terminating...', color='yellow'))
        old_process_info = subprocesses[chat_id]
        old_process = old_process_info['process']

        # Terminate the old process
        old_process.terminate()
        # Optionally, you can also use old_process.kill() if terminate is not forceful enough

        # Wait for the process to terminate before moving on
        await old_process.wait()

    # Start the subprocess with the provided command
    process = await asyncio.create_subprocess_exec(
        *command,
        env=env, # This is crucial when need to import local code such as app.extensions.dalle_agent
        stdout=subprocess.PIPE,
        stdin=subprocess.PIPE,
        stderr=subprocess.PIPE  # Capture stderr too, if you need to handle errors
    )

    # Store the process and its stdin so we can use it to send input later
    subprocesses[chat_id] = {"process": process, "stdin": process.stdin}

    output_parser = OutputParser(on_message=on_message)

    on_message({
        'type': 'assistant',
        'content': '__STATUS_RUNNING__',
    })

    # Process the subprocess output until it terminates
    async for line in process.stdout:
        if line:  # Truthy if the line is not empty
            response_message = line.decode().rstrip()  # Remove trailing newline/whitespace
            print('🤖', response_message)
            if any(status in response_message for status in ('__STATUS_RECEIVED_HUMAN_INPUT__', '__STATUS_WAIT_FOR_HUMAN_INPUT__')):
                on_message({
                    'type': 'assistant',
                    'content': strip_prefix(response_message, ('__STATUS_RECEIVED_HUMAN_INPUT__', '__STATUS_WAIT_FOR_HUMAN_INPUT__')),
                })
            else:
                output_parser.parse_line(response_message)
        else:
            break  # No more output, terminate loop

    # Wait for the subprocess to finish if it hasn't already
    await process.wait()

    # Cleanup happens here regardless of whether there was an error or not
    subprocesses.pop(chat_id, None)

    # Check the exit code of the subprocess to see if there were errors
    if process.returncode != 0:
        # Read the error message from stderr (optional)
        err = await process.stderr.read()
        error_message = err.decode().strip()
        print(f'Assistant process exited with return code {process.returncode} and error message: {error_message}')
        # You might want to handle the error or propagate it
        # Splits the message by lines and takes the last one
        last_line = error_message.splitlines()[-1]
        on_message({
            'type': 'assistant',
            'content': f'__STATUS_COMPLETED__ {process.returncode}: {last_line}',
        })
    else:
        on_message({
            'type': 'assistant',
            'content': '__STATUS_COMPLETED__ DONE',
        })

# Example of how to call `run_assistant`
# Ensure the event loop is running and call await run_assistant("<message>", "<source_path>")

async def send_human_input(chat_id: str, user_input: str):
    """Sends input to a running subprocess."""
    proc_info = subprocesses.get(chat_id)
    if not proc_info:
        return {"error": "No assistant found with that chat ID."}

    try:
        # Send input to the process's stdin
        proc_info["stdin"].write(user_input.encode() + b'\n')
        await proc_info["stdin"].drain()
        return {"detail": "Input sent to assistant."}
    except Exception as e:
        return {"error": str(e)}
