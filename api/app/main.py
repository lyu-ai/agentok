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

app.include_router(chat_router.router, prefix="/chats", tags=["Chat"])
app.include_router(message_router.router, prefix="/messages", tags=["Message"])
app.include_router(dev_router.router, prefix="/dev", tags=["Dev"])
app.include_router(extension_router.router, prefix="/extensions", tags=["Extension"])
app.include_router(doc_router.router, include_in_schema=False)
app.include_router(admin_router.router, prefix="/admin", include_in_schema=False)

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FlowGen API Services</title>
    <link rel="icon" href="https://platform.flowgen.app/favicon.ico" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            background-color: #303030; /* very dark gray */
            color: #ffffff; /* white text for better contrast */
        }
        h1 {
            color: #66B2FF; /* ensuring good contrast on a dark bg */
        }
        a {
            color: #1E90FF; /* bright blue for better visibility */
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: #0D6EFD; /* a shade darker when hovered for interactivity feedback */
            text-decoration: underline;
        }
        p {
            text-align: center;
            margin: 20px 0;
        }
        img {
            margin-bottom: 32px; /* spacing below the logo */
        }
        .container {
            text-align: center;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://platform.flowgen.app/logo-full.png" alt="FlowGen Logo" style="width: 240px" />
        <h1>Welcome to FlowGen APIs!</h1>
        <p>Check out our <a href="/api-docs">API Documentations</a>, 
        <a target="_blank" href="https://github.com/tiwater/flowgen">GitHub Repo</a>, 
        or <a target="_blank" href="https://platform.flowgen.app">Try FlowGen</a>.</p>
    </div>
</body>
</html>
    """
    return HTMLResponse(content=html_content)

# Mount the static directory to serve favicon file
app.mount("/static", StaticFiles(directory="static"), name="static")
