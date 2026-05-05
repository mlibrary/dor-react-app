# DOR-159 Status

## Last Updated
2026-05-05 - Completed integration analysis with 4 options (pros/cons)

## Current Branch
`DOR-159/query-parser-microservice`

## Open Tasks
All tasks pending - following TDD approach: Research → Tests → Implementation → Documentation

### Task 1: Research and Document Parser Architecture and OpenSearch Syntax
**Status**: Pending - Need to understand existing parser and OpenSearch output requirements

### Task 2: Write Tests for OpenSearch Output Formatter (TDD)
**Status**: Pending - Awaiting Task 1 completion

### Task 3: Implement OpenSearch Output Formatter
**Status**: Pending - Awaiting Task 2 completion (implement to make tests pass)

### Task 4: Add Documentation
**Status**: Pending - Awaiting Task 3 completion

## Open Plans
| File                          | Purpose                                              | Status   |
|-------------------------------|------------------------------------------------------|----------|
| plans/integration-analysis.md | Parser architecture analysis and integration options | Complete |

## Recent Activity
- Created task directory structure for DOR-159
- Created initial TODO.md with three-phase approach
- Added TDD section to AGENTS.md
- Reordered tasks to follow TDD: Research → Tests → Implementation → Documentation
- **Clarified requirements**: Not converting Solr to OpenSearch, but adding OpenSearch output formatter to existing parser
- Updated TODO.md and STATUS.md to reflect correct understanding
- Added mlibrary_search_parser to .gitignore
- **Examined mlibrary_search_parser architecture**:
  - Uses Parslet parser to build AST
  - Has Node-based tree structure (SearchNode, TokensNode, AndNode, OrNode, etc.)
  - Current Solr transformer at `transform/solr/json_edismax.rb`
  - Need to add parallel `transform/opensearch/` module
- **Created integration analysis document** with 4 options:
  1. Add OpenSearch transformer to gem (RECOMMENDED)
  2. Vendorize gem with modifications
  3. Wrapper service pattern (translate Solr → OpenSearch)
  4. Fork as internal gem
- Ready for developer decision on integration approach

## Key Context
- The search-parser microservice already exists as a stub at `search-parser-service/`
- There's an existing Ruby query parser that builds a parse tree from user queries
- The parser currently outputs the parse tree as Solr syntax
- **Task**: Add an OpenSearch output formatter (NOT converting Solr to OpenSearch)
- The parse tree is the same; we're adding a new way to serialize it
- Need to make output format configurable (Solr vs OpenSearch)
- Service is integrated with RsDorDcApp via `searchParserService.js`
- Service runs on port 4567 in Docker (http://search-parser:4567)
- Must maintain backward compatibility with existing integration
- **Following TDD**: Write tests first, then implement to make tests pass, then document

## Next Steps
1. Examine the existing Ruby query parser code and architecture
2. Understand the current parse tree structure
3. Document how Solr syntax is currently generated from the parse tree
4. Research OpenSearch query syntax
5. Document the mapping between parse tree nodes and OpenSearch syntax
6. Write comprehensive test suite for OpenSearch formatter (Task 2 - TDD)
7. Implement OpenSearch output formatter to make tests pass (Task 3)
8. Add configuration to switch between Solr and OpenSearch output
9. Update documentation (Task 4)

