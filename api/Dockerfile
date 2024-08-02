# Base stage: Install dependencies
FROM python:3.11-slim AS base

# Set the working directory in the container
WORKDIR /app

# Install dependencies required for building and running
RUN apt-get update && apt-get install -y curl build-essential && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Copy the pyproject.toml and poetry.lock to the container
COPY pyproject.toml poetry.lock ./

# Install dependencies and create a virtual environment in /app/.venv
RUN poetry config virtualenvs.in-project true && \
    poetry install --no-dev --no-interaction --no-ansi

# Application stage: Copy application code and use base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the base image's virtual environment
COPY --from=base /app /app

# Copy the project files
COPY . .

# Ensure the virtual environment's binaries are in the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Set environment variables
ENV UVICORN_PORT=5004 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_LOG_LEVEL=debug

# Give execution permissions to the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Command to run the application
ENTRYPOINT ["/app/entrypoint.sh"]