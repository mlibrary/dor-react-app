# DOR-159: Query Parser Microservice for OpenSearch

Enhance the search-parser microservice to convert Solr query syntax to OpenSearch-compatible query syntax.

## Task 1: Research and Document Solr to OpenSearch Query Syntax Differences
Research the key differences between Solr and OpenSearch query syntax to identify what needs to be converted.

- [ ] Research Solr query parser syntax (Standard, DisMax, eDisMax)
- [ ] Research OpenSearch query string syntax and query DSL
- [ ] Document key syntax differences that need conversion
- [ ] Identify common query patterns used in the application
- [ ] Create conversion specification document in `tasks/DOR-159/plans/`
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 2: Write Tests for Query Converter
Write comprehensive tests before implementing the conversion logic (TDD approach).

- [ ] Set up test framework (RSpec or Minitest) for Ruby service
- [ ] Write test cases for basic query syntax conversion
- [ ] Write test cases for Boolean operators (AND, OR, NOT)
- [ ] Write test cases for field-specific queries
- [ ] Write test cases for phrase queries
- [ ] Write test cases for wildcards and fuzzy searches
- [ ] Write test cases for range queries (if needed)
- [ ] Write test cases for edge cases and malformed queries
- [ ] Write integration tests for the /parse endpoint
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 3: Implement Solr to OpenSearch Query Converter
Implement the query conversion logic to make the tests pass.

- [ ] Design the query parser/converter architecture
- [ ] Implement basic query syntax conversion (operators, wildcards, etc.)
- [ ] Implement field-specific query handling (if applicable)
- [ ] Implement phrase query conversion
- [ ] Implement Boolean operator conversion (AND, OR, NOT)
- [ ] Implement range query conversion (if needed)
- [ ] Implement wildcard and fuzzy query conversion
- [ ] Handle edge cases and malformed queries gracefully
- [ ] Verify all tests pass
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 4: Add Documentation
Update documentation to reflect the implementation.

- [ ] Update README.md with conversion examples
- [ ] Update INTEGRATION.md with conversion behavior details
- [ ] Add inline code documentation and comments
- [ ] Add usage examples for common query patterns
- [ ] Document any limitations or known issues
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete
