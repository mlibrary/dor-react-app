# DOR-159: Query Parser Microservice for OpenSearch

Add OpenSearch output formatting to the existing Ruby query parser. The parser currently builds a parse tree and outputs it as Solr syntax. We need to add the ability to configure it to output OpenSearch syntax instead.

## Task 1: Research and Document Parser Architecture and OpenSearch Syntax
Understand the existing query parser and document how to add OpenSearch output formatting.

- [ ] Examine the existing Ruby query parser code and architecture
- [ ] Understand how the parse tree is currently structured
- [ ] Document how the parser currently generates Solr syntax from the parse tree
- [ ] Research OpenSearch query string syntax and DSL
- [ ] Document the mapping between parse tree nodes and OpenSearch syntax
- [ ] Create specification for OpenSearch output formatter in `tasks/DOR-159/plans/`
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 2: Write Tests for OpenSearch Output Formatter
Write comprehensive tests before implementing the OpenSearch formatter (TDD approach).

- [ ] Set up test framework (RSpec or Minitest) for Ruby service
- [ ] Write test cases for basic query output (simple terms, operators)
- [ ] Write test cases for Boolean operators (AND, OR, NOT) output
- [ ] Write test cases for field-specific query output
- [ ] Write test cases for phrase query output
- [ ] Write test cases for wildcard and fuzzy query output
- [ ] Write test cases for range query output (if applicable)
- [ ] Write test cases for edge cases and complex nested queries
- [ ] Write integration tests for the /parse endpoint with OpenSearch output
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 3: Implement OpenSearch Output Formatter
Implement the OpenSearch output formatter to make the tests pass.

- [ ] Design the output formatter architecture (interface, classes)
- [ ] Add configuration option to switch between Solr and OpenSearch output
- [ ] Implement OpenSearch formatter for basic query nodes
- [ ] Implement OpenSearch formatter for Boolean operators
- [ ] Implement OpenSearch formatter for field-specific queries
- [ ] Implement OpenSearch formatter for phrase queries
- [ ] Implement OpenSearch formatter for wildcards and fuzzy searches
- [ ] Implement OpenSearch formatter for range queries (if applicable)
- [ ] Handle edge cases and complex nested query structures
- [ ] Verify all tests pass
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 4: Add Documentation
Update documentation to reflect the new OpenSearch output capability.

- [ ] Update README.md with configuration options for output format
- [ ] Add examples showing Solr vs OpenSearch output for the same input
- [ ] Update INTEGRATION.md with OpenSearch configuration details
- [ ] Add inline code documentation for the OpenSearch formatter
- [ ] Add usage examples for common query patterns in both formats
- [ ] Document any limitations or differences between Solr and OpenSearch output
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete
