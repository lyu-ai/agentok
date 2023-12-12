import json
import re
import subprocess
import threading
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import tempfile
from dotenv import load_dotenv

from tools.codegen import flow2py
from tools.supabase import add_message, delete_flow, get_chats, get_flow, get_flows, get_templates, publish_template, unpublish_template, upsert_chat, upsert_flow
load_dotenv()  # This will load all environment variables from .env

from tools.parser import parse_output

# Add the project directory to the Python path
sys.path.append(os.path.abspath('..'))

app = Flask(__name__)
CORS(app)

from mock.messages import mock_data

def run_subprocess(command, session):
    print('run_subprocess', command, session)
    # Start the process
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # If there is an input message, write it to the subprocess
    # if input_message:
    #     process.stdin.write(input_message + '\n')  # Ensure to add a newline character
    #     process.stdin.flush()

    # Monitor the process and capture the output
    add_message({
        "from": "__HIDDEN__",
        "to": "__HIDDEN__",
        "type": "assistant",
        "session": session,
        "content": """ASSISTANT_CHAT_BEGIN"""
    })
    output_messages = []
    error_messages = []
    while True:
        output = process.stdout.readline()
        if output:
            output_messages.append(output.strip())  # Update the global messages list
            if re.match(r'^-{80}', output): # Parse the output messages if the end pattern is detected
              parsed_output = parse_output(output_messages)
              [add_message(message | {'session': session}) for message in parsed_output['messages']]
              output_messages = []
        else:
            if process.poll() is not None:
              break  # If no more output and the process has ended

    # Read any remaining output from stdout (if any)
    remaining_output = process.stdout.read()
    if remaining_output:
        print(remaining_output, end='')  # Logging remaining stdout

    # Now let's process stderr for errors
    # Capture stderr line by line
    error_line = process.stderr.readline()
    while error_line:
        print(error_line, end='', file=sys.stderr)  # Logging stderr
        error_messages.append(error_line.strip())
        error_line = process.stderr.readline()

    # Check the rest of the stderr buffer (if any)
    remaining_errors = process.stderr.read()
    if remaining_errors:
        print(remaining_errors, end='', file=sys.stderr)  # Log remaining stderr

    # Now the process finished, check return code and decide what to do
    if process.returncode != 0:
        # There was an error
        print(f"Error executing subprocess: return code {process.returncode}", file=sys.stderr)

    # Handle the exit code & process status
    status_msg = "DONE" if process.returncode == 0 else f"ERROR {process.returncode}"
    add_message({
      "from": "__HIDDEN__",
      "to": "__HIDDEN__",
      "type": "assistant",
      "session": session,
      "content": "ASSISTANT_CHAT_END " + status_msg
    })

# This is the endpoint that will be called by the chatbot
@app.route('/api/messages', methods=['POST'])
def api_send_message():
    data = request.json
    try:
      data['type'] = 'user'
      add_message(data)
      session = data.get('session', '')
      if not session:
        raise Exception('Session not set in message')

      # Define the command to run the subprocess
      command = [sys.executable, f"./generated/{session}.py", data['content']]

      # Start subprocess in a new thread to prevent blocking the Flask server
      thread = threading.Thread(target=run_subprocess, args=(command,session))
      thread.start()
      return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
      # Log the error here
      print(e)
      # Return an error response
      return jsonify({"error": str(e)}), 400

temp_dir = tempfile.mkdtemp()
data_dir = os.path.join(temp_dir, 'data')
generated_dir = os.path.join(temp_dir, 'generated')

os.makedirs(data_dir, exist_ok=True)
os.makedirs(generated_dir, exist_ok=True)

@app.route('/api/flows', methods=['GET'])
def api_get_flows():
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401
    flows = get_flows(token)
    return jsonify(flows)

@app.route('/api/templates', methods=['GET'])
def api_get_templates():
    flows = get_templates()
    return jsonify(flows)

@app.route('/api/templates', methods=['POST'])
def api_publish_flow():
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    data.pop('id', None)
    flows = publish_template(token, data)
    return jsonify(flows)

@app.route('/api/templates/<id>', methods=['DELETE'])
def api_unpublish_template(id):
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401
    flows = unpublish_template(token, id)
    return jsonify(flows)

@app.route('/api/flows', methods=['POST'])
def api_upload_flow():
    data = request.json
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401
    try:
      flow_name = data.get('name')
      flow = data.get('flow')
      print('uploading flow', flow)

      upserted_flow = upsert_flow(token, data)

      if not os.path.exists(data_dir):
          os.makedirs(data_dir)
      data_path = os.path.join(data_dir, f'{flow_name}.json')
      # Save the json to the data folder
      with open(data_path, 'w', encoding='utf-8') as file:
          json.dump(flow, file, ensure_ascii=False, indent=4)

      # Save the generated code to the output file
      if not os.path.exists(generated_dir):
          os.makedirs(generated_dir)
      code_path = os.path.join(generated_dir, f'{flow_name}.py')
      with open(code_path, 'w', encoding='utf-8') as file:
        generated_code = flow2py(flow)
        file.write(generated_code)

      return jsonify(upserted_flow), 200
    except Exception as e:
      # Log the error here
      print("Failed upload flow: ", e)
      # Return an error response
      return jsonify({"error": str(e)}), 400

@app.route('/api/flows/<id>', methods=['GET'])
def api_get_flow(id):
    try:
        print(f"getting flow {id}")
        if (request.headers.get('Authorization') is None):
          return jsonify({"error": "Unauthorized (no header)"}), 401
        token = request.headers.get('Authorization').split(' ')[1]
        if not token:
          return jsonify({"error": "Unauthorized (invalid header)"}), 401
        flow = get_flow(token, id)
        if flow:
          return jsonify(flow), 200
        else:
          return jsonify({"error": f"Flow with id {id} not found"}), 404
        # data_path = os.path.join(data_dir, f'{id}.json')

        # # Open and read the JSON file
        # with open(data_path, 'r', encoding='utf-8') as file:
        #     # Load the file content into a Python object
        #     flow = json.load(file)

        # # Return the Python object as a JSON response
        # return jsonify(flow), 200
    # except FileNotFoundError:
    #     # Respond with a 404 error if the file is not found
    #     return jsonify({"error": f"Flow with id {id} not found"}), 404
    except Exception as e:
        # Log the error here
        print(e)
        # Return an error response for other potential errors
        return jsonify({"error": "Failed to retrieve flow"}), 500

@app.route('/api/flows/<id>', methods=['DELETE'])
def api_delete_flow(id):
    try:
        print(f"Deleting flow {id}")
        flow = delete_flow(id)
        return jsonify({"message": f"Flow {id} deleted"}), 200
        # data_path = os.path.join(data_dir, f'{id}.json')
        # if os.path.isfile(data_path):
        #     # Delete the file
        #     os.remove(data_path)
        #     return jsonify({"message": f"Flow {id} deleted"}), 200
        # else:
        #     # The file does not exist
        #     return jsonify({"error": f"Flow {id} not found"}), 404
    except Exception as e:
      error_id = uuid.uuid4()
      app.logger.error(f"Error ID {error_id}: Unable to delete flow {id}: {e}", exc_info=True)
      return jsonify({
            "error": "An unexpected error occurred.",
            "error_id": str(error_id)
        }), 500

@app.route('/api/chats', methods=['GET'])
def api_get_chats():
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401

    # Get the optional source_type query parameter
    source_type = request.args.get('source_type', None)  # Default to None if not provided

    chats = get_chats(token, source_type=source_type)
    return jsonify(chats)

@app.route('/api/chats', methods=['POST'])
def api_add_chat():
    if (request.headers.get('Authorization') is None):
      return jsonify({"error": "Unauthorized"}), 401
    token = request.headers.get('Authorization').split(' ')[1]
    if not token:
      return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    chat = upsert_chat(token, data)
    return jsonify(chat)

@app.route('/api/codegen', methods=['POST'])
def api_codegen():
    data = request.json
    try:
      generated_code = flow2py(data)
      print(generated_code)
      return jsonify({"code": generated_code}), 200
    except Exception as e:
      error = {"error": str(e)}
      print('error', error)
      return jsonify(error), 400

if __name__ == '__main__':
    # This disables the Flask reloader so updating ./data and ./generated will not restart the server
    # The side effect is that we need to manually restart the server when we update the code
    app.run(debug=True, use_reloader=True, host='localhost', port=5004)
