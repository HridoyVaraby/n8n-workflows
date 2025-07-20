# Troubleshooting Guide - Blog Automation Workflow

## Issue 1: Unsplash "query is missing, query is empty" Error

### Problem
The Unsplash API node shows "Bad request - please check your parameters [item 0]" with "query is missing, query is empty".

### Root Cause
The expression `{{ $json.title }}` was trying to access data from Google Sheets, but the data structure wasn't matching expectations.

### Solution Applied
1. **Added Data Normalization Node**: Added "Normalize Sheet Data" node after Google Sheets to ensure consistent field names
2. **Fixed Expression**: Changed from `{{ $json.Title || $json.title }}` to `{{ $json.title }}` after normalization
3. **Fallback Value**: Added fallback to 'blog' if title is empty: `{{ ($json.title || 'blog').replace(/[^a-zA-Z0-9\\s]/g, '').trim() }}`

### How to Test
1. Run just the "Get Blog Titles" and "Normalize Sheet Data" nodes
2. Check the output - you should see `title` and `keywords` fields
3. Then test the Unsplash node - the query should now work

## Issue 2: Google Sheets Data Structure

### Problem
Google Sheets returns data with column headers as field names, but the structure can vary.

### Solution
The new "Normalize Sheet Data" node handles multiple possible field names:
- `Title` or `title` or column `A` for the blog title
- `Keywords` or `keywords` or column `B` for keywords

### Code in Normalize Node
```javascript
// Handle different possible field names from Google Sheets
const title = data.Title || data.title || data.A || '';
const keywords = data.Keywords || data.keywords || data.B || '';
```

## Quick Fixes for Common Issues

### 1. Unsplash API Key
Make sure your API key is correctly formatted:
```
Client-ID YOUR_ACTUAL_API_KEY_HERE
```
**Not**: `YOUR_UNSPLASH_ACCESS_KEY`

### 2. Google Sheets Range
If your data is in different columns, update the range in Google Sheets node:
- Current: `A:B` (Title in A, Keywords in B)
- Adjust as needed: `A:C`, `B:D`, etc.

### 3. Test Individual Nodes
Test nodes one by one:
1. **Google Sheets**: Should return your blog titles
2. **Normalize Data**: Should show clean `title` and `keywords` fields
3. **Unsplash Search**: Should return image results
4. **Content Generation**: Should create blog content

### 4. Debug Data Structure
Add this temporary Code node after any node to see the data structure:
```javascript
// Debug: Log the data structure
console.log('Data structure:', JSON.stringify($json, null, 2));
return [$input.first()];
```

## Validation Steps

### Before Running Full Workflow:
1. ✅ Google Sheets credential configured
2. ✅ Unsplash API key added (with "Client-ID " prefix)
3. ✅ Groq API credential configured  
4. ✅ WordPress API credential configured
5. ✅ Google Sheet has data in "Title" column (Column A)

### Test Sequence:
1. **Test Google Sheets**: Run first 2 nodes only
2. **Test Unsplash**: Run through "Search Unsplash Images" node
3. **Test AI Generation**: Run through "Generate Blog Content" node
4. **Test Full Pipeline**: Run complete workflow

## Error Messages & Solutions

### "query is missing, query is empty"
- **Fix**: Check the Unsplash query expression
- **Current Fix**: Uses normalized `$json.title` field

### "Bad request" from Unsplash
- **Check**: API key format (must include "Client-ID ")
- **Check**: Query parameter is not empty

### "Expression error" in AI nodes
- **Fix**: Ensure data flows correctly from Google Sheets
- **Check**: Field names match (`title`, `keywords`)

### WordPress publishing errors
- **Check**: WordPress API credentials
- **Check**: User permissions for publishing
- **Check**: Featured image upload permissions

## Updated Workflow Structure

```
Google Sheets → Normalize Data → AI Content → Unsplash → WordPress
     ↓              ↓              ↓           ↓          ↓
   Raw data    Clean fields   Blog content  Images   Published
```

The key improvement is the **Normalize Data** node that ensures consistent field names throughout the workflow.