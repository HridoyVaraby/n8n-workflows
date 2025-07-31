# Automated Blog Post Creation - Setup Guide

## Overview
This n8n workflow automates the entire blog creation process by running every 6 hours to:
1. Select a random blog title from Google Sheets
2. Generate comprehensive content using Google Gemini AI
3. Find and download a related image from Unsplash
4. Create a WordPress blog post with the generated content and featured image
5. Mark the title as "published" in the Google Sheet

## Workflow Features
- **Automated scheduling** - Runs every 6 hours
- **AI-powered content generation** - Uses Google Gemini for high-quality blog posts
- **Smart image selection** - Finds relevant images from Unsplash
- **WordPress integration** - Automatically publishes posts as drafts
- **Progress tracking** - Updates Google Sheets to avoid duplicate posts
- **Error handling** - Continues operation even if individual steps fail

## Prerequisites
1. **n8n instance** (self-hosted or cloud)
2. **Google Sheets** with blog titles
3. **Google Gemini API** access
4. **Unsplash API** access (free tier available)
5. **WordPress site** with REST API enabled
6. **Required credentials** configured in n8n

## Setup Instructions

### Step 1: Prepare Google Sheets
1. Create a new Google Sheet with the following columns:
   - **Column A (Title)**: Blog post titles
   - **Column B (Category)**: Blog categories (optional)
   - **Column C (Status)**: Publication status (leave empty initially)

Example sheet structure:
```
Title                           | Category    | Status
10 Tips for Better Sleep       | Health      |
How to Start a Garden          | Lifestyle   |
Best Productivity Apps         | Technology  |
```

### Step 2: Import the Workflow
1. Copy the contents of `blog-automation-workflow.json`
2. In n8n, go to **Workflows** → **Import from File/URL**
3. Paste the JSON content and click **Import**

### Step 3: Configure Environment Variables
In n8n, go to **Settings** → **Environment Variables** and add:

```
GOOGLE_SHEET_ID=your_google_sheet_id_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_AUTH_TOKEN=base64_encoded_username:password
```

### Step 4: Set Up Google Sheets Credentials
1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Google Sheets OAuth2 API**
3. Configure your Google OAuth2 credentials
4. Save with name: `Google Sheets OAuth2 API`

### Step 5: Set Up Google Gemini API Credentials
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini
3. In n8n, add **Google Gemini API** credential
4. Enter your API key
5. Save with name: `Google Gemini API`

### Step 6: Set Up Unsplash API Access
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key
4. Add it to the `UNSPLASH_ACCESS_KEY` environment variable

### Step 7: Configure WordPress API Credentials
1. In n8n, add **WordPress API** credential
2. Enter your WordPress site URL
3. Enter your WordPress username and password
4. Save with name: `WordPress API`

For the auth token environment variable:
```bash
# Create base64 encoded auth token
echo -n "username:password" | base64
```

### Step 8: Test the Workflow
1. Click **Execute Workflow** to test manually
2. Check each node's output for proper data flow
3. Verify that a blog post is created in WordPress
4. Confirm the Google Sheet is updated with "published" status

### Step 9: Activate the Workflow
1. Click the **Active** toggle to enable automatic execution
2. The workflow will now run every 6 hours

## Workflow Logic

### 1. Schedule Trigger (Every 6 Hours)
- Automatically triggers the workflow every 6 hours
- Can be customized for different intervals

### 2. Get Blog Titles from Sheet
- Reads all data from the Google Sheet
- Retrieves titles, categories, and status information

### 3. Select Random Title
- Filters out already published titles
- Randomly selects an available title
- Prepares data for content generation

### 4. Generate Blog Content with Gemini
- Uses Google Gemini AI to create comprehensive blog posts
- Generates 800-1200 word articles
- Includes proper HTML formatting and SEO optimization

### 5. Search Unsplash for Image
- Searches for relevant images based on blog keywords
- Filters for landscape orientation
- Returns multiple options for selection

### 6. Process Blog Data
- Combines all data (title, content, image)
- Selects the best image from Unsplash results
- Prepares data for WordPress publication

### 7. Download & Upload Featured Image
- Downloads the selected image from Unsplash
- Uploads it to WordPress media library
- Associates it with the blog post

### 8. Create WordPress Post
- Creates a new blog post as a draft
- Includes generated content and featured image
- Sets appropriate categories and metadata

### 9. Mark as Published in Sheet
- Updates the Google Sheet with "published" status
- Prevents the same title from being used again

## Customization Options

### Change Schedule Frequency
In the **Every 6 Hours Trigger** node:
```json
{
  "rule": {
    "interval": [
      {
        "field": "hours",
        "hoursInterval": 12  // Change to 12 hours
      }
    ]
  }
}
```

### Modify Content Generation Prompt
In the **Generate Blog Content with Gemini** node, customize the prompt:
- Adjust word count requirements
- Change tone and style
- Add specific formatting requirements
- Include additional instructions

### Customize Image Search
In the **Search Unsplash for Image** node:
- Change `per_page` for more image options
- Modify `orientation` (landscape, portrait, squarish)
- Add additional search parameters

### WordPress Post Settings
In the **Create WordPress Post** node:
- Change post status (draft, publish, private)
- Modify categories and tags
- Adjust post metadata

## Google Sheets Structure

### Required Columns
- **Column A**: Blog post titles (required)
- **Column B**: Categories (optional, defaults to "General")
- **Column C**: Status tracking (managed by workflow)

### Optional Enhancements
Add these columns for more control:
- **Column D**: Keywords for image search
- **Column E**: Target word count
- **Column F**: Specific instructions for AI

## Troubleshooting

### Common Issues

1. **No Available Titles**
   - Ensure your Google Sheet has unpublished titles
   - Check that Column C doesn't contain "published" for all rows

2. **Gemini API Errors**
   - Verify your API key is correct
   - Check API quotas and limits
   - Ensure the model ID is valid

3. **Unsplash API Issues**
   - Confirm your access key is valid
   - Check API rate limits
   - Verify search terms are appropriate

4. **WordPress Connection Problems**
   - Ensure REST API is enabled
   - Check authentication credentials
   - Verify site URL is correct

5. **Image Upload Failures**
   - Check WordPress media upload permissions
   - Verify image file formats are supported
   - Ensure sufficient storage space

### Performance Tips
- Monitor API usage and quotas
- Adjust schedule frequency based on content needs
- Use specific keywords for better image results
- Regularly review and update blog titles in the sheet

## Security Considerations
- Store all API keys as environment variables
- Use strong WordPress credentials
- Regularly rotate API keys
- Monitor workflow execution logs
- Keep n8n instance secure and updated

## Content Quality Tips
- Write clear, specific blog titles in your sheet
- Include relevant categories for better organization
- Add keywords column for better image matching
- Review generated content before publishing
- Monitor blog performance and adjust prompts accordingly

## Support
- Test thoroughly before activating
- Monitor the first few executions
- Keep backups of your Google Sheets
- Document any customizations you make
- Review WordPress posts regularly for quality