# mlibrary_search_parser Integration Analysis

## Parser Architecture Overview

### What It Is
The `mlibrary_search_parser` is a Ruby gem that:
1. **Parses** user queries using Parslet (a PEG parser generator)
2. **Builds** an Abstract Syntax Tree (AST) of Node objects
3. **Transforms** the AST into output format (currently only Solr JSON with eDisMax)

### Key Components

```
User Query String
    ↓
QueryParser (Parslet) → Parse Tree
    ↓
QueryTransformer → AST (Node objects)
    ↓
Transform::Solr::JsonEdismax → Solr JSON output
```

**Node Types:**
- `SearchNode` - Root node containing query structure
- `TokensNode` - Simple search terms
- `AndNode`, `OrNode` - Boolean operators
- `NotNode` - Negation operator  
- `FieldedNode` - Field-specific searches (e.g., `title:foo`)
- `UnparseableNode` - Fallback for malformed queries

**Current Output:**
- Only generates Solr JSON with eDisMax configuration
- Located in `lib/mlibrary_search_parser/transform/solr/json_edismax.rb`

## Integration Options

### Option 1: Add OpenSearch Transformer to the Gem

**Approach:** Create a new transformer module alongside the existing Solr transformer.

**Structure:**
```
lib/mlibrary_search_parser/transform/
  ├── solr/
  │   └── json_edismax.rb (existing)
  └── opensearch/
      └── query_dsl.rb (new)
```

**Implementation:**
```ruby
# New transformer
module MLibrarySearchParser::Transformer::OpenSearch
  class QueryDSL
    def transform(node)
      case node.node_type
      when :tokens then tokens_to_opensearch(node)
      when :and then and_to_opensearch(node)
      # ... etc
      end
    end
  end
end
```

**Pros:**
- ✅ Clean separation of concerns (Solr vs OpenSearch)
- ✅ Follows existing gem architecture
- ✅ Can be contributed back to upstream if desired
- ✅ Easy to test with existing test infrastructure
- ✅ Other projects could benefit from the work

**Cons:**
- ❌ Requires modifying external gem code
- ❌ Need to maintain changes if gem gets updated
- ❌ More complex if you don't control the gem upstream

---

### Option 2: Vendorize the Gem with Modifications

**Approach:** Copy the gem into `search-parser-service/vendor/` and modify it there.

**Structure:**
```
search-parser-service/
  ├── vendor/
  │   └── mlibrary_search_parser/ (copied gem)
  ├── app.rb
  └── Gemfile (remove gem dependency)
```

**Implementation:**
- Copy entire gem to vendor directory
- Add OpenSearch transformer alongside Solr
- Require from vendor path instead of gem

**Pros:**
- ✅ Full control over the code
- ✅ No upstream dependency issues
- ✅ Can make any modifications needed
- ✅ Self-contained in this project

**Cons:**
- ❌ No upstream updates/bug fixes automatically
- ❌ Harder to contribute improvements back  
- ❌ Larger repository size
- ❌ Must maintain all gem dependencies manually

---

### Option 3: Wrapper Service Pattern

**Approach:** Keep gem as-is, create a wrapper that calls the gem and translates output.

**Structure:**
```
search-parser-service/
  ├── app.rb (Sinatra service)
  ├── lib/
  │   ├── parser_wrapper.rb (uses gem as-is)
  │   └── solr_to_opensearch.rb (translates Solr → OpenSearch)
  └── Gemfile (includes mlibrary_search_parser gem)
```

**Implementation:**
```ruby
class SolrToOpenSearchTranslator
  def translate(solr_json)
    # Convert Solr edismax JSON to OpenSearch query DSL
  end
end
```

**Pros:**
- ✅ Don't modify external gem at all
- ✅ Easy to get upstream updates
- ✅ Could support both formats simultaneously
- ✅ Translation layer is separate concern

**Cons:**
- ❌ Two-step transformation (AST → Solr → OpenSearch)
- ❌ May lose information/nuance in translation
- ❌ More complex than direct AST → OpenSearch
- ❌ Translation layer needs comprehensive testing

---

### Option 4: Fork the Gem as Internal Gem

**Approach:** Fork the gem, add OpenSearch support, publish to internal gem server or Git source.

**Structure:**
```
# In Gemfile:
gem 'mlibrary_search_parser',
    git: 'https://github.com/mlibrary/mlibrary_search_parser',
    branch: 'opensearch-support'
```

**Implementation:**
- Fork gem to your GitHub/GitLab
- Add OpenSearch transformer
- Reference fork in Gemfile

**Pros:**
- ✅ Clean gem dependency management
- ✅ Can update from upstream when needed
- ✅ Could contribute back via PR
- ✅ Proper versioning and dependency tracking

**Cons:**
- ❌ Requires setting up gem infrastructure (if publishing)
- ❌ Need to maintain fork and merge upstream changes
- ❌ PR process may be slow if you need quick iteration

---

## Recommended Approach

### Primary Recommendation: **Option 1 (Add Transformer to Gem)**

**Why:**
1. **Architecturally Sound** - Follows the gem's design philosophy
2. **Maintainable** - Clean separation, easy to test
3. **Reusable** - Benefits other projects/users
4. **Proper Abstraction** - Direct AST → OpenSearch (no translation layer)

**Implementation Plan:**
1. Add `lib/mlibrary_search_parser/transform/opensearch/` directory
2. Create `query_dsl.rb` transformer matching Solr structure
3. Write comprehensive tests using existing test framework
4. Update `search.rb` to support output format selection
5. Add configuration option: `output_format: :opensearch` or `:solr`

**Usage:**
```ruby
search = MLibrarySearchParser::Search.new(
  "my search", 
  config.merge(output_format: :opensearch)
)
opensearch_query = search.to_opensearch_query
```

### Alternative: **Option 2 (Vendorize)** if:
- You need rapid iteration without upstream constraints
- The gem is abandoned/unmaintained
- You have significant custom requirements

---

## Next Steps

1. **Decide on integration approach** (recommend Option 1)
2. **Study OpenSearch Query DSL** syntax and structure
3. **Map Node types to OpenSearch syntax** (e.g., AndNode → bool/must)
4. **Write test cases** for each node type transformation (TDD)
5. **Implement OpenSearch transformer**
6. **Add configuration** to switch between formats
7. **Update microservice** to accept format parameter

---

## Questions for Developer

1. Do you control the upstream `mlibrary_search_parser` gem?
2. Is the gem actively maintained?
3. Would you want to contribute OpenSearch support back upstream?
4. Do you need to support both Solr and OpenSearch simultaneously?
5. Are there other DOR projects that could benefit from OpenSearch support?

