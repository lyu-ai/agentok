# This is the build stage where we download and unzip PocketBase.
FROM alpine:latest as downloader

ARG TARGETOS
ARG TARGETARCH
ARG VERSION=0.20.0

ENV BUILDX_ARCH="${TARGETOS:-linux}_${TARGETARCH:-amd64}"

# Install the dependencies required to download and unzip.
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    zip \
    zlib-dev

# Download and extract the specific version of PocketBase.
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_${BUILDX_ARCH}.zip \
    && unzip pocketbase_${VERSION}_${BUILDX_ARCH}.zip \
    && chmod +x pocketbase

# This is the final stage where we configure the container to run PocketBase.
FROM alpine:latest

# Install ca-certificates if your application needs it.
RUN apk add --no-cache ca-certificates

# Copy the PocketBase binary from the build stage.
COPY --from=downloader /pocketbase /usr/local/bin/pocketbase

# Expose the port that PocketBase will run on.
EXPOSE 7676

# Make sure the data and backup directories are setup
RUN mkdir /data /backups

COPY ./backups/pb_backup.zip /backups/pb_backup.zip

# Add the entrypoint script.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Use the entrypoint script to execute migrations and start PocketBase.
ENTRYPOINT ["/entrypoint.sh"]