# Custom Endpoint Configuration for ReactiveSearch

This guide explains how to configure ReactiveSearch to use a different OpenSearch endpoint instead of the default `_search` or `_reactivesearch.v3`.

## Overview

By default, ReactiveSearch uses the `/_reactivesearch.v3` endpoint when communicating with the backend. You can customize this to use any OpenSearch endpoint you need.

## Option 1: Global Configuration with `transformRequest` (Recommended)

Use the `transformRequest` prop on `ReactiveBase` to modify the endpoint URL for ALL components globally.

### Example Implementation

```jsx
<ReactiveBase
    app="dor-dc"
    credentials={REACTIVESEARCH_CONFIG.credentials}
    url={REACTIVESEARCH_CONFIG.url}
    transformRequest={(props) => ({
        ...props,
        url: props.url.replace('/_reactivesearch.v3', '/_custom_search')
            .replace('/dor-dc/_reactivesearch.v3', '/dor-dc/_custom_search')
    })}
>
    {/* Your components */}
</ReactiveBase>
```

### With Environment Variables

**1. Update `constants.js`:**
```javascript
export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    customEndpoint: import.meta.env.VITE_CUSTOM_SEARCH_ENDPOINT || '/_custom_search',
};
```

**2. Use in ReactiveBase:**
```jsx
<ReactiveBase
    app="dor-dc"
    credentials={REACTIVESEARCH_CONFIG.credentials}
    url={REACTIVESEARCH_CONFIG.url}
    transformRequest={(props) => {
        if (REACTIVESEARCH_CONFIG.customEndpoint) {
            return {
                ...props,
                url: props.url
                    .replace('/_reactivesearch.v3', REACTIVESEARCH_CONFIG.customEndpoint)
                    .replace(`/dor-dc/_reactivesearch.v3`, `/dor-dc${REACTIVESEARCH_CONFIG.customEndpoint}`)
            };
        }
        return props;
    }}
>
```

**3. Set Environment Variable:**
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_my_custom_endpoint"
```

### Complete Custom URL

If you want to completely replace the URL:

```jsx
transformRequest={(props) => ({
    ...props,
    url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_your_custom_endpoint`
})}
```

---

## Option 2: Per-Component Configuration with `endpoint`

Configure custom endpoints for individual components like SearchBox, MultiList, etc.

### SearchBox with Custom Endpoint

```jsx
<SearchBox
    componentId="search"
    dataField={["ic_all"]}
    endpoint={{
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_custom_search`,
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>
```

### MultiList with Custom Endpoint

```jsx
<MultiList
    componentId="collection"
    dataField="collection_name.keyword"
    endpoint={{
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_custom_search`,
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>
```

### ReactiveList with Custom Endpoint

```jsx
<ReactiveList
    componentId="results"
    dataField="ic_all"
    endpoint={{
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_custom_search`,
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>
```

---

## Option 3: Direct OpenSearch Endpoint

To use OpenSearch's native `_search` endpoint without ReactiveSearch's wrapper:

### Global Configuration

```jsx
<ReactiveBase
    app="dor-dc"
    credentials={REACTIVESEARCH_CONFIG.credentials}
    url={REACTIVESEARCH_CONFIG.url}
    transformRequest={(props) => ({
        ...props,
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_search`
    })}
>
```

### Per-Component

```jsx
<SearchBox
    componentId="search"
    dataField={["ic_all"]}
    endpoint={{
        url: `${REACTIVESEARCH_CONFIG.url}/dor-dc/_search`,
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>
```

---

## Option 4: Advanced - Custom Request Transformation

For more complex scenarios, you can transform headers, body, and more:

```jsx
<ReactiveBase
    app="dor-dc"
    credentials={REACTIVESEARCH_CONFIG.credentials}
    url={REACTIVESEARCH_CONFIG.url}
    transformRequest={(props) => {
        // Log all requests for debugging
        console.log('Request:', props);
        
        return {
            ...props,
            // Custom URL
            url: props.url.replace('/_reactivesearch.v3', '/_custom_search'),
            
            // Add custom headers
            headers: {
                ...props.headers,
                'X-Custom-Header': 'custom-value'
            },
            
            // Modify request body if needed
            body: {
                ...props.body,
                // Add custom parameters
            }
        };
    }}
>
```

---

## Common Use Cases

### 1. Using OpenSearch's Native `_search` Endpoint

```jsx
transformRequest={(props) => ({
    ...props,
    url: props.url
        .replace('/_reactivesearch.v3', '/_search')
        .replace('/dor-dc/_reactivesearch.v3', '/dor-dc/_search')
})}
```

### 2. Using a Custom API Gateway

```jsx
transformRequest={(props) => ({
    ...props,
    url: `https://api.yourgateway.com/search`,
    headers: {
        ...props.headers,
        'X-API-Key': 'your-api-key'
    }
})}
```

### 3. Using Multiple Indexes with Different Endpoints

```jsx
const getEndpointUrl = (componentId) => {
    const endpointMap = {
        'search': `${REACTIVESEARCH_CONFIG.url}/dor-dc/_search`,
        'collection': `${REACTIVESEARCH_CONFIG.url}/collections/_search`,
        'subject': `${REACTIVESEARCH_CONFIG.url}/subjects/_search`
    };
    return endpointMap[componentId] || `${REACTIVESEARCH_CONFIG.url}/dor-dc/_search`;
};

// Then for each component:
<SearchBox
    componentId="search"
    endpoint={{
        url: getEndpointUrl('search'),
        headers: {
            'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials),
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }}
/>
```

---

## Environment Variables Setup

Add to your environment or `env.template.sh`:

```bash
# ReactiveSearch Backend URL
export VITE_REACTIVESEARCH_URL="http://reactivesearch:8000"

# ReactiveSearch Credentials (format: username:password)
export VITE_REACTIVESEARCH_CREDENTIALS="admin:password"

# Custom Search Endpoint (optional)
export VITE_CUSTOM_SEARCH_ENDPOINT="/_custom_search"
```

Or create a `.env` file in your project root:

```env
VITE_REACTIVESEARCH_URL=http://reactivesearch:8000
VITE_REACTIVESEARCH_CREDENTIALS=admin:password
VITE_CUSTOM_SEARCH_ENDPOINT=/_custom_search
```

---

## Debugging

### 1. Log All Requests

```jsx
transformRequest={(props) => {
    console.log('ReactiveSearch Request:', {
        url: props.url,
        method: props.method,
        headers: props.headers,
        body: props.body
    });
    
    return {
        ...props,
        url: props.url.replace('/_reactivesearch.v3', '/_custom_search')
    };
}}
```

### 2. Monitor Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform a search
5. Check the request URL and payload

### 3. Test Endpoint Directly

Use curl to test your custom endpoint:

```bash
curl -X POST "http://reactivesearch:8000/dor-dc/_custom_search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
  -d '{
    "query": {
      "match_all": {}
    }
  }'
```

---

## Comparison of Approaches

| Approach | Scope | Use Case | Complexity |
|----------|-------|----------|------------|
| `transformRequest` on ReactiveBase | Global | Change endpoint for all components | Low |
| `endpoint` on individual components | Per-component | Different endpoints per component | Medium |
| Environment variables | Global | Different environments (dev/prod) | Low |
| Custom transformation function | Global | Complex URL/header modifications | High |

---

## Best Practices

1. **Use `transformRequest` for global changes** - Easier to maintain
2. **Use environment variables** - Separate configs for dev/staging/prod
3. **Log requests during development** - Helps debug endpoint issues
4. **Test endpoint separately** - Use curl or Postman before integrating
5. **Handle authentication properly** - Ensure headers are set correctly
6. **Error handling** - Add proper error handling for endpoint failures

---

## Troubleshooting

### Issue: 404 Not Found
- **Cause**: Endpoint doesn't exist on the server
- **Solution**: Verify the endpoint path is correct and exists in OpenSearch

### Issue: 401 Unauthorized
- **Cause**: Authentication credentials are wrong or missing
- **Solution**: Check `REACTIVESEARCH_CONFIG.credentials` and header configuration

### Issue: CORS Error
- **Cause**: OpenSearch doesn't allow cross-origin requests
- **Solution**: Configure CORS on OpenSearch or use a proxy

### Issue: Requests still going to default endpoint
- **Cause**: `transformRequest` not applied or components have their own `endpoint` prop
- **Solution**: Ensure `transformRequest` is on ReactiveBase and check for component-level overrides

---

## Example: Complete Implementation

Here's a complete example combining all best practices:

```jsx
// constants.js
export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    customEndpoint: import.meta.env.VITE_CUSTOM_SEARCH_ENDPOINT || '/_custom_search',
};

// RsDorDcApp/index.jsx
import React from 'react';
import { ReactiveBase, SearchBox, ReactiveList } from '@appbaseio/reactivesearch';
import { REACTIVESEARCH_CONFIG } from './utils/constants.js';

function RsDorDcApp() {
    return (
        <ReactiveBase
            app="dor-dc"
            credentials={REACTIVESEARCH_CONFIG.credentials}
            url={REACTIVESEARCH_CONFIG.url}
            transformRequest={(props) => {
                const newUrl = REACTIVESEARCH_CONFIG.customEndpoint
                    ? props.url
                        .replace('/_reactivesearch.v3', REACTIVESEARCH_CONFIG.customEndpoint)
                        .replace(`/dor-dc/_reactivesearch.v3`, `/dor-dc${REACTIVESEARCH_CONFIG.customEndpoint}`)
                    : props.url;
                
                // Log in development
                if (import.meta.env.DEV) {
                    console.log('Request URL:', newUrl);
                }
                
                return {
                    ...props,
                    url: newUrl
                };
            }}
        >
            <SearchBox
                componentId="search"
                dataField={["ic_all"]}
            />
            <ReactiveList
                componentId="results"
                dataField="ic_all"
                react={{ and: ["search"] }}
            />
        </ReactiveBase>
    );
}

export default RsDorDcApp;
```

This provides maximum flexibility with minimal code changes!

