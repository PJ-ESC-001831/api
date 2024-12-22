FROM node:22.6.0-bullseye-slim

# Define build arguments for UID, GID, and USERNAME
ARG UID=1000
ARG GID=1000
ARG USERNAME=developer

# Install git and other dependencies
RUN apt-get update && \
  apt-get install -y \
  git \
  bash \
  sudo \
  ca-certificates \
  curl \
  postgresql-client \
  iputils-ping \
  gnupg \
  lsb-release \
  sudo && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Logic to check if a user with the specified UID and GID exists, and create/rename accordingly
RUN if getent passwd $UID > /dev/null && getent group $GID > /dev/null; then \
  # If user and group exist, rename the user
  usermod -l $USERNAME -d /home/$USERNAME -m $(getent passwd $UID | cut -d: -f1) && \
  groupmod -n $USERNAME $(getent group $GID | cut -d: -f1); \
  else \
  # If user and group don't exist, create a new user
  groupadd -g $GID $USERNAME && useradd -m -u $UID -g $GID $USERNAME; \
  fi && \
  mkdir -p /workspace && chown -R $UID:$GID /workspace && \
  echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
  usermod -aG sudo $USERNAME

# Install Docker
RUN mkdir -p /etc/apt/keyrings && \
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  apt-get update && \
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*


# Set the working directory
SHELL ["/bin/bash", "-c"]
WORKDIR /workspace
USER $USERNAME
