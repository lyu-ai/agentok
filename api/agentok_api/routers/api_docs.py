from fastapi import APIRouter
from starlette.responses import HTMLResponse

router = APIRouter()

@router.get("/api-docs")
async def custom_redoc():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
      <head>
        <title>Agentok APIs</title>
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico"/>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url="/v1/openapi.json"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
      </body>
    </html>
    """)
