FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

# Install additional tools if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    git \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set npm to use the latest version
RUN npm install -g npm@latest

# Configure git for the container
RUN git config --global --add safe.directory /workspaces/*
