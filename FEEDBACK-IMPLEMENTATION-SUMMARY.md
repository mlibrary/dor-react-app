# Google Form Feedback Integration - Implementation Summary

## What Was Implemented

A feedback button has been added to the RsDorDcApp search interface that links to a Google Form with prepopulated fields containing:
1. **Index Version**: "dor-dc" (the search index name)
2. **Search Query**: The user's current search text
3. **Top 5 Results**: A numbered list of the top 5 search result titles

## Changes Made

### File: `/src/apps/RsDorDcApp/index.jsx`

#### 1. Added Imports
- `useRef` from React (for tracking search results without re-renders)
- `Button` from Ant Design (for the feedback button)
- `FormOutlined` icon from Ant Design Icons

#### 2. Added State Management
```javascript
const [searchQuery, setSearchQuery] = useState('');
const latestDataRef = useRef([]);
```

#### 3. Added Google Form URL Generator
```javascript
const generateFeedbackFormUrl = () => {
    // Creates URL with prepopulated fields
    // Uses placeholder entry IDs that need to be replaced
}
```

#### 4. Updated SearchBox Component
- Added `onChange` handler to capture search query:
```javascript
onChange={(value) => setSearchQuery(value || '')}
```

#### 5. Added Feedback Button
- Positioned below the search box
- Opens Google Form in new tab with prepopulated data
```javascript
<Button
    type="primary"
    icon={<FormOutlined />}
    href={generateFeedbackFormUrl()}
    target="_blank"
    rel="noopener noreferrer"
>
    Provide Feedback on Search Results
</Button>
```

#### 6. Updated ReactiveList
- Captures search results data using ref to avoid re-render issues:
```javascript
render={({data}) => {
    latestDataRef.current = data || [];
    // ... rest of render
}}
```

## Next Steps: Getting the Correct Entry IDs

⚠️ **IMPORTANT**: The current implementation uses placeholder entry IDs that need to be replaced with actual values from your Google Form.

### How to Find Entry IDs

1. **Open your Google Form in preview mode:**
   - Go to: https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/edit
   - Click the preview button (eye icon)

2. **Inspect each form field:**
   - Right-click on the "Index Version" field → Inspect Element
   - Find the input element with `name="entry.XXXXXXXXX"`
   - The number after `entry.` is your entry ID
   - Repeat for "Search Query" and "Top 5 Results" fields

3. **Update the code in `/src/apps/RsDorDcApp/index.jsx`:**
   Replace these three lines in the `generateFeedbackFormUrl()` function:
   ```javascript
   // Line ~54: Index Version field
   params.append('entry.123456789', 'dor-dc');  // Replace 123456789
   
   // Line ~58: Search Query field  
   params.append('entry.987654321', searchQuery);  // Replace 987654321
   
   // Line ~69: Top 5 Results field
   params.append('entry.555666777', top5Results);  // Replace 555666777
   ```

For detailed instructions, see: **[GOOGLE-FORM-SETUP.md](./GOOGLE-FORM-SETUP.md)**

## Testing

Once you've updated the entry IDs:

1. Start the application
2. Perform a search (e.g., "Michigan history")
3. Click the "Provide Feedback on Search Results" button
4. Verify the Google Form opens with:
   - Index Version: "dor-dc"
   - Search Query: your search terms
   - Top 5 Results: numbered list of result titles

## Technical Details

### Why Use a Ref Instead of State?
The search results are captured using `useRef` rather than `useState` because:
- ReactiveList's `render` function is called frequently
- Using state would cause unnecessary re-renders
- The ref stores the latest data without triggering React's render cycle
- The data is only accessed when the button is clicked

### URL Encoding
- Search query and results are automatically URL-encoded by `URLSearchParams`
- HTML tags are stripped from result titles using regex: `item.dc_ti.replace(/<[^>]*>/g, '')`
- Results are formatted as a numbered list with newline separators

## Files Created/Modified

✅ **Modified:**
- `/src/apps/RsDorDcApp/index.jsx` - Added feedback functionality

✅ **Created:**
- `/GOOGLE-FORM-SETUP.md` - Detailed setup instructions
- `/FEEDBACK-IMPLEMENTATION-SUMMARY.md` - This file

## Status

🟡 **Partially Complete** - Implementation is done, but requires entry ID configuration to be fully functional.

The feedback button is visible and functional, but you must update the entry IDs for the form fields to be prepopulated correctly.

