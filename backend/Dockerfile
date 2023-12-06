# Use the official Python 3 image.
# https://hub.docker.com/_/python
FROM python:3.9-slim

# Set the working directory inside the container to /app.
WORKDIR /app

# Copy the current directory contents into the container at /app.
COPY . /app

# Install any needed packages specified in requirements.txt.
RUN pip3 install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container.
EXPOSE 5004

# Define environment variables.
ENV FLASK_APP=api/index.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5004

# Run flask application using the python3 command as described.
CMD ["python3", "-m", "flask", "run"]
