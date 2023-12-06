import json
import re

from tools.id import gen_id

def parse_output(output_lines):
    print('parse_output', output_lines)
    # Define states
    STATE_VERSION = 1
    STATE_CHAT = 2
    STATE_META = 3
    STATE_CONTENT = 4
    STATE_END_OF_MESSAGE = 5

    # Initial state
    state = STATE_CHAT

    # Initialize structures to store parsed information
    version = ""
    messages = []
    current_message = {}
    message_content = []

    # Regular expression patterns
    version_pattern = re.compile(r'^\d+\.\d+\.\d+[a-z]?\d*')
    meta_pattern = re.compile(r'^>>>>>>>> (.*?)')
    from_to_pattern = re.compile(r'^(.*?) \(to (.*?)\):')
    end_pattern = re.compile(r'^-{80}')  # Assuming 80 dashes as a separator

    for line in output_lines:
        line = line.strip()

        if line == "":
            # Skip empty lines
            continue

        if state == STATE_VERSION and version_pattern.match(line):
            # Capture the version once
            version = line
            state = STATE_CHAT
            continue

        if state == STATE_CHAT and meta_pattern.match(line):
            # Meta information line detected
            current_message['meta'] = meta_pattern.match(line).group(1)
            print(current_message, line)
            state = STATE_CHAT
            continue

        if state == STATE_CHAT and from_to_pattern.match(line):
            # Beginning of a new message
            current_message['from'] = from_to_pattern.match(line).group(1)
            current_message['to'] = from_to_pattern.match(line).group(2)
            message_content = []  # Reset message content
            state = STATE_CONTENT
            continue

        if state == STATE_CONTENT and not end_pattern.match(line):
            # Accumulate message content lines
            message_content.append(line)
            continue

        if state == STATE_CONTENT and end_pattern.match(line):
            # End of message content
            current_message['id'] = gen_id()
            current_message['content'] = "\n".join(message_content).strip()
            current_message['type'] = 'assistant'
            messages.append(current_message)
            current_message = {}
            state = STATE_CHAT

    # # Add the last message if there is one when the output ends
    # if current_message and 'message' in current_message:
    #     messages.append(current_message)

    return {
        'version': version,
        'messages': messages,
        'status': 'OK' if 'DONE' in output_lines else "WORKING"
    }

# # Example usage:
# output_text = """❯ python3 ./flow-launcher.py
# 0.2.0b5
# Start Chat (to Image Agent):

# What's the breed of this dog?
# <image>.

# --------------------------------------------------------------------------------

# >>>>>>>> USING AUTO REPLY...
# Image Agent (to Start Chat):

# This adorable puppy appears to be a Goldendoodle, which is a crossbreed between a Golden Retriever and a Poodle. They are known for their curly, hypoallergenic coats and friendly disposition.

# --------------------------------------------------------------------------------
# Process finished successfully"""

# # Split the output text into lines
# output_lines = output_text.strip().split('\n')

# # Parse the output and print the JSON
# json_output = parse_output(output_lines)
# print(json_output)