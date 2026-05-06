# DOR-159 Microservice Integration Analysis

**Date**: 2026-05-06  
**Purpose**: Analyze requirements for integrating OpenSearch Query DSL formatter into search-parser-service  
**Status**: Analysis only - implementation NOT started per developer request

---

## Current State

### search-parser-service (Stub Implementation)
**Location**: `search-parser-service/app.rb`

**Current behavior**:
- Sinatra web service on port 4567
- `/health` endpoint - returns status
- `/parse` endpoint - accepts `POST` with `{"query": "..."}`
- Currently echoes back input (stub implementation)
- Does NOT use mlibrary_search_parser gem yet

### mlibrary_search_parser (Complete)
**Location**: `mlibrary_search_parser/` (gitignored, external gem)

**Capabilities**:
- Full OpenSearch Query DSL support implemented ✅
- All 198 tests passing ✅
- Comprehensive documentation ✅
- Branch: `DOR-159/opensearch-query-dsl`

---

## Integration Requirements

### 1. Add mlibrary_search_parser Gem Dependency

**File**: `search-parser-service/Gemfile`

**Required changes**:
```ruby
# Add gem dependency
gem 'mlibrary_search_parser', github: 'mlibrary/mlibrary_search_parser', 
                               branch: 'DOR-159/opensearch-query-dsl'
# Or if published:
# gem 'mlibrary_search_parser', '~> 0.2.0'
```

**Note**: Gem is currently in a feature branch. Options:
1. Reference GitHub branch directly (for development/testing)
2. Wait for gem maintainers to merge and release
3. Use local path for testing: `gem 'mlibrary_search_parser', path: '../mlibrary_search_parser'`

---

### 2. Update Service Configuration

**File**: `search-parser-service/app.rb`

**Required additions**:
```ruby
require 'mlibrary_search_parser'
require 'yaml'
require 'erb'

# Load configuration (query fields, etc.)
# Could be from env vars, config file, or hardcoded
PARSER_CONFIG = {
  query_fields: ENV['QUERY_FIELDS']&.split(',') || ['title', 'author', 'subject'],
  output_format: :opensearch  # or make this configurable per request
}
```

---

### 3. Enhance /parse Endpoint

**File**: `search-parser-service/app.rb`

**Option A: Fixed OpenSearch Output**
```ruby
post '/parse' do
  content_type :json
  request.body.rewind
  payload = JSON.parse(request.body.read)
  
  raw_query = payload['query'] || ''
  
  # Parse to OpenSearch Query DSL
  search = MLibrarySearchParser::Search.new(raw_query, PARSER_CONFIG)
  opensearch_query = search.to_opensearch_query
  
  {
    raw_query: raw_query,
    parsed_query: opensearch_query
  }.to_json
end
```

**Option B: Format Selection (Recommended)**
```ruby
post '/parse' do
  content_type :json
  request.body.rewind
  payload = JSON.parse(request.body.read)
  
  raw_query = payload['query'] || ''
  format = payload['format'] || 'opensearch'  # 'opensearch' or 'solr'
  
  # Build config with requested format
  config = PARSER_CONFIG.merge(output_format: format.to_sym)
  
  # Parse query
  search = MLibrarySearchParser::Search.new(raw_query, config)
  
  # Get appropriate output based on format
  parsed_query = case format
                 when 'opensearch'
                   search.to_opensearch_query
                 when 'solr'
                   search.to_solr_query
                 else
                   raw_query  # fallback
                 end
  
  {
    raw_query: raw_query,
    format: format,
    parsed_query: parsed_query
  }.to_json
rescue => e
  status 500
  { error: e.message }.to_json
end
```

**Option C: Separate Endpoint**
```ruby
# Keep original for backward compatibility
post '/parse' do
  # ... existing Solr implementation
end

# New endpoint for OpenSearch
post '/parse/opensearch' do
  content_type :json
  request.body.rewind
  payload = JSON.parse(request.body.read)
  
  raw_query = payload['query'] || ''
  config = PARSER_CONFIG.merge(output_format: :opensearch)
  
  search = MLibrarySearchParser::Search.new(raw_query, config)
  opensearch_query = search.to_opensearch_query
  
  {
    raw_query: raw_query,
    query_dsl: opensearch_query
  }.to_json
rescue => e
  status 500
  { error: e.message }.to_json
end
```

---

### 4. Update Client Service (React App)

**File**: `src/apps/RsDorDcApp/services/searchParserService.js`

**Current implementation**:
```javascript
async parseSearchQuery(query) {
  const response = await fetch(`${this.baseUrl}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
}
```

**Option A: Add format parameter**
```javascript
async parseSearchQuery(query, format = 'opensearch') {
  const response = await fetch(`${this.baseUrl}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, format })
  });
  return await response.json();
}
```

**Option C: New method for OpenSearch endpoint**
```javascript
async parseSearchQueryOpenSearch(query) {
  const response = await fetch(`${this.baseUrl}/parse/opensearch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
}
```

---

### 5. Update Docker Configuration

**File**: `search-parser-service/Dockerfile`

**Current**:
```dockerfile
FROM ruby:3.1
WORKDIR /app
COPY Gemfile* ./
RUN bundle install
COPY . .
CMD ["ruby", "app.rb"]
```

**Required changes**:
- None if gem is published
- If using local gem path, need to copy mlibrary_search_parser into container
- If using GitHub branch, Dockerfile should work as-is

**File**: `compose.yaml`

**Potential additions**:
```yaml
services:
  search-parser:
    environment:
      - QUERY_FIELDS=title,author,subject,publisher
      # Optional: default format
      - DEFAULT_FORMAT=opensearch
```

---

## Testing Strategy

### 1. Unit Tests for Microservice
**File**: `search-parser-service/test_integration.rb` (to be created)

```ruby
require 'minitest/autorun'
require 'rack/test'
require_relative 'app'

class SearchParserTest < Minitest::Test
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def test_parse_endpoint_opensearch
    post '/parse', { query: 'cats AND dogs' }.to_json, 
         'CONTENT_TYPE' => 'application/json'
    
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    assert_equal 'cats AND dogs', data['raw_query']
    assert data['parsed_query'].is_a?(Hash)
    assert data['parsed_query']['query'].is_a?(Hash)
  end

  def test_parse_endpoint_with_format
    post '/parse', { query: 'test', format: 'opensearch' }.to_json,
         'CONTENT_TYPE' => 'application/json'
    
    data = JSON.parse(last_response.body)
    assert_equal 'opensearch', data['format']
  end
end
```

### 2. Integration Tests
- Test with actual OpenSearch cluster
- Verify generated queries execute successfully
- Test error handling (invalid queries, missing config)

### 3. End-to-End Tests
- Test from React app → parser service → OpenSearch
- Verify search results match expectations
- Test fallback behavior when parser unavailable

---

## Deployment Considerations

### Gem Version Management
- **Development**: Use GitHub branch reference
- **Staging**: Use published gem version from RubyGems
- **Production**: Pin to specific gem version for stability

### Backward Compatibility
- **Option A (Format parameter)**: Maintains single endpoint, adds optional parameter
- **Option B (Separate endpoint)**: Preserves existing `/parse` behavior completely
- **Recommendation**: Option A with default to 'opensearch' for new implementations

### Configuration Management
- Query fields should be configurable per environment
- Default format should be environment variable
- Consider configuration file for complex field mappings

---

## Recommended Implementation Approach

### Phase 1: Basic Integration (Minimal Changes)
1. Add gem dependency to Gemfile (local path for testing)
2. Update `/parse` endpoint to use OpenSearch format
3. Test with curl/Postman
4. Verify Docker build works

### Phase 2: Format Selection (Full Flexibility)
1. Add format parameter to `/parse` endpoint
2. Update React client to pass format
3. Add integration tests
4. Update documentation

### Phase 3: Production Readiness
1. Wait for gem to be merged/published
2. Update Gemfile to use published version
3. Add comprehensive error handling
4. Add logging and monitoring
5. Deploy to staging for testing

---

## Files That Would Need Changes

### Required Changes (for basic integration):
1. ✏️ `search-parser-service/Gemfile` - Add gem dependency
2. ✏️ `search-parser-service/app.rb` - Update `/parse` endpoint
3. ✏️ `search-parser-service/test.sh` - Add integration tests (optional but recommended)

### Optional Changes (for enhanced functionality):
4. ✏️ `src/apps/RsDorDcApp/services/searchParserService.js` - Add format parameter
5. ✏️ `compose.yaml` - Add environment variables
6. ✏️ `search-parser-service/README.md` - Document OpenSearch support

### No Changes Needed:
- ✅ `search-parser-service/Dockerfile` - Works as-is
- ✅ Parser gem - Complete and ready to use
- ✅ Tests - All passing in parser gem

---

## Risk Assessment

### Low Risk:
- Parser gem is well-tested (198 tests, 95.9% coverage)
- Comprehensive documentation available
- Backward compatible approach possible

### Medium Risk:
- Gem is currently in feature branch (not yet released)
- Integration testing needed with actual React app
- Docker build needs verification

### Mitigation:
- Test thoroughly in development environment first
- Use local gem path for initial testing
- Implement feature flag to enable/disable new behavior
- Maintain fallback to raw query on errors

---

## Decision Points for Developer

### 1. Gem Source
- [ ] Use GitHub branch reference (for immediate testing)
- [ ] Use local path (for development)
- [ ] Wait for gem release (for production stability)

### 2. API Design
- [ ] **Option A**: Add format parameter to existing `/parse` endpoint
- [ ] **Option B**: Keep `/parse` as-is, add `/parse/opensearch` endpoint
- [ ] **Option C**: Replace `/parse` completely with OpenSearch output

### 3. Scope
- [ ] Implement basic integration now (parser gem only)
- [ ] Full integration with React app
- [ ] Add monitoring and logging
- [ ] Wait for requirements clarification

---

**Analysis Completed By**: AI Agent  
**Analysis Date**: 2026-05-06  
**Status**: Ready for developer decision on implementation approach  
**Recommendation**: Start with Option A (format parameter) with local gem path for testing

