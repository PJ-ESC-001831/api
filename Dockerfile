FROM node:22.6.0-bullseye-slim

# Install git and other dependencies
RUN apt-get update && \
  apt-get install -y git && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace