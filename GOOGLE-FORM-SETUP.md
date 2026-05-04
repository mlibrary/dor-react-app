# Google Form Feedback Integration

## Overview
The search application includes a feedback button that links to a Google Form with prepopulated fields:
- **Identifier**: A unique UUID generated for each feedback submission
- **Index Version**: The version number of the search implementation (e.g., "1")
- **Search Query**: The user's current search query (including active filters)
- **Top 5 Results**: The titles of the top 5 search results

## Finding Google Form Entry IDs

To properly prepopulate the Google Form fields, you need to find the correct entry IDs for each field. Follow these steps:

### Step 1: Open the Google Form in Preview Mode
1. Go to your Google Form in edit mode: https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/edit
2. Click the **Preview** button (eye icon) in the top right

### Step 2: Inspect the Form Fields
1. Right-click on the first field (Identifier) and select **Inspect Element**
2. Look for an input element with a name attribute like `entry.1234567890`
3. The number after `entry.` is your entry ID

### Step 3: Find All Entry IDs
Repeat Step 2 for each field in your form:
- **Identifier field** → entry ID (e.g., `entry.111222333`)
- **Index Version field** → entry ID (e.g., `entry.123456789`)
- **Search Query field** → entry ID (e.g., `entry.987654321`)
- **Top 5 Results field** → entry ID (e.g., `entry.555666777`)

### Step 4: Update the Code
Once you have the correct entry IDs, update them in `/src/apps/RsDorDcApp/index.jsx` around lines 71, 74, 107, and 123:

```javascript
const generateFeedbackFormUrl = useCallback((searchQueryOverride) => {
    const baseUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url';
    
    const params = new URLSearchParams();
    
    // Identifier - generate a unique UUID for this feedback submission
    const identifier = crypto.randomUUID();
    params.append('entry.YOUR_IDENTIFIER_ENTRY_ID', identifier);
    
    // Index Version
    params.append('entry.YOUR_INDEX_VERSION_ENTRY_ID', '1');
    
    // Search query with filters
    const queryValue = searchQueryOverride !== undefined ? searchQueryOverride : searchQueryRef.current;
    let fullQuery = queryValue || '';
    
    // Add active filters to the query (see actual implementation for full filter logic)
    if (fullQuery) {
        params.append('entry.YOUR_SEARCH_QUERY_ENTRY_ID', fullQuery);
    }
    
    // Top 5 results
    const resultsData = latestDataRef.current;
    if (resultsData && resultsData.length > 0) {
        const top5Results = resultsData.slice(0, 5).map((item, index) => {
            let title = 'Untitled';
            if (item.dc_ti) {
                const titleRaw = Array.isArray(item.dc_ti) ? item.dc_ti.join(', ') : item.dc_ti;
                title = titleRaw.replace(/<[^>]*>/g, '');
            }
            return `${index + 1}. ${title}`;
        }).join('\n');
        
        params.append('entry.YOUR_TOP_5_RESULTS_ENTRY_ID', top5Results);
    }
    
    return `${baseUrl}&${params.toString()}`;
}, [filters]);
```

## Testing the Integration

1. Perform a search in the application
2. Click the "Provide Feedback on Search Results" button
3. Verify that the Google Form opens with the fields prepopulated:
   - Identifier should show a unique UUID (e.g., "abc-123-def-456")
   - Index Version should show "1"
   - Search Query should show your search terms (with filters if active)
   - Top 5 Results should show the numbered list of result titles

## Troubleshooting

### Fields are not prepopulated
- Double-check that you have the correct entry IDs from the form
- Ensure the form fields are set to accept prefilled responses (check form settings)
- Verify the field types match (text for text fields, paragraph for multi-line text)

### URL is too long
If the URL becomes too long (especially with large result sets), you may need to:
- Truncate the result titles
- Limit the amount of data being passed
- Consider using a different approach (e.g., storing data and passing an ID)

## Example

Here's what a prepopulated URL might look like:
```
https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/viewform?entry.123456789=dor-dc&entry.987654321=michigan+history&entry.555666777=1.+History+of+Michigan%0A2.+Michigan+Historical+Collections
```

