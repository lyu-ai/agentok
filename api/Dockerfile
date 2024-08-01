FROM hughlv/agentok-api-base:v1.0

WORKDIR /app

COPY . .

ENV UVICORN_HOST=0.0.0.0 \
  UVICORN_PORT=5004 \
  UVICORN_WORKERS=3 \
  UVICORN_LOG_LEVEL=debug

HEALTHCHECK CMD curl --fail http://localhost:${UVICORN_PORT}/docs || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5004", "--workers", "3", "--log-level", "debug"]