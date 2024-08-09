FROM node:22.6.0-bullseye-slim

# Install git and other dependencies
RUN apt-get update && \
  apt-get install -y git bash && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install the latest version of NPM
RUN npm install -g npm@latest

# Set up bash
COPY .devcontainer/.bashrc /root/.bashrc

# Set the working directory
SHELL ["/bin/bash", "-c"]
WORKDIR /workspace