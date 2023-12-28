# Backend Service for FlowGen

Run the service:

```bash
uvicorn app.main:app --reload --port 5004
```

For convenience (assumed you have created a virtual environment named `venv`):

```bash
./start.sh
```

## Deps

For retrieve related agents, should install pyautogen[retrievechat]:

```bash
pip install "pyautogen[retrievechat]"
```

## API Docs

By default, when you create a FastAPI application, it automatically generates OpenAPI schemas for all your routes and serves them under /docs and /redoc paths.

You can visit `/redoc` or `/docs`, such as [http://localhost:5004/redoc](http://localhost:5004/redoc) or [http://localhost:5004/docs](http://localhost:5004/docs) to see the API docs.
