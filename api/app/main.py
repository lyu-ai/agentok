from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import chat_router, dev_router, extension_router, message_router, doc_router, admin_router

app = FastAPI(title="FlowGen API",
              description="Specifications of FlowGen OpenAPI.",
              version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(chat_router.router, prefix="/chats", tags=["Chat"], trailing_slash=False)
app.include_router(message_router.router, prefix="/messages", tags=["Message"])
app.include_router(dev_router.router, prefix="/dev", tags=["Dev"])
app.include_router(extension_router.router, prefix="/extensions", tags=["Extension"])
app.include_router(doc_router.router, include_in_schema=False)
app.include_router(admin_router.router, prefix="/admin", include_in_schema=False)

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    html_content = """
    <html>
        <head>
            <title>Welcome to FlowGen API Services</title>
            <meta charset="utf-8" />
            <link rel="icon" href="https://platform.flowgen.app/favicon.ico" />
        </head>
        <body>
            <img src="https://platform.flowgen.app/logo-full.png" alt="FlowGen Logo" style="width: 240px" />
            <h1>Welcome to FlowGen APIs!</h1>
            <p>Check out our <a href="/api-docs">API Documentations</a>, <a target="_blank" href="https://github.com/tiwater/flowgen">GitHub Repo</a>, or <a target="_blank" href="https://platform.flowgen.app">Try FlowGen</a>.</p>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# Mount the static directory to serve favicon file
app.mount("/static", StaticFiles(directory="static"), name="static")
