FROM node:22.6.0-bullseye-slim

# Install git and other dependencies
RUN apt-get update && \
  apt-get install -y \
  git \
  bash \
  ca-certificates \
  curl \
  postgresql-client \
  iputils-ping \
  gnupg \
  lsb-release && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install Docker
RUN mkdir -p /etc/apt/keyrings && \
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  apt-get update && \
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install the latest version of NPM
RUN npm install -g npm@latest

# Set up bash
COPY .devcontainer/.bashrc /root/.bashrc

# Set the working directory
SHELL ["/bin/bash", "-c"]
WORKDIR /workspace
