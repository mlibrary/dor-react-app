# Search Template Configuration for ReactiveSearch

## Overview

Search templates in OpenSearch/Elasticsearch allow you to define reusable, parameterized queries on the server side. This provides several benefits:
- **Performance**: Pre-compiled queries on the server
- **Security**: Query logic hidden from client
- **Consistency**: Centralized query management
- **Simplicity**: Clients only pass parameters, not full queries

Your ReactiveSearch app is now configured to use the `/_search/template` endpoint.

---

## Current Configuration

### Constants Configuration
**File:** `/src/apps/RsDorDcApp/utils/constants.js`

```javascript
export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    customEndpoint: import.meta.env.VITE_CUSTOM_SEARCH_ENDPOINT || '/_search/template',
    searchTemplate: {
        id: import.meta.env.VITE_SEARCH_TEMPLATE_ID || 'dor_search_template',
        useTemplate: import.meta.env.VITE_USE_SEARCH_TEMPLATE === 'true' || true,
    }
};
```

### Environment Variables
**File:** `.env`

```env
VITE_REACTIVESEARCH_URL="https://reactivesearch.discovery.dor.lib.umich.edu"
VITE_REACTIVESEARCH_CREDENTIALS="rs-admin-user:rs-password"
VITE_CUSTOM_SEARCH_ENDPOINT="/_search/template"
VITE_SEARCH_TEMPLATE_ID="dor_search_template"
VITE_USE_SEARCH_TEMPLATE="true"
```

---

## Step 1: Create a Search Template on OpenSearch

Before using search templates, you need to create one on your OpenSearch server.

### Basic Template Example

```bash
curl -X PUT "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "script": {
      "lang": "mustache",
      "source": {
        "query": {
          "bool": {
            "must": [
              "{{#query}}{{{query}}}{{/query}}{{^query}}{\"match_all\":{}}{{/query}}"
            ]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}"
      }
    }
  }'
```

### Advanced Template with Aggregations

```bash
curl -X PUT "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "script": {
      "lang": "mustache",
      "source": {
        "query": {
          "bool": {
            "must": [
              "{{#query}}{{{query}}}{{/query}}{{^query}}{\"match_all\":{}}{{/query}}"
            ],
            "filter": [
              "{{#filters}}{{{.}}}{{^last}},{{/last}}{{/filters}}"
            ]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}",
        "aggs": {
          "{{#aggs}}{{{.}}}{{/aggs}}"
        }
      }
    }
  }'
```

### Template for DOR-DC Specific Search

```bash
curl -X PUT "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "script": {
      "lang": "mustache",
      "source": {
        "query": {
          "bool": {
            "must": [
              {
                "{{#query_type}}{{query_type}}{{/query_type}}{{^query_type}}multi_match{{/query_type}}": {
                  "query": "{{query_string}}",
                  "fields": ["{{#fields}}{{.}}{{^last}},{{/last}}{{/fields}}"]
                }
              }
            ],
            "filter": [
              "{{#collection_filter}}",
              {
                "term": {
                  "collection_name.keyword": "{{collection_filter}}"
                }
              },
              "{{/collection_filter}}",
              "{{#subject_filter}}",
              {
                "term": {
                  "dc_su.keyword": "{{subject_filter}}"
                }
              },
              "{{/subject_filter}}"
            ]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}",
        "aggs": {
          "{{#aggregations}}{{{.}}}{{/aggregations}}"
        }
      }
    }
  }'
```

---

## Step 2: Verify Template Creation

Check if the template was created successfully:

```bash
curl -X GET "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -u "rs-admin-user:rs-password"
```

---

## Step 3: Test the Template

Test the template with sample parameters:

```bash
curl -X POST "https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "id": "dor_search_template",
    "params": {
      "query": {
        "multi_match": {
          "query": "university",
          "fields": ["ic_all"]
        }
      },
      "size": 10,
      "from": 0
    }
  }'
```

---

## How It Works

### Request Transformation Flow

1. **ReactiveSearch Component** (e.g., SearchBox) generates a query
2. **transformRequest** intercepts the request
3. **URL is transformed**: `/_reactivesearch.v3` → `/_search/template`
4. **Body is transformed**: 
   ```javascript
   // Original ReactiveSearch query
   {
     "query": { "multi_match": { ... } },
     "size": 10,
     "from": 0
   }
   
   // Transformed to template format
   {
     "id": "dor_search_template",
     "params": {
       "query": { "multi_match": { ... } },
       "size": 10,
       "from": 0
     }
   }
   ```
5. **OpenSearch processes** the template with parameters
6. **Results returned** to ReactiveSearch

### Code Flow

```javascript
transformRequest={(props) => {
    if (REACTIVESEARCH_CONFIG.customEndpoint === '/_search/template') {
        // Wrap original query in template format
        const transformedBody = {
            id: 'dor_search_template',
            params: {
                query: props.body?.query || {},
                size: props.body?.size || 10,
                from: props.body?.from || 0,
                aggs: props.body?.aggs || {},
                ...props.body
            }
        };
        
        return {
            ...props,
            url: newUrl,
            body: transformedBody
        };
    }
}}
```

---

## Configuration Options

### Enable/Disable Search Templates

**Using Environment Variable:**
```bash
export VITE_USE_SEARCH_TEMPLATE="true"   # Enable
export VITE_USE_SEARCH_TEMPLATE="false"  # Disable
```

**In Code (`constants.js`):**
```javascript
searchTemplate: {
    useTemplate: true,  // or false
}
```

### Change Template ID

**Using Environment Variable:**
```bash
export VITE_SEARCH_TEMPLATE_ID="my_custom_template"
```

**In Code (`constants.js`):**
```javascript
searchTemplate: {
    id: 'my_custom_template',
}
```

### Use Different Endpoint

If you want to use a different search template endpoint:

```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_search/template"
```

---

## Advanced Template Examples

### Template with Dynamic Field Selection

```json
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "multi_match": {
          "query": "{{query_string}}",
          "fields": [
            "{{#search_fields}}{{.}}{{^last}},{{/last}}{{/search_fields}}"
          ],
          "type": "{{match_type}}{{^match_type}}best_fields{{/match_type}}",
          "operator": "{{operator}}{{^operator}}and{{/operator}}"
        }
      },
      "size": "{{size}}{{^size}}10{{/size}}",
      "from": "{{from}}{{^from}}0{{/from}}"
    }
  }
}
```

### Template with Conditional Query Types

```json
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "{{#use_query_string}}query_string{{/use_query_string}}{{^use_query_string}}multi_match{{/use_query_string}}": {
          "query": "{{query}}",
          "fields": ["{{#fields}}{{.}}{{^last}},{{/last}}{{/fields}}"],
          "{{#use_query_string}}default_operator{{/use_query_string}}{{^use_query_string}}operator{{/use_query_string}}": "{{operator}}{{^operator}}and{{/operator}}"
        }
      }
    }
  }
}
```

### Template with Pagination and Sorting

```json
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": "{{#query}}{{{query}}}{{/query}}",
      "size": "{{size}}{{^size}}10{{/size}}",
      "from": "{{from}}{{^from}}0{{/from}}",
      "sort": [
        {
          "{{sort_field}}{{^sort_field}}_score{{/sort_field}}": {
            "order": "{{sort_order}}{{^sort_order}}desc{{/sort_order}}"
          }
        }
      ]
    }
  }
}
```

---

## Debugging

### Enable Development Logging

The app automatically logs requests in development mode. Check browser console for:

```
ReactiveSearch Request URL: https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template
Original Body: { query: {...}, size: 10 }
Transformed Body: { id: "dor_search_template", params: {...} }
```

### Test Template Rendering

Render the template without executing to see the final query:

```bash
curl -X POST "https://reactivesearch.discovery.dor.lib.umich.edu/_render/template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "id": "dor_search_template",
    "params": {
      "query": {
        "multi_match": {
          "query": "test",
          "fields": ["ic_all"]
        }
      },
      "size": 10
    }
  }'
```

### List All Templates

```bash
curl -X GET "https://reactivesearch.discovery.dor.lib.umich.edu/_cluster/state/metadata?pretty&filter_path=**.stored_scripts" \
  -u "rs-admin-user:rs-password"
```

---

## Troubleshooting

### Issue: Template Not Found (404)

**Cause**: Template doesn't exist on the server

**Solution**: 
1. Create the template using the PUT command
2. Verify template name matches `VITE_SEARCH_TEMPLATE_ID`
3. Check template was created: `GET /_scripts/{template_id}`

### Issue: Invalid Template Parameters

**Cause**: Parameters don't match template expectations

**Solution**:
1. Use `/_render/template` to test parameter rendering
2. Check template source for required parameters
3. Review transformation logic in `transformRequest`

### Issue: Template Syntax Errors

**Cause**: Invalid Mustache syntax in template

**Solution**:
1. Validate Mustache syntax
2. Test with `/_render/template`
3. Check OpenSearch logs for syntax errors

### Issue: Authentication Errors (401)

**Cause**: Invalid credentials

**Solution**:
1. Verify credentials in `.env` file
2. Test with curl using same credentials
3. Check OpenSearch security settings

### Issue: Still Using Old Endpoint

**Cause**: Environment variables not loaded or dev server not restarted

**Solution**:
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Verify `.env` file exists and has correct values

---

## Migration from Direct Queries

If you were using direct queries and want to migrate to templates:

### Before (Direct Query)
```javascript
customQuery={(value, props) => ({
    query: {
        multi_match: {
            query: value,
            fields: props.dataField
        }
    }
})}
```

### After (Template)
1. Create template with the query logic
2. Remove `customQuery` or simplify it
3. Let `transformRequest` handle template wrapping
4. Template receives the query as parameters

The advantage: Query logic is now server-side and can be updated without code changes!

---

## Best Practices

1. **Template Naming**: Use descriptive names like `{app}_{purpose}_template`
2. **Version Control**: Track template definitions in your repo
3. **Testing**: Always test templates with `/_render/template` first
4. **Documentation**: Document template parameters and expected format
5. **Error Handling**: Add error handling for template parameter validation
6. **Performance**: Use templates for complex queries to benefit from compilation
7. **Security**: Keep query logic server-side for better security

---

## Example: Complete Template Setup

### 1. Create Template Script

Save as `create-search-template.sh`:

```bash
#!/bin/bash

OPENSEARCH_URL="${VITE_REACTIVESEARCH_URL:-https://reactivesearch.discovery.dor.lib.umich.edu}"
CREDENTIALS="${VITE_REACTIVESEARCH_CREDENTIALS:-rs-admin-user:rs-password}"
TEMPLATE_ID="dor_search_template"

curl -X PUT "${OPENSEARCH_URL}/_scripts/${TEMPLATE_ID}" \
  -H "Content-Type: application/json" \
  -u "${CREDENTIALS}" \
  -d '{
    "script": {
      "lang": "mustache",
      "source": {
        "query": {
          "bool": {
            "must": ["{{#query}}{{{query}}}{{/query}}{{^query}}{\"match_all\":{}}{{/query}}"],
            "filter": ["{{#filters}}{{{.}}}{{^last}},{{/last}}{{/filters}}"]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}",
        "aggs": {{{aggs}}}
      }
    }
  }'

echo ""
echo "Template created: ${TEMPLATE_ID}"
```

### 2. Make Executable and Run

```bash
chmod +x create-search-template.sh
source .env
./create-search-template.sh
```

### 3. Verify in Your App

```bash
npm run dev
```

Open browser console and perform a search. You should see:
```
ReactiveSearch Request URL: https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template
Transformed Body: {id: "dor_search_template", params: {...}}
```

---

## Summary

✅ **Configuration Complete**
- Custom endpoint set to `/_search/template`
- Template ID configurable via environment variable
- Request transformation automatically wraps queries in template format
- Development logging enabled for debugging

✅ **Next Steps**
1. Create your search template on OpenSearch server
2. Test template with `/_render/template`
3. Verify template ID matches configuration
4. Test search functionality in your app

✅ **Benefits**
- Server-side query compilation for better performance
- Centralized query management
- Enhanced security (query logic hidden from client)
- Easier to update queries without code changes

For more information, see the [OpenSearch Search Template Documentation](https://opensearch.org/docs/latest/search-plugins/search-template/).

