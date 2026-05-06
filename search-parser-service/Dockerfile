FROM ruby:3.3-slim

# Accept build arguments for parser gem configuration
ARG MLIBRARY_SEARCH_PARSER_GIT=https://github.com/mlibrary/mlibrary_search_parser.git
ARG MLIBRARY_SEARCH_PARSER_REF=DOR-159/opensearch-query-dsl

WORKDIR /app

# Install dependencies
# Pass build args as environment variables for bundle install
COPY Gemfile Gemfile.lock* ./
RUN MLIBRARY_SEARCH_PARSER_GIT=${MLIBRARY_SEARCH_PARSER_GIT} \
    MLIBRARY_SEARCH_PARSER_REF=${MLIBRARY_SEARCH_PARSER_REF} \
    bundle install

# Copy application code
COPY . .

# Expose port
EXPOSE 4567

# Run the application
CMD ["ruby", "app.rb"]

