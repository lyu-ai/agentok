#!/bin/sh

# Activate the virtual environment
source .venv/bin/activate

# Calculate the number of workers based on the number of CPU cores
UVICORN_WORKERS=${UVICORN_WORKERS:-$(python -c 'import multiprocessing; print(multiprocessing.cpu_count())')}

# Start the Uvicorn server
exec uvicorn agentok_api.main:app --host ${UVICORN_HOST:-0.0.0.0} --port ${UVICORN_PORT:-5004} --workers ${UVICORN_WORKERS} --log-level ${UVICORN_LOG_LEVEL:-debug}