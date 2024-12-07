FROM node:22.6.0-bullseye-slim

ARG DEV_USER
ARG UID
ARG GID

# Install git, sudo, and other dependencies
RUN apt-get update && \
  apt-get install -y \
  git \
  bash \
  ca-certificates \
  curl \
  postgresql-client \
  iputils-ping \
  gnupg \
  lsb-release \
  sudo && \
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

# Check UID and GID, rename user and home directory if needed
RUN if [ $(id -u node) -eq $UID ] && [ $(id -g node) -eq $GID ]; then \
  usermod -l $DEV_USER -d /home/$DEV_USER -m node && \
  groupmod -n $DEV_USER node; \
  else \
  groupadd -g $GID $DEV_USER && \
  useradd -m -u $UID -g $GID $DEV_USER; \
  fi && \
  echo "$DEV_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set up bash
COPY .devcontainer/.bashrc /home/$DEV_USER/.bashrc
RUN chown $UID:$GID /home/$DEV_USER/.bashrc

# Set the working directory
SHELL ["/bin/bash", "-c"]
WORKDIR /workspace
USER $DEV_USER
