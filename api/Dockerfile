# Use the amd64 version of the base image
FROM --platform=linux/amd64 hughlv/agentok-api-base:v1.0

# Set the working directory
WORKDIR /app

# Copy the code into the container
COPY . .

# Set environment variables (if not already set in the base image)
ENV UVICORN_HOST=0.0.0.0 \
  UVICORN_PORT=5004 \
  UVICORN_WORKERS=3 \
  UVICORN_LOG_LEVEL=debug

# Add a health check using the /docs endpoint
HEALTHCHECK CMD curl --fail http://localhost:${UVICORN_PORT}/docs || exit 1

# Command to run the application
CMD ["sh", "-c", "uvicorn app.main:app --host ${UVICORN_HOST} --port ${UVICORN_PORT} --workers ${UVICORN_WORKERS} --log-level ${UVICORN_LOG_LEVEL}"]