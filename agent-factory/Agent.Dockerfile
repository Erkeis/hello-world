# [Intent] Base image for farm agents with git pre-installed (2026-04-17)
FROM node:20-slim

# Install git and other essential tools
RUN apt-get update && \
    apt-get install -y git jq inotify-tools && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
