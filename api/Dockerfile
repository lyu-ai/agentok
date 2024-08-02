# Use a build stage to compile and build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install Poetry
RUN apt-get update && apt-get install -y curl && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Copy the pyproject.toml and poetry.lock to the container
COPY pyproject.toml poetry.lock ./

# Install dependencies and create a virtual environment in /app/.venv
RUN poetry config virtualenvs.in-project true && \
    poetry install --no-dev --no-interaction --no-ansi

############################
# Begin the final stage
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy the project files
COPY . .

# Ensure the virtual environment's binaries are in the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Set environment variables
ENV UVICORN_PORT=5004 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_LOG_LEVEL=debug

# Command to run the application
CMD ["/entrypoint.sh"]