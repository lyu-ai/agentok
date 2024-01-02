
import asyncio
import subprocess

from fastapi import APIRouter, BackgroundTasks, Depends, WebSocket, WebSocketDisconnect
from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do
from ..schemas import Message, Autoflow
from ..core.codegen import flow2py
from ..dependencies import oauth2_scheme
connected_websockets = set()

router = APIRouter()


# Set up the Jinja2 environment
env = Environment(
    loader=FileSystemLoader(searchpath="./templates/"),
    autoescape=select_autoescape(),
    extensions=[do]
)

# Generate and execute the code asynchronously
@router.post("/execute-code/{flow_name}", tags=["Chat"])
async def execute_code(flow_name: str, flow: Autoflow, message: Message, background_tasks: BackgroundTasks, token: str = Depends(oauth2_scheme)):
    generated_dir = './generated/'

    # Generate the code using Jinja2 templates
    generated_code = flow2py(flow)

    # Define the function to execute the code
    async def execute(websocket, generated_code, message):
        # Execute the generated code asynchronously
        command = ["python", f"{generated_dir}/{flow_name}.py", message]
        process = await asyncio.create_subprocess_exec(*command, stdout=subprocess.PIPE)

        while True:
            # Read the stdout line by line
            line = await process.stdout.readline()
            if line:
                # Send the intermediate result to the client
                await websocket.send_text(line.decode())
            else:
                # Execution completed, break the loop
                break

        # Store the output in a database (e.g., PocketBase)
        print('store the output in a database')

    async def websocket_handler(websocket: WebSocket):
        await websocket.accept()
        connected_websockets.add(websocket)
        try:
            await execute(websocket, generated_code, message)
        finally:
            connected_websockets.remove(websocket)

    # Schedule the code execution in the background
    background_tasks.add_task(websocket_handler)  # pass the websocket_handler directly
    
    return {"message": "Code execution scheduled."}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        connected_websockets.remove(websocket)