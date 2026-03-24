# Practical Examples: Using Custom Endpoints

## Example 1: Using OpenSearch's Native `_search` Endpoint

This is useful when you want direct access to OpenSearch without ReactiveSearch's wrapper.

### Set Environment Variable
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_search"
npm run dev
```

### Result
All requests will go to:
```
http://reactivesearch:8000/dor-dc/_search
```

Instead of:
```
http://reactivesearch:8000/dor-dc/_reactivesearch.v3
```

---

## Example 2: Using a Proxy Endpoint

You may have a custom proxy that handles authentication or request transformation.

### Set Environment Variable
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/api/proxy/search"
npm run dev
```

### Result
All requests will go to:
```
http://reactivesearch:8000/dor-dc/api/proxy/search
```

---

## Example 3: Different Environments

Use different endpoints for development, staging, and production.

### Development (.env.development)
```env
VITE_REACTIVESEARCH_URL=http://localhost:9200
VITE_CUSTOM_SEARCH_ENDPOINT=/_search
```

### Staging (.env.staging)
```env
VITE_REACTIVESEARCH_URL=https://staging-search.example.com
VITE_CUSTOM_SEARCH_ENDPOINT=/_custom_search
```

### Production (.env.production)
```env
VITE_REACTIVESEARCH_URL=https://search.example.com
VITE_CUSTOM_SEARCH_ENDPOINT=/_reactivesearch.v3
```

---

## Example 4: No Custom Endpoint (Use Default)

If you don't want to use a custom endpoint:

### Don't Set the Variable
```bash
# Don't set VITE_CUSTOM_SEARCH_ENDPOINT
npm run dev
```

Or set it to empty:
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT=""
npm run dev
```

### Result
Uses the default ReactiveSearch endpoint:
```
http://reactivesearch:8000/dor-dc/_reactivesearch.v3
```

---

## Example 5: Testing with Docker Compose

Update your `compose.yaml` to set the custom endpoint:

```yaml
services:
  app:
    build: .
    environment:
      - VITE_REACTIVESEARCH_URL=http://opensearch:9200
      - VITE_REACTIVESEARCH_CREDENTIALS=admin:admin
      - VITE_CUSTOM_SEARCH_ENDPOINT=/_search
    ports:
      - "3000:3000"
```

Then run:
```bash
docker-compose up
```

---

## Example 6: Shell Script for Environment Setup

Create a file `env.local.sh`:

```bash
#!/bin/bash

# Development environment
export VITE_REACTIVESEARCH_URL="http://localhost:9200"
export VITE_REACTIVESEARCH_CREDENTIALS="admin:password"
export VITE_CUSTOM_SEARCH_ENDPOINT="/_search"

echo "Environment variables set for development"
echo "URL: $VITE_REACTIVESEARCH_URL"
echo "Endpoint: $VITE_CUSTOM_SEARCH_ENDPOINT"
```

Make it executable and run:
```bash
chmod +x env.local.sh
source env.local.sh
npm run dev
```

---

## Example 7: Hardcoded Configuration

If you don't want to use environment variables, edit the constants file directly.

**File:** `/src/apps/RsDorDcApp/utils/constants.js`

```javascript
export const REACTIVESEARCH_CONFIG = {
    url: 'http://reactivesearch:8000',
    credentials: 'admin:password',
    customEndpoint: '/_search', // Hardcoded custom endpoint
};
```

---

## Example 8: Conditional Endpoint Based on Component

For advanced use cases where different components need different endpoints:

**File:** `/src/apps/RsDorDcApp/index.jsx`

```javascript
transformRequest={(props) => {
    // Determine endpoint based on request type or component
    let customEndpoint = REACTIVESEARCH_CONFIG.customEndpoint;
    
    // Example: Use different endpoints for different operations
    if (props.body && props.body.query) {
        // Search queries go to _search
        customEndpoint = '/_search';
    } else if (props.body && props.body.aggs) {
        // Aggregation queries go to custom aggregation endpoint
        customEndpoint = '/_aggregate';
    }
    
    if (customEndpoint) {
        const newUrl = props.url
            .replace('/_reactivesearch.v3', customEndpoint)
            .replace(`/dor-dc/_reactivesearch.v3`, `/dor-dc${customEndpoint}`);
        
        if (import.meta.env.DEV) {
            console.log('Request URL:', newUrl);
            console.log('Request Body:', props.body);
        }
        
        return {
            ...props,
            url: newUrl
        };
    }
    
    return props;
}}
```

---

## Example 9: Adding Custom Headers

Combine custom endpoint with custom headers:

```javascript
transformRequest={(props) => {
    if (REACTIVESEARCH_CONFIG.customEndpoint) {
        const newUrl = props.url
            .replace('/_reactivesearch.v3', REACTIVESEARCH_CONFIG.customEndpoint)
            .replace(`/dor-dc/_reactivesearch.v3`, `/dor-dc${REACTIVESEARCH_CONFIG.customEndpoint}`);
        
        return {
            ...props,
            url: newUrl,
            headers: {
                ...props.headers,
                'X-Custom-Header': 'my-value',
                'X-Request-ID': Math.random().toString(36).substring(7)
            }
        };
    }
    return props;
}}
```

---

## Example 10: Per-Component Override

Even with global configuration, you can override for specific components:

```jsx
<SearchBox
    componentId="search"
    dataField={["ic_all"]}
    // This component uses a different endpoint
    endpoint={{
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_custom_search`,
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>

<MultiList
    componentId="collection"
    dataField="collection_name.keyword"
    // This component uses the global endpoint (from transformRequest)
/>
```

---

## Verification Script

Create `test-endpoint.sh` to verify your endpoint configuration:

```bash
#!/bin/bash

# Test endpoint connectivity
URL="${VITE_REACTIVESEARCH_URL:-http://reactivesearch:8000}"
ENDPOINT="${VITE_CUSTOM_SEARCH_ENDPOINT:-/_search}"
CREDS="${VITE_REACTIVESEARCH_CREDENTIALS:-admin:password}"

echo "Testing endpoint: ${URL}/dor-dc${ENDPOINT}"

curl -X POST "${URL}/dor-dc${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n $CREDS | base64)" \
  -d '{
    "query": {
      "match_all": {}
    },
    "size": 1
  }' | jq '.'

echo ""
echo "If you see results above, the endpoint is working!"
```

Run it:
```bash
chmod +x test-endpoint.sh
./test-endpoint.sh
```

---

## Common Endpoints Reference

| Endpoint | Purpose | Use Case |
|----------|---------|----------|
| `/_search` | OpenSearch native search | Direct OpenSearch access |
| `/_msearch` | Multi-search | Batch multiple searches |
| `/_reactivesearch.v3` | ReactiveSearch API | Default (no custom endpoint) |
| `/_custom_search` | Your custom endpoint | Custom search logic/proxy |
| `/api/search` | API Gateway | Through authentication gateway |

---

## Quick Checklist

- [ ] Set `VITE_CUSTOM_SEARCH_ENDPOINT` environment variable
- [ ] Restart dev server (`npm run dev`)
- [ ] Check console for log: "ReactiveSearch Request URL: ..."
- [ ] Verify in Network tab that requests go to custom endpoint
- [ ] Test search functionality works
- [ ] Test filters (MultiList) work
- [ ] Check results are displayed correctly

---

## Troubleshooting Common Issues

### Issue: Environment variable not working
**Solution:** Make sure to restart the dev server after setting variables.

### Issue: Still using old endpoint
**Solution:** Clear browser cache and hard reload (Cmd+Shift+R or Ctrl+Shift+R).

### Issue: 404 on custom endpoint
**Solution:** Verify the endpoint exists on your backend server.

### Issue: Authentication fails
**Solution:** Check `VITE_REACTIVESEARCH_CREDENTIALS` is correct.

### Issue: No logs in console
**Solution:** Make sure you're running in development mode (`npm run dev`, not `npm run build`).

---

Need more help? Check the complete documentation in `docs/custom-endpoint-configuration.md`

