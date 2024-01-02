from fastapi import FastAPI
from .routers import chat, websocket, dev, agent

app = FastAPI(description="FlowGen Backend Services", version="1.0.0")

app.include_router(chat.router)
app.include_router(websocket.router)
app.include_router(dev.router)
app.include_router(agent.router)

@app.get("/", tags=["Chat"])
async def root():
    return {"message": "Hello from FlowGen Backend Services!"}