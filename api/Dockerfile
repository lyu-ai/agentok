FROM hughlv/agentok-api-base:v1.2

WORKDIR /app

COPY . .

ENV UVICORN_HOST=0.0.0.0 \
  UVICORN_PORT=5004 \
  UVICORN_WORKERS=3 \
  UVICORN_LOG_LEVEL=debug

# Adjust the HEALTHCHECK to correctly use the environment variable
# HEALTHCHECK CMD curl --fail http://localhost:5004/docs || exit 1

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5004", "--workers", "3", "--log-level", "debug"]