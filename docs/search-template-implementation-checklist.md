# ✅ Implementation Checklist: Search Template Configuration

## Configuration Status

### ✅ COMPLETED - Code Configuration
- [x] `constants.js` updated with `customEndpoint: '/_search/template'`
- [x] `constants.js` updated with `searchTemplate` configuration object
- [x] `index.jsx` updated with `transformRequest` function
- [x] Request body transformation for template format implemented
- [x] Development logging added
- [x] `.env` file updated with template variables
- [x] Helper script created: `create-search-template.sh`
- [x] Documentation created

### ⏳ PENDING - Server Setup
- [ ] Create search template on OpenSearch server
- [ ] Verify template creation
- [ ] Test template with sample query

---

## To Complete the Setup

### 1. Create the Search Template on Server

Run the script (easiest method):
```bash
./create-search-template.sh
```

**Expected Output:**
```
Creating search template on OpenSearch...
URL: https://reactivesearch.discovery.dor.lib.umich.edu
Template ID: dor_search_template

{"acknowledged":true}

✅ Template created: dor_search_template
```

### 2. Verify Template Was Created

```bash
curl -X GET "https://reactivesearch.discovery.dor.lib.umich.edu/_scripts/dor_search_template" \
  -u "rs-admin-user:rs-password"
```

**Expected Output:**
```json
{
  "found": true,
  "_id": "dor_search_template",
  "script": {
    "lang": "mustache",
    "source": { ... }
  }
}
```

### 3. Test Template Execution

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

**Expected Output:**
```json
{
  "took": 5,
  "hits": {
    "total": { "value": 100 },
    "hits": [ ... ]
  }
}
```

### 4. Start Your Application

```bash
npm run dev
```

### 5. Verify in Browser

**Open DevTools Console (F12) and look for:**
```
ReactiveSearch Request URL: https://reactivesearch.discovery.dor.lib.umich.edu/dor-dc/_search/template
Original Body: { query: {...}, size: 10, from: 0 }
Transformed Body: { id: "dor_search_template", params: {...} }
```

**Check Network Tab:**
- Request URL should end with `/_search/template`
- Request payload should have `id` and `params` fields

### 6. Test Search Functionality

- [ ] Perform a text search
- [ ] Verify results are returned
- [ ] Test filters (collection, subject, date, coverage)
- [ ] Test pagination
- [ ] Check that everything works as before

---

## Configuration Summary

### Environment Variables (.env)
```env
VITE_REACTIVESEARCH_URL="https://reactivesearch.discovery.dor.lib.umich.edu"
VITE_REACTIVESEARCH_CREDENTIALS="rs-admin-user:rs-password"
VITE_CUSTOM_SEARCH_ENDPOINT="/_search/template"
VITE_SEARCH_TEMPLATE_ID="dor_search_template"
VITE_USE_SEARCH_TEMPLATE="true"
```

### Constants (constants.js)
```javascript
customEndpoint: '/_search/template'
searchTemplate: {
    id: 'dor_search_template',
    useTemplate: true
}
```

### Request Flow
```
SearchBox → Query → transformRequest → Template Format → OpenSearch → Results
```

---

## Troubleshooting

### If template creation fails:

**Error: Connection refused**
- Check that the URL is correct
- Verify server is running
- Check network connectivity

**Error: 401 Unauthorized**
- Verify credentials in `.env`
- Test credentials with a simple curl command

**Error: 403 Forbidden**
- Check user has permission to create scripts
- Verify security settings on OpenSearch

### If app doesn't use template:

**Still seeing `/_reactivesearch.v3` in requests**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache and reload
- Check `.env` file has correct values
- Verify `VITE_USE_SEARCH_TEMPLATE="true"`

**No transformation logs in console**
- Ensure running in dev mode: `npm run dev` (not `npm run build`)
- Open browser console (F12)
- Check console filters aren't hiding logs

### If search doesn't return results:

**Template parameter mismatch**
- Check template source expects `query`, `size`, `from`, `aggs` params
- Use `/_render/template` to debug parameter rendering
- Verify template ID matches configuration

**Template not found (404)**
- Run `./create-search-template.sh` again
- Verify template exists: `GET /_scripts/dor_search_template`
- Check template ID in `.env` matches created template

---

## Quick Reference

| Action | Command |
|--------|---------|
| Create template | `./create-search-template.sh` |
| Verify template | `curl -X GET ".../_scripts/dor_search_template" -u "..."` |
| Test template | `curl -X POST ".../_search/template" -d '{...}'` |
| Start app | `npm run dev` |
| View logs | Open browser DevTools → Console |
| Check requests | Open browser DevTools → Network |

---

## Success Criteria

✅ Template created on server  
✅ Template verified with GET request  
✅ Template tested with sample query  
✅ App starts without errors  
✅ Console shows template endpoint URL  
✅ Network tab shows `/_search/template` requests  
✅ Request payload has `id` and `params`  
✅ Search returns results  
✅ Filters work correctly  
✅ Pagination works  

---

## Documentation Files

📖 Quick Start: `docs/search-template-quick-start.md`  
📖 Complete Guide: `docs/search-template-configuration.md`  
📖 Custom Endpoints: `docs/custom-endpoint-configuration.md`  
📖 Examples: `docs/custom-endpoint-examples.md`  

---

## Support

If you encounter issues:

1. Check this checklist for common solutions
2. Review documentation in `docs/` folder
3. Check OpenSearch logs for server-side errors
4. Test template separately with curl
5. Verify environment variables are loaded

---

**Status:** Configuration complete, pending server-side template creation.  
**Next Step:** Run `./create-search-template.sh` 🚀

