FROM node:24

WORKDIR /app

COPY . /app

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1
