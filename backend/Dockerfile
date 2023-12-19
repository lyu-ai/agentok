# Use the official Python 3 image.
# https://hub.docker.com/_/python
FROM python:3.11-alpine

# Set the working directory inside the container to /app.
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    g++ \
    linux-headers \
    libffi-dev \
    libc-dev
RUN pip install uvicorn

# Copy only the requirements.txt first to leverage Docker cache
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Afterwards copy the rest of your application code
COPY . /app

# Make port 5004 available to the world outside this container.
EXPOSE 5004

# Define the startup command to use gunicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5004"]