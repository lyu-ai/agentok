import asyncio
from asyncio import subprocess
from termcolor import colored

from .pocketbase import add_messsage
from .parser import OutputParser  # Assuming OutputParser is in output_parser.py

# Callback example
def print_message(message):
    print("New message received:", message)

async def run_assistant(message: str, source_path: str, on_message=print_message):
    command = ["python3", source_path, f'"{message}"']
    print(colored(text=f'Running {" ".join(command)}', color='green'))

    # Start the subprocess with the provided command
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE  # Capture stderr too, if you need to handle errors
    )

    output_parser = OutputParser(on_message=on_message)

    on_message({
        'type': 'assistant',
        'content': 'ASSISTANT_CHAT_BEGIN',
    })


    # Process the subprocess output until it terminates
    async for line in process.stdout:
        if line:  # Truthy if the line is not empty
            response_message = line.decode().rstrip()  # Remove trailing newline/whitespace
            print('🤖', response_message)
            output_parser.parse_line(response_message)
        else:
            break  # No more output, terminate loop

    # Wait for the subprocess to finish if it hasn't already
    await process.wait()

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
            'content': f'ASSISTANT_CHAT_END {process.returncode}: {last_line}',
        })
    else:
        on_message({
            'type': 'assistant',
            'content': 'ASSISTANT_CHAT_END DONE',
        })

# Example of how to call `run_assistant`
# Ensure the event loop is running and call await run_assistant("<message>", "<source_path>")