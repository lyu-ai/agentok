# Use a build stage to compile and build dependencies
FROM hughlv/agentok-api-base:v1.0

# Copy the code into the container
COPY . .

# Command to run the application
CMD ["sh", "-c", "uvicorn app.main:app --host ${UVICORN_HOST} --port ${UVICORN_PORT} --workers ${UVICORN_WORKERS} --log-level ${UVICORN_LOG_LEVEL}"]