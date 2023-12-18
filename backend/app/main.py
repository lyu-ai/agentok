from fastapi import FastAPI
from .routers import chat, websocket, dev

app = FastAPI()

app.include_router(chat.router)
app.include_router(websocket.router)
app.include_router(dev.router)

@app.get("/")
async def root():
    return {"message": "Hello from FlowGen Backend Services!"}