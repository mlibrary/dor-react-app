FROM node:24

# Install additional tools if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    vim \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

CMD ["npm", "run", "preview"]

EXPOSE 4173
