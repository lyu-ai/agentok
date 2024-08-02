# Base stage: Install dependencies
FROM python:3.12-slim-bookworm AS base

# Set the working directory in the container
WORKDIR /app

# Install dependencies required for building and running
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the pyproject.toml and poetry.lock to the container
COPY pyproject.toml poetry.lock ./

# Install dependencies and create a virtual environment in /app/.venv
RUN poetry config virtualenvs.in-project true && \
    poetry install --no-dev --no-interaction --no-ansi

# Ensure pip and other scripts are correctly pointing to the right Python interpreter
RUN /app/.venv/bin/python -m ensurepip --upgrade && \
    /app/.venv/bin/python -m pip install --upgrade pip && \
    /app/.venv/bin/pip install uvicorn

# Diagnostic: Check the installed versions of Python and pip
RUN python --version && pip --version
RUN /app/.venv/bin/python --version && /app/.venv/bin/pip --version

# Application stage: Copy application code and use base image
FROM python:3.12-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy the base image's virtual environment and installed packages
COPY --from=base /app /app

# Ensure the virtual environment's binaries are in the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Copy the project files
COPY . .

# Set environment variables
ENV UVICORN_PORT=5004 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_LOG_LEVEL=debug

# Give execution permissions to the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Command to run the application
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]