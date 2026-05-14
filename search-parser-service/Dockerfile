FROM ruby:3.3-slim

# Accept build arguments for parser gem configuration
ARG MLIBRARY_SEARCH_PARSER_GIT=https://github.com/mlibrary/mlibrary_search_parser.git
ARG MLIBRARY_SEARCH_PARSER_REF=DOR-159/opensearch-query-dsl

# Non-root user configuration (mirrors the main dor-react-app Dockerfile)
ARG UNAME=app
ARG UID=1000
ARG GID=1000

WORKDIR /app

# Install system dependencies required for git-sourced gems
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      git \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user and group
RUN groupadd -g $GID -o $UNAME && \
    useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

# Install Ruby dependencies as root so gems land in the system bundle path
# (/usr/local/bundle) which is readable by all users.
# Exclude development/test gems to minimize production image size.
COPY Gemfile Gemfile.lock* ./
RUN MLIBRARY_SEARCH_PARSER_GIT=${MLIBRARY_SEARCH_PARSER_GIT} \
    MLIBRARY_SEARCH_PARSER_REF=${MLIBRARY_SEARCH_PARSER_REF} \
    bundle install --without development test

# Copy application code, then hand ownership to the non-root user
COPY . .
RUN chown -R $UID:$GID /app

# Drop privileges before running the application
USER $UNAME

# Expose port
EXPOSE 4567

# Run the application
CMD ["bundle", "exec", "ruby", "app.rb"]
