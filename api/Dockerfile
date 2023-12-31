# Use the official Python 3 image.
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Set the working directory inside the container to /app.
WORKDIR /app

# Install system dependencies required for Python packages like `onnxruntime`
RUN apt-get update && apt-get install -y \
    gcc \
    libc6-dev \
    libffi-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements.txt first to leverage Docker cache
COPY requirements.txt /app/
RUN pip3 install --no-cache-dir -r requirements.txt

# Afterwards copy the rest of your application code
COPY . /app

# Define environment variable defaults for Uvicorn (Optional)
ENV UVICORN_WORKERS=3 \
    UVICORN_PORT=5004 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_LOG_LEVEL=info

ENV IMAGEIO_FFMPEG_EXE=/usr/bin/ffmpeg

# Define the command to run your application on Uvicorn with multiple workers
CMD ["sh", "-c", "uvicorn app.main:app --host ${UVICORN_HOST} --port ${UVICORN_PORT} --workers ${UVICORN_WORKERS} --log-level ${UVICORN_LOG_LEVEL}"]