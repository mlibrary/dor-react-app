# DOR-159 Status

## Last Updated
2026-05-05 - Ruby environment verified, all tests running, ready to begin Task 3 implementation

## Current Branch
`DOR-159/query-parser-microservice`

## Open Tasks
Following TDD approach: Research → Tests → Implementation → Documentation

### Task 1: Research and Document Parser Architecture and OpenSearch Syntax ✅
**Status**: Complete - Selected Option 1 (add OpenSearch transformer to gem)

### Task 2: Write Tests for OpenSearch Output Formatter (TDD) ✅
**Status**: Complete - 290-line comprehensive test suite written, committed to parser branch

### Task 3: Implement OpenSearch Output Formatter
**Status**: Ready to begin - Tests written, now implement to make them pass

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
- Developer decision: Option 1 (add transformer to gem)
- Configuration approach: Simple one-at-a-time format selection
- ✅ Task 1 complete: All subtasks checked off
- ✅ Parser setup complete: Cloned parser, created DOR-159/opensearch-query-dsl branch
- ✅ Task 2 complete: Test suite written (TDD):
  - Created `spec/opensearch_transforms/query_dsl_spec.rb` (290 lines)
  - Comprehensive coverage: TokensNode, AndNode, OrNode, NotNode, FieldedNode, SearchNode
  - Tests for complex nested queries and edge cases
  - API integration tests (to_opensearch_query method)
  - Committed to parser branch (commit 61c2680)
  - All tests expected to fail until implementation (Red phase of TDD)
- **Added Ruby to dev container:**
  - Updated `.devcontainer/Dockerfile` with ruby-full, ruby-bundler, build-essential
  - Committed (60564bc)
  - **Container rebuild required before Task 3**
- Ready to begin Task 3 after container rebuild
- **New agent session (2026-05-05):**
  - Completed onboarding quiz (AGENT_QUIZ.md) - all 20 questions answered from project files
  - Self-graded using AGENT_QUIZ_ANSWERS.md - 20/20 correct
  - Updated AGENT_QUIZ_ANSWERS.md A18 to reflect both active tickets (DOR-158 and DOR-159)
  - Verified all markdown table formatting across project (all tables OK)
  - Committed documentation updates (8cdc5d4)
  - **Ruby environment verification successful:**
    - Ruby 3.1.2p20 and Bundler 2.3.15 confirmed installed
    - Bundle install completed in mlibrary_search_parser
    - All 166 existing tests pass (0 failures, 96.27% coverage)
    - OpenSearch tests running: 32 examples, 31 failures (TDD Red phase - expected)
    - All failures are NoMethodError for to_opensearch_query (as expected)
    - Test suite ready for Task 3 implementation

## Key Context
- The search-parser microservice already exists as a stub at `search-parser-service/`
- **mlibrary_search_parser setup:**
  - Cloned to `/workspaces/dor-react-app/mlibrary_search_parser/` (gitignored)
  - Working branch: `DOR-159/opensearch-query-dsl` (off main)
  - Team controls and maintains this gem
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
2. ✅ Task 2 complete - Comprehensive test suite written
3. ✅ Ruby environment verified - All tests running, ready for implementation
4. **Begin Task 3 - Implement OpenSearch Transformer:**
   - Create `lib/mlibrary_search_parser/transform/opensearch/` directory
   - Create `query_dsl.rb` transformer class
   - Implement TokensNode transformation (match/match_phrase)
   - Implement AndNode transformation (bool/must)
   - Implement OrNode transformation (bool/should)
   - Implement NotNode transformation (bool/must_not)
   - Implement FieldedNode transformation (field-specific queries)
   - Implement SearchNode transformation (wrap in query structure)
   - Add configuration support for output_format selection
   - Add to_opensearch_query method to Search class
   - Run tests and iterate until all pass (Green phase of TDD)
   - Refactor code for clarity and maintainability
5. Task 4: Update documentation with configuration and examples

