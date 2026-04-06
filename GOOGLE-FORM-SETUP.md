# Google Form Feedback Integration

## Overview
The search application includes a feedback button that links to a Google Form with prepopulated fields:
- **Index Version**: The search index being used (e.g., "dor-dc")
- **Search Query**: The user's current search query
- **Top 5 Results**: The titles of the top 5 search results

## Finding Google Form Entry IDs

To properly prepopulate the Google Form fields, you need to find the correct entry IDs for each field. Follow these steps:

### Step 1: Open the Google Form in Preview Mode
1. Go to your Google Form in edit mode: https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/edit
2. Click the **Preview** button (eye icon) in the top right

### Step 2: Inspect the Form Fields
1. Right-click on the first field (Index Version) and select **Inspect Element**
2. Look for an input element with a name attribute like `entry.1234567890`
3. The number after `entry.` is your entry ID

### Step 3: Find All Entry IDs
Repeat Step 2 for each field in your form:
- **Index Version field** → entry ID (e.g., `entry.123456789`)
- **Search Query field** → entry ID (e.g., `entry.987654321`)
- **Top 5 Results field** → entry ID (e.g., `entry.555666777`)

### Step 4: Update the Code
Once you have the correct entry IDs, update them in `/src/apps/RsDorDcApp/index.jsx`:

```javascript
const generateFeedbackFormUrl = () => {
    const baseUrl = 'https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/viewform';
    
    const params = new URLSearchParams();
    
    // Replace these with your actual entry IDs:
    params.append('entry.YOUR_INDEX_VERSION_ENTRY_ID', 'dor-dc');
    
    if (searchQuery) {
        params.append('entry.YOUR_SEARCH_QUERY_ENTRY_ID', searchQuery);
    }
    
    if (searchResults.length > 0) {
        const top5Results = searchResults.slice(0, 5).map((item, index) => {
            const title = item.dc_ti ? item.dc_ti.replace(/<[^>]*>/g, '') : 'Untitled';
            return `${index + 1}. ${title}`;
        }).join('\n');
        
        params.append('entry.YOUR_TOP_5_RESULTS_ENTRY_ID', top5Results);
    }
    
    return `${baseUrl}?${params.toString()}`;
};
```

## Testing the Integration

1. Perform a search in the application
2. Click the "Provide Feedback on Search Results" button
3. Verify that the Google Form opens with the fields prepopulated:
   - Index Version should show "dor-dc"
   - Search Query should show your search terms
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

