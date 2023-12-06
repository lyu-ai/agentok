# Use the official Python 3 image.
# https://hub.docker.com/_/python
FROM python:3.11.7-alpine

# Make sure we're using the latest APKINDEX
RUN apk update

# Install build dependencies for c++ and others
RUN apk add --update --no-cache alpine-sdk python3-dev libffi-dev

# Set the working directory inside the container to /app.
WORKDIR /app

# Copy only the requirements.txt first to leverage Docker cache
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Afterwards copy the rest of your application code
COPY . /app

# Make port 8080 available to the world outside this container.
EXPOSE 5004

# Define environment variables.
ENV FLASK_APP=api/index.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5004

# Run flask application using the python3 command as described.
# CMD ["python3", "-m", "flask", "run"]
# CMD ["flask", "run"]

# Install gunicorn (you could add this to your requirements.txt)
RUN pip install gunicorn

# Define the startup command to use gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5004", "api.index:app"]