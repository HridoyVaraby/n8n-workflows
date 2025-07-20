# Gmail Inbox Cleanup Automation - Setup Guide

## Overview
This n8n workflow automatically cleans your Gmail inbox daily by identifying and managing unwanted emails like spam and promotional messages. It runs on a schedule and uses intelligent filtering to keep your inbox focused.

## Workflow Features
- **Daily automated cleanup** at 9 AM
- **Smart filtering** based on subject keywords, sender patterns, and Gmail labels
- **Selective actions**: Deletes spam, archives promotional emails
- **Error handling** to ensure workflow continues even if individual emails fail
- **Processes up to 100 recent unread emails** per run

## Prerequisites
1. **n8n instance** (self-hosted or cloud)
2. **Gmail account** with API access enabled
3. **Google OAuth2 credentials** configured in n8n

## Setup Instructions

### Step 1: Import the Workflow
1. Copy the contents of `gmail-inbox-cleanup-workflow.json`
2. In n8n, go to **Workflows** → **Import from File/URL**
3. Paste the JSON content and click **Import**

### Step 2: Configure Gmail OAuth2 Credentials
1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Gmail OAuth2 API**
3. Fill in your Google OAuth2 credentials:
   - **Client ID**: Your Google OAuth2 client ID
   - **Client Secret**: Your Google OAuth2 client secret
4. Click **Connect my account** and authorize access
5. Save the credential with name: `Gmail OAuth2 account`

### Step 3: Customize Filtering Rules
The workflow includes smart filters that you can customize:

#### Current Spam Keywords (in Filter node):
```
unsubscribe|promotion|deal|offer|sale|discount|free|winner|congratulations|urgent|limited time|act now|click here|buy now
```

#### Current Promotional Sender Patterns:
```
noreply|no-reply|marketing|promo|newsletter|deals|offers|notifications
```

#### To Modify Filters:
1. Open the **Filter Unwanted Emails** node
2. Edit the conditions:
   - **spam-keywords**: Modify subject line patterns
   - **promotional-senders**: Modify sender email patterns
   - **promotional-labels**: Uses Gmail's CATEGORY_PROMOTIONS label (as array: `["CATEGORY_PROMOTIONS"]`)
   - **spam-labels**: Uses Gmail's SPAM label (as array: `["SPAM"]`)

> **Important**: When using array operations like "contains", make sure the right value is an array (e.g., `["SPAM"]`) not a string. The workflow uses "loose" type validation to help with type conversions.

### Step 4: Adjust Schedule (Optional)
1. Open the **Daily Cleanup Schedule** node
2. Modify the trigger time (default: 9 AM daily)
3. Available options:
   - Change hour: `"triggerAtHour": 14` (for 2 PM)
   - Change frequency: Add multiple intervals or change to weekly

### Step 5: Test the Workflow
1. Click **Execute Workflow** to test manually
2. Check the execution log for any errors
3. Verify that emails are being processed correctly
4. Monitor your Gmail to ensure expected behavior

### Step 6: Activate the Workflow
1. Click the **Active** toggle to enable automatic execution
2. The workflow will now run daily at the scheduled time

## Workflow Logic

### 1. Schedule Trigger
- Runs daily at 9 AM
- Can be customized for different times/frequencies

### 2. Fetch Recent Emails
- Gets up to 100 unread emails from the last day
- Only processes emails in the INBOX
- Uses Gmail's search query: `is:unread newer_than:1d`

### 3. Filter Unwanted Emails
- Identifies emails matching spam/promotional criteria
- Uses regex patterns for flexible matching
- Combines multiple conditions with OR logic

### 4. Check if Spam
- Separates true spam from promotional emails
- Routes to different actions based on email type

### 5. Actions
- **Spam emails**: Permanently deleted
- **Promotional emails**: Moved to trash (can be recovered)

## Customization Options

### Modify Email Query
In the **Fetch Recent Emails** node, change the `q` parameter:
- `is:unread newer_than:2d` - Process 2-day-old emails
- `is:unread -label:important` - Exclude important emails
- `category:promotions OR category:social` - Target specific categories

### Change Actions
- **Archive instead of delete**: Change operation to `addLabels` with `["INBOX"]` removed
- **Add custom labels**: Modify `labelIds` array
- **Move to specific folder**: Use `move` operation with folder ID

### Add More Conditions
In the **Filter** node, add new conditions:
```json
{
  "id": "large-attachments",
  "leftValue": "={{ $json.sizeEstimate }}",
  "rightValue": "5000000",
  "operator": {
    "type": "number",
    "operation": "gt"
  }
}
```

## Safety Features

### Error Handling
- All Gmail operations have `onError: "continueRegularOutput"`
- Workflow continues even if individual emails fail
- Failed operations are logged but don't stop the process

### Conservative Approach
- Only processes recent unread emails
- Promotional emails are moved to trash (recoverable)
- Only true spam is permanently deleted

### Monitoring
- Check execution history in n8n
- Monitor Gmail trash folder for incorrectly filtered emails
- Review and adjust filters based on results

## Troubleshooting

### Common Issues
1. **OAuth2 Authentication Failed**
   - Re-authorize Gmail credentials
   - Check Google API quotas

2. **No Emails Processed**
   - Verify Gmail query syntax
   - Check if emails match filter criteria
   - Ensure emails are unread and recent

3. **Workflow Not Running**
   - Confirm workflow is activated
   - Check schedule trigger configuration
   - Review n8n execution logs

4. **Type Errors in Filter Node**
   - Ensure array values are properly formatted as arrays (e.g., `["SPAM"]` not `"SPAM"`)
   - Keep "Convert types where required" (loose validation) enabled
   - For complex data structures, use expressions to ensure correct types

### Performance Tips
- Adjust `limit` in Fetch node based on email volume
- Modify `newer_than` parameter to process older emails
- Consider running multiple times per day for high-volume inboxes

## Security Considerations
- Use OAuth2 (recommended) over service accounts
- Regularly review and update filter patterns
- Monitor deleted emails to prevent false positives
- Keep n8n instance secure and updated

## Support
- Review n8n documentation for Gmail node details
- Test thoroughly before activating
- Start with conservative filters and gradually expand
- Monitor results and adjust as needed