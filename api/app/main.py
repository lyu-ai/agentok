from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routers import chat_router, codegen_router, dataset_router, extension_router, doc_router, admin_router

main_app = FastAPI(title="Agentok APIs",
              description="OpenAPI Specifications of Agentok APIs. To test out the APIs, you need to prepare an [API Key](https://studio.agentok.ai/settings/api-keys) and put it in field 'X-API-KEY' of HTTP headers.",
              version="1.0.0",
              swagger_ui_parameters={"persistAuthorization": True},
              )

main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

main_app.include_router(chat_router.router, prefix="/chats", tags=["Chat"])
main_app.include_router(dataset_router.router, prefix="/datasets", tags=["Datasets"])
main_app.include_router(codegen_router.router, prefix="/codegen", tags=["Codegen"])
main_app.include_router(extension_router.router, prefix="/extensions", tags=["Extension"])
main_app.include_router(admin_router.router, prefix="/admin", include_in_schema=False)

app = FastAPI()
app.mount("/v1", main_app)
app.include_router(doc_router.router, include_in_schema=False)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    return JSONResponse(
        status_code=400,
        content={"status_code": 400, "error": {"message": "Internal Server Error", "detail": str(exc)}}
    )

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentok APIs</title>
    <link rel="icon" href="https://studio.agentok.ai/favicon.ico" />
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
            color: #9FE88D; /* ensuring good contrast on a dark bg */
        }
        a {
            color: #9FE88D; /* bright blue for better visibility */
            opacity: 0.8; /* slightly transparent for a modern look */
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: #9FE88D; /* a shade darker when hovered for interactivity feedback */
            opacity: 1; /* fully opaque when hovered */
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
        <img src="https://agentok.ai/img/logo.svg" alt="Agentok Studio Logo" style="width: 120px" />
        <h1>Welcome to Agentok APIs!</h1>
        <p>Check out the <a href="/api-docs">API Docs</a>, or try out the APIs in <a href="/v1/docs">Swagger UI</a> (need to create an <a target="_blank" href="https://studio.agentok.ai/settings/api-keys">API Key</a> in <a target="_blank" href="https://studio.agentok.ai">Agentok Studio</a> beforehand).</p>
        <p>If you like this project, please consider to support us by giving a <a target="_blank" href="https://github.com/hughlv/agentok">Star on GitHub</a>.</p>
    </div>
</body>
</html>
    """
    return HTMLResponse(content=html_content)

# Mount the static directory to serve favicon file
app.mount("/static", StaticFiles(directory="static"), name="static")

