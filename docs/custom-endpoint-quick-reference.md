# Quick Reference: Custom Endpoint Configuration

## TL;DR - How to Change the Endpoint

### Method 1: Environment Variable (Recommended)

**Step 1:** Set the environment variable:
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_your_custom_endpoint"
```

**Step 2:** That's it! The app is already configured to use it.

The `transformRequest` in `ReactiveBase` will automatically pick up the custom endpoint and replace the default `/_reactivesearch.v3` with your custom endpoint.

---

### Method 2: Direct Code Change

Edit `/src/apps/RsDorDcApp/utils/constants.js`:

```javascript
export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    customEndpoint: '/_my_custom_endpoint', // Change this line
};
```

---

## Common Endpoint Examples

### 1. Use OpenSearch Native `_search`
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_search"
```

### 2. Use a Custom Endpoint
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_custom_search"
```

### 3. Use MSSearch (Multi-Search)
```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_msearch"
```

### 4. Disable Custom Endpoint (use default)
```bash
# Don't set the variable, or set it to empty
export VITE_CUSTOM_SEARCH_ENDPOINT=""
```

---

## How It Works

The `ReactiveBase` component has a `transformRequest` function that:

1. Checks if `REACTIVESEARCH_CONFIG.customEndpoint` is set
2. If set, replaces `/_reactivesearch.v3` with your custom endpoint
3. If not set, uses the default ReactiveSearch endpoint
4. In development mode, logs the URL to console for debugging

**Code in `/src/apps/RsDorDcApp/index.jsx`:**
```jsx
transformRequest={(props) => {
    if (REACTIVESEARCH_CONFIG.customEndpoint) {
        const newUrl = props.url
            .replace('/_reactivesearch.v3', REACTIVESEARCH_CONFIG.customEndpoint)
            .replace(`/dor-dc/_reactivesearch.v3`, `/dor-dc${REACTIVESEARCH_CONFIG.customEndpoint}`);
        
        if (import.meta.env.DEV) {
            console.log('ReactiveSearch Request URL:', newUrl);
        }
        
        return { ...props, url: newUrl };
    }
    return props;
}}
```

---

## Testing Your Configuration

### 1. Check the Console
Open browser DevTools and look for:
```
ReactiveSearch Request URL: http://reactivesearch:8000/dor-dc/_your_custom_endpoint
```

### 2. Check Network Tab
1. Open DevTools → Network tab
2. Perform a search
3. Look for requests to your custom endpoint

### 3. Test the Endpoint with Curl
```bash
curl -X POST "http://reactivesearch:8000/dor-dc/_your_custom_endpoint" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
  -d '{"query": {"match_all": {}}}'
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_REACTIVESEARCH_URL` | Backend service URL | `http://reactivesearch:8000` |
| `VITE_REACTIVESEARCH_CREDENTIALS` | Basic auth credentials | `admin:password` |
| `VITE_CUSTOM_SEARCH_ENDPOINT` | Custom endpoint path | `/_custom_search` |

---

## Troubleshooting

**Problem:** Changes not taking effect
- **Solution:** Restart the Vite dev server after changing environment variables

**Problem:** Still seeing `/_reactivesearch.v3` in requests
- **Solution:** Check that `VITE_CUSTOM_SEARCH_ENDPOINT` is set correctly

**Problem:** 404 Not Found
- **Solution:** Verify the endpoint exists on your OpenSearch/ReactiveSearch backend

**Problem:** Requests failing
- **Solution:** Check credentials and URL are correct in constants

---

For more detailed information, see [custom-endpoint-configuration.md](./custom-endpoint-configuration.md)

