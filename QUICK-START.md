# 🚀 Quick Start: Completing the Google Form Integration

## You're Almost Done! Just 3 Steps:

### Step 1️⃣: Get Your Form Entry IDs (2 minutes)

1. Open your Google Form: https://docs.google.com/forms/d/1E1Rptwkiafx6CZHh__NKWZeV_IWSjuXo44m6Rh7cZdQ/edit

2. Click the **Preview** button (eye icon 👁️) in the top right

3. Right-click on the **first field** (Index Version) → Select **"Inspect Element"**

4. Look for something like: `<input ... name="entry.1234567890" ...>`

5. Copy the number after `entry.` (e.g., `1234567890`)

6. Repeat for the other two fields:
   - **Search Query** field → Get its entry ID
   - **Top 5 Results** field → Get its entry ID

---

### Step 2️⃣: Update the Code (1 minute)

Open: `/src/apps/RsDorDcApp/index.jsx`

Find these 3 lines and replace the numbers:

**Line 54** - Index Version field:
```javascript
params.append('entry.123456789', 'dor-dc');
                     ^^^^^^^^^ 
                     Replace with your actual entry ID
```

**Line 58** - Search Query field:
```javascript
params.append('entry.987654321', searchQuery);
                     ^^^^^^^^^ 
                     Replace with your actual entry ID
```

**Line 69** - Top 5 Results field:
```javascript
params.append('entry.555666777', top5Results);
                     ^^^^^^^^^ 
                     Replace with your actual entry ID
```

---

### Step 3️⃣: Test It! (1 minute)

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Do a search:**
   - Type something in the search box
   - Wait for results

3. **Click the feedback button:**
   - It says: "Provide Feedback on Search Results"
   - Google Form should open in a new tab

4. **Verify the form is prepopulated:**
   - ✅ Index Version shows "dor-dc"
   - ✅ Search Query shows your search text
   - ✅ Top 5 Results shows numbered list of titles

---

## ✅ Done!

If all three fields are prepopulated correctly, you're all set! 🎉

---

## 🆘 Need Help?

**Fields not prepopulated?**
- Double-check you have the correct entry IDs
- Make sure you replaced ALL three placeholder IDs
- Ensure the form allows prefilled responses (check form settings)

**Can't find entry IDs?**
- Make sure you're in **preview mode** (not edit mode)
- Look for `<input>` or `<textarea>` elements
- The name attribute will have the entry ID

**Still stuck?**
See detailed instructions in: `GOOGLE-FORM-SETUP.md`

---

## Example

Here's what your updated code should look like (with your actual IDs):

```javascript
// Example with real entry IDs (yours will be different numbers)
params.append('entry.1847264905', 'dor-dc');           // Index Version
params.append('entry.2034859273', searchQuery);        // Search Query  
params.append('entry.1923847562', top5Results);        // Top 5 Results
```

