# DOR-159: Query Parser Microservice for OpenSearch

Add OpenSearch output formatting to the existing Ruby query parser. The parser currently builds a parse tree and outputs it as Solr syntax. We need to add the ability to configure it to output OpenSearch syntax instead.

## Task 1: Research and Document Parser Architecture and OpenSearch Syntax
Understand the existing query parser and document how to add OpenSearch output formatting.

- [x] Examine the existing Ruby query parser code and architecture
- [x] Understand how the parse tree is currently structured
- [x] Document how the parser currently generates Solr syntax from the parse tree
- [x] Research OpenSearch query string syntax and DSL
- [x] Document the mapping between parse tree nodes and OpenSearch syntax
- [x] Create specification for OpenSearch output formatter in `tasks/DOR-159/plans/`
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 2: Write Tests for OpenSearch Output Formatter
Write comprehensive tests before implementing the OpenSearch formatter (TDD approach).

- [x] Set up test framework (RSpec or Minitest) for Ruby service
- [x] Write test cases for basic query output (simple terms, operators)
- [x] Write test cases for Boolean operators (AND, OR, NOT) output
- [x] Write test cases for field-specific query output
- [x] Write test cases for phrase query output
- [x] Write test cases for wildcard and fuzzy query output
- [x] Write test cases for range query output (if applicable)
- [x] Write test cases for edge cases and complex nested queries
- [x] Write integration tests for the /parse endpoint with OpenSearch output
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 3: Implement OpenSearch Output Formatter
Implement the OpenSearch output formatter to make the tests pass.

- [x] Design the output formatter architecture (interface, classes)
- [x] Add configuration option to switch between Solr and OpenSearch output
- [x] Implement OpenSearch formatter for basic query nodes
- [x] Implement OpenSearch formatter for Boolean operators
- [x] Implement OpenSearch formatter for field-specific queries
- [x] Implement OpenSearch formatter for phrase queries
- [x] Implement OpenSearch formatter for wildcards and fuzzy searches
- [x] Implement OpenSearch formatter for range queries (if applicable)
- [x] Handle edge cases and complex nested query structures
- [x] Verify all tests pass
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 4: Add Documentation
Update documentation to reflect the new OpenSearch output capability.

- [x] Update README.md with configuration options for output format
- [x] Add examples showing Solr vs OpenSearch output for the same input
- [x] Update INTEGRATION.md with OpenSearch configuration details
- [x] Add inline code documentation for the OpenSearch formatter
- [x] Add usage examples for common query patterns in both formats
- [x] Document any limitations or differences between Solr and OpenSearch output
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete
