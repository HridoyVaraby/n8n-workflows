# Automated Blog Creation Workflow - Setup Guide

## Overview

This n8n workflow automates the complete blog creation process, running twice daily to generate SEO-optimized content with relevant images and publish to WordPress.

## Workflow Components

### 1. **Daily Blog Schedule** (Cron Trigger)

- Runs twice daily at 8:00 AM and 6:00 PM
- Automatically triggers the entire workflow

### 2. **Get Blog Titles** (Google Sheets)

- Reads blog post titles and keywords from a Google Sheet
- Expected format: Column A = Title, Column B = Keywords (optional)

### 3. **Groq AI Model + Generate Blog Content** (LangChain)

- Uses Groq's Llama3-8b-8192 model for content generation
- Creates 800-1200 word SEO-optimized blog posts
- Includes proper headings, meta descriptions, and call-to-actions

### 4. **Search Unsplash Images** (HTTP Request)

- Searches Unsplash API for relevant landscape images
- Uses blog title as search query

### 5. **Select Best Image** (Code Node)

- Processes Unsplash results and selects the best image
- Includes fallback to default image if no results

### 6. **Download Featured Image** (HTTP Request)

- Downloads the selected image as binary data

### 7. **Format WordPress Content** (Code Node)

- Formats AI-generated content for WordPress
- Converts markdown to HTML
- Adds image credits and meta information

### 8. **Publish to WordPress** (WordPress API)

- Creates and publishes the complete blog post
- Includes featured image, categories, and tags

## Required Credentials

### 1. Google Sheets OAuth2 API

```json
{
  "id": "google-sheets-credential",
  "name": "Google Sheets OAuth2"
}
```

### 2. Groq API

```json
{
  "id": "groq-credential", 
  "name": "Groq API"
}
```

- Get your API key from: <https://console.groq.com/>

### 3. WordPress API

```json
{
  "id": "wordpress-credential",
  "name": "WordPress API"
}
```

- Requires WordPress REST API access
- Use Application Password or JWT authentication

## Configuration Steps

### 1. Google Sheets Setup

1. Create a Google Sheet with blog topics
2. Format: Column A = "Title", Column B = "Keywords" (optional)
3. Replace `YOUR_GOOGLE_SHEET_ID` in the workflow
4. Update `sheetName` if different from "Blog Topics"

### 2. Unsplash API Setup

1. Get free API key from: <https://unsplash.com/developers>
2. Replace `YOUR_UNSPLASH_ACCESS_KEY` in the workflow
3. Respect Unsplash API rate limits (50 requests/hour for free)

### 3. WordPress Configuration

1. Ensure WordPress REST API is enabled
2. Create application password or configure JWT
3. Update WordPress site URL in credentials
4. Adjust category IDs in the "Format WordPress Content" node

### 4. Scheduling Customization

To change the schedule, modify the Cron trigger:

- Current: 8:00 AM and 6:00 PM daily
- Customize `hour` values in the `triggerTimes` array

## Google Sheets Format Example

| Title | Keywords |
|-------|----------|
| "10 Best Productivity Tips for Remote Workers" | "productivity, remote work, tips" |
| "Complete Guide to Digital Marketing in 2024" | "digital marketing, SEO, social media" |
| "How to Build a Successful E-commerce Store" | "ecommerce, online store, business" |

## Error Handling & Monitoring

The workflow includes:

- Fallback images if Unsplash search fails
- Error handling in Code nodes
- Validation of required data fields

## Customization Options

### Content Generation

- Modify the AI prompt in "Generate Blog Content" node
- Adjust word count requirements (currently 800-1200 words)
- Change tone and style preferences

### Image Selection

- Modify Unsplash search parameters (orientation, per_page)
- Add Pexels API as alternative image source
- Customize image processing logic

### WordPress Publishing

- Adjust post status (draft vs publish)
- Modify categories and tags logic
- Add custom fields or meta data

## Testing

1. **Manual Testing**: Execute workflow manually first
2. **Single Post**: Test with one blog title initially
3. **Credentials**: Verify all API connections work
4. **Content Quality**: Review generated content before automation

## Monitoring & Maintenance

- Monitor n8n execution logs
- Check API rate limits (Unsplash: 50/hour, Groq: varies by plan)
- Review published content quality regularly
- Update Google Sheets with fresh topics

## Troubleshooting

### Common Issues

1. **Google Sheets Access**: Ensure proper OAuth2 setup
2. **Groq API Limits**: Monitor usage and upgrade plan if needed
3. **WordPress Permissions**: Verify API user has publishing rights
4. **Image Download Failures**: Check Unsplash API key and limits

### Debug Steps

1. Check n8n execution logs
2. Test individual nodes manually
3. Verify API credentials and permissions
4. Monitor external service status pages

## Performance Optimization

- **Batch Processing**: Process multiple titles in single execution
- **Caching**: Store frequently used images locally
- **Rate Limiting**: Add delays between API calls if needed
- **Content Scheduling**: Spread posts throughout the day

This workflow provides a complete hands-free blog publishing pipeline that maintains quality while automating the entire content creation process.
