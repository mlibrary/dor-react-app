# DOR-159 Status

## Last Updated
2026-05-05 - Reorganized tasks to follow TDD: Research → Tests → Implementation → Documentation

## Current Branch
`DOR-159/query-parser-microservice`

## Open Tasks
All tasks pending - following TDD approach: Research → Tests → Implementation → Documentation

### Task 1: Research and Document Solr to OpenSearch Query Syntax Differences
**Status**: Pending - Need to research syntax differences

### Task 2: Write Tests for Query Converter (TDD)
**Status**: Pending - Awaiting Task 1 completion

### Task 3: Implement Solr to OpenSearch Query Converter
**Status**: Pending - Awaiting Task 2 completion (implement to make tests pass)

### Task 4: Add Documentation
**Status**: Pending - Awaiting Task 3 completion

## Open Plans
| File                        | Purpose                                     | Status  |
|-----------------------------|---------------------------------------------|---------|
| *(to be created in Task 1)* | Solr to OpenSearch conversion specification | Pending |

## Recent Activity
- Created task directory structure for DOR-159
- Created initial TODO.md with three-phase approach
- Added TDD section to AGENTS.md
- Reordered tasks to follow TDD: Research → Tests → Implementation → Documentation
- Updated STATUS.md for task tracking
- Ready to begin research phase

## Key Context
- The search-parser microservice already exists as a stub at `search-parser-service/`
- Current implementation in `app.rb` just echoes back the input query
- Service is integrated with RsDorDcApp via `searchParserService.js`
- Service runs on port 4567 in Docker (http://search-parser:4567)
- Need to implement actual Solr → OpenSearch query conversion logic
- Must maintain backward compatibility with existing integration
- **Following TDD**: Write tests first, then implement to make tests pass, then document

## Next Steps
1. Research Solr query parser syntax (Standard, DisMax, eDisMax)
2. Research OpenSearch query string syntax and Lucene query syntax
3. Document key syntax differences in a conversion specification
4. Create examples of queries that need conversion
5. Write comprehensive test suite (Task 2 - TDD)
6. Implement converter logic to make tests pass (Task 3)
7. Update documentation (Task 4)

