FROM ruby:3.3-slim

WORKDIR /app

# Install dependencies
COPY Gemfile Gemfile.lock* ./
RUN bundle install

# Copy application code
COPY . .

# Expose port
EXPOSE 4567

# Run the application
CMD ["ruby", "app.rb"]

