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

## Task 2: Implement Solr to OpenSearch Query Converter
Implement the query conversion logic in the Ruby microservice.

- [ ] Design the query parser/converter architecture
- [ ] Implement basic query syntax conversion (operators, wildcards, etc.)
- [ ] Implement field-specific query handling (if applicable)
- [ ] Implement phrase query conversion
- [ ] Implement Boolean operator conversion (AND, OR, NOT)
- [ ] Implement range query conversion (if needed)
- [ ] Implement wildcard and fuzzy query conversion
- [ ] Handle edge cases and malformed queries gracefully
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

## Task 3: Add Tests and Documentation
Add comprehensive tests and update documentation for the query parser.

- [ ] Write unit tests for query conversion logic
- [ ] Write integration tests for the /parse endpoint
- [ ] Add test cases for edge cases and error handling
- [ ] Update README.md with conversion examples
- [ ] Update INTEGRATION.md with conversion behavior details
- [ ] Add inline code documentation
- [ ] Test with real queries from the application
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

