# Build stage
FROM python:3.12-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements files
COPY pyproject.toml poetry.lock ./

# Install poetry and generate requirements.txt
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi && \
    poetry run pip freeze > requirements.txt

# Runtime stage
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    OPENBLAS_NUM_THREADS=4 \
    MKL_NUM_THREADS=4 \
    OMP_NUM_THREADS=4 \
    NUMEXPR_NUM_THREADS=4

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY ./agentok_api ./agentok_api
COPY ./scripts/entrypoint.sh ./entrypoint.sh

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh

EXPOSE 5004

ENTRYPOINT ["./entrypoint.sh"]