# DOR-159 Status

## Last Updated
2026-05-05 - Task 1 complete: Selected Option 1, ready to begin Task 2 (write tests)

## Current Branch
`DOR-159/query-parser-microservice`

## Open Tasks
Following TDD approach: Research → Tests → Implementation → Documentation

### Task 1: Research and Document Parser Architecture and OpenSearch Syntax ✅
**Status**: Complete - Selected Option 1 (add OpenSearch transformer to gem)

### Task 2: Write Tests for OpenSearch Output Formatter (TDD)
**Status**: Ready to begin - Decision made, configuration approach defined

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
- Clarified requirements: Adding OpenSearch output formatter to existing parser
- Updated TODO.md and STATUS.md to reflect correct understanding
- Added mlibrary_search_parser to .gitignore
- Examined mlibrary_search_parser architecture (Parslet → AST → Transformer)
- Created integration analysis document with 4 options
- **Developer decision: Option 1 (add transformer to gem)**
- **Configuration approach: Simple one-at-a-time format selection**
- **✅ Task 1 complete: All subtasks checked off**
- Ready to begin Task 2 (write tests for OpenSearch transformer)

## Key Context
- The search-parser microservice already exists as a stub at `search-parser-service/`
- mlibrary_search_parser gem is controlled and maintained by the team
- Parser architecture: Parslet → AST (Node objects) → Transformer → Output
- Current transformer: `transform/solr/json_edismax.rb`
- **Decision: Add OpenSearch transformer at `transform/opensearch/query_dsl.rb`**
- **Configuration approach:** Simple one-at-a-time format selection (`output_format: :opensearch` or `:solr`)
- **Node mapping:**
  - TokensNode → OpenSearch match/query_string
  - AndNode → bool with must
  - OrNode → bool with should
  - NotNode → bool with must_not
  - FieldedNode → field-specific queries
  - SearchNode → wrap in OpenSearch query structure
- Service is integrated with RsDorDcApp via `searchParserService.js`
- Service runs on port 4567 in Docker (http://search-parser:4567)
- Must maintain backward compatibility with existing integration
- **Following TDD**: Write tests first, then implement to make tests pass, then document

## Next Steps
1. ✅ Task 1 complete - Integration approach decided
2. **Begin Task 2 - Write Tests (TDD):**
   - Set up test framework in mlibrary_search_parser (already has RSpec)
   - Create `spec/mlibrary_search_parser/transform/opensearch/query_dsl_spec.rb`
   - Write test cases for TokensNode transformation
   - Write test cases for AndNode (bool/must)
   - Write test cases for OrNode (bool/should)
   - Write test cases for NotNode (bool/must_not)
   - Write test cases for FieldedNode
   - Write test cases for SearchNode
   - Write test cases for nested/complex queries
   - Write test cases for edge cases (empty, unparseable, etc.)
3. Task 3: Implement OpenSearch transformer to make all tests pass
4. Task 4: Update documentation with configuration and examples

