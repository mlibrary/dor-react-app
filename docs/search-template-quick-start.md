# Quick Start: Search Template Configuration

## What Was Configured

✅ ReactiveSearch is now configured to use `/_search/template` endpoint  
✅ Template ID: `dor_search_template` (configurable via environment variable)  
✅ Automatic request transformation to template format  
✅ Development logging enabled  

---

## Quick Setup (3 Steps)

### Step 1: Create the Search Template on Server

Run the provided script:

```bash
./create-search-template.sh
```

Or manually:

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
            "must": ["{{#query}}{{{query}}}{{/query}}{{^query}}{\"match_all\":{}}{{/query}}"]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}"
      }
    }
  }'
```

### Step 2: Verify Template Creation

```bash
curl -X GET "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -u "rs-admin-user:rs-password"
```

### Step 3: Start Your App

```bash
npm run dev
```

Check browser console for:
```
ReactiveSearch Request URL: https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template
```

---

## Configuration Files

### 1. Constants (`/src/apps/RsDorDcApp/utils/constants.js`)

```javascript
export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL,
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS,
    customEndpoint: '/_search/template',
    searchTemplate: {
        id: import.meta.env.VITE_SEARCH_TEMPLATE_ID || 'dor_search_template',
        useTemplate: true,
    }
};
```

### 2. Environment Variables (`.env`)

```env
VITE_REACTIVESEARCH_URL="https://reactivesearch.discovery.dor.lib.umich.edu"
VITE_REACTIVESEARCH_CREDENTIALS="rs-admin-user:rs-password"
VITE_CUSTOM_SEARCH_ENDPOINT="/_search/template"
VITE_SEARCH_TEMPLATE_ID="dor_search_template"
VITE_USE_SEARCH_TEMPLATE="true"
```

---

## How It Works

1. **ReactiveSearch components** generate queries (SearchBox, MultiList, etc.)
2. **transformRequest** intercepts each request
3. **URL changes** from `/_reactivesearch.v3` to `/_search/template`
4. **Body transforms** from direct query to template format:
   ```javascript
   // Before
   { query: {...}, size: 10 }
   
   // After
   { id: "dor_search_template", params: { query: {...}, size: 10 } }
   ```
5. **OpenSearch** executes the template with parameters
6. **Results** returned to ReactiveSearch

---

## Testing

### Test Template Exists
```bash
curl -X GET "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -u "rs-admin-user:rs-password"
```

### Test Template Execution
```bash
curl -X POST "https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "id": "dor_search_template",
    "params": {
      "query": {"match_all": {}},
      "size": 5
    }
  }'
```

### Test Template Rendering (Debug)
```bash
curl -X POST "https://reactivesearch.discovery.dor.lib.umich.edu/_render/template" \
  -H "Content-Type: application/json" \
  -u "rs-admin-user:rs-password" \
  -d '{
    "id": "dor_search_template",
    "params": {
      "query": {"match_all": {}},
      "size": 10
    }
  }'
```

---

## Customization

### Change Template ID

```bash
export VITE_SEARCH_TEMPLATE_ID="my_custom_template"
```

### Disable Search Templates

```bash
export VITE_USE_SEARCH_TEMPLATE="false"
```

### Use Different Endpoint

```bash
export VITE_CUSTOM_SEARCH_ENDPOINT="/_search"  # Back to regular search
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Template not found (404) | Create template with `./create-search-template.sh` |
| Still using old endpoint | Restart dev server: `npm run dev` |
| Authentication error (401) | Check credentials in `.env` |
| No results | Test template manually with curl |
| Template errors | Use `/_render/template` to debug |

---

## Environment Variable Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_REACTIVESEARCH_URL` | - | ReactiveSearch server URL |
| `VITE_REACTIVESEARCH_CREDENTIALS` | - | Username:password for auth |
| `VITE_CUSTOM_SEARCH_ENDPOINT` | `/_search/template` | Search endpoint path |
| `VITE_SEARCH_TEMPLATE_ID` | `dor_search_template` | Template name/ID |
| `VITE_USE_SEARCH_TEMPLATE` | `true` | Enable/disable templates |

---

## Files Created/Modified

✅ `/src/apps/RsDorDcApp/utils/constants.js` - Added template configuration  
✅ `/src/apps/RsDorDcApp/index.jsx` - Added template transformation  
✅ `create-search-template.sh` - Script to create template  
✅ `docs/search-template-configuration.md` - Complete documentation  
✅ `docs/search-template-quick-start.md` - This file  

---

## Next Steps

1. ✅ Run `./create-search-template.sh` to create template on server
2. ✅ Test template with curl commands above
3. ✅ Start app with `npm run dev`
4. ✅ Verify in browser console that `/_search/template` is being used
5. ✅ Test search functionality in the app

---

## Need More Info?

- **Complete Guide**: See `docs/search-template-configuration.md`
- **Custom Endpoints**: See `docs/custom-endpoint-configuration.md`
- **OpenSearch Docs**: https://opensearch.org/docs/latest/search-plugins/search-template/

---

**You're all set!** 🚀

