# Base stage: Install dependencies
FROM python:3.12-slim-bookworm AS base

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

# Diagnostic: Check the virtual environment contents
RUN ls -la /app
RUN ls -la /app/.venv
RUN ls -la /app/.venv/bin

# Ensure the virtual environment python binary works
RUN /app/.venv/bin/python --version

# Install uvicorn using pip
RUN /app/.venv/bin/pip install uvicorn

# Application stage: Copy application code and use base image
FROM python:3.12-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy the base image's virtual environment and installed packages
COPY --from=base /app /app

# Diagnostic: Verify the copied files
RUN ls -la /app
RUN ls -la /app/.venv
RUN ls -la /app/.venv/bin

# Ensure the virtual environment's binaries are in the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Diagnostic: Check the contents of the virtual environment directory
RUN ls -la /app/.venv
RUN ls -la /app/.venv/bin

# Diagnostic: Verify uvicorn installation
RUN python -m pip show uvicorn || echo "uvicorn not found"
RUN python -m pip list

# Ensure `uvicorn` is executable
RUN chmod +x /app/.venv/bin/uvicorn

# Copy the project files
COPY . .

# Set environment variables
ENV UVICORN_PORT=5004 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_LOG_LEVEL=debug

# Give execution permissions to the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Set the working directory for the entrypoint script
WORKDIR /app

# Command to run the application
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]