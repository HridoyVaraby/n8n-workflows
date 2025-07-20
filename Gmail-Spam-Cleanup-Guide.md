# Gmail Spam Folder Cleanup - Setup Guide

## Overview
This n8n workflow automatically cleans your Gmail spam folder by permanently deleting all messages in it once per day. It's a simple, hands-free solution to keep your spam folder empty and your email account tidy.

## Workflow Features
- **Daily automated cleanup** at 3 AM (configurable)
- **Targets only the Spam folder** using Gmail's SPAM label
- **Permanently deletes** all spam messages
- **Error handling** to ensure workflow continues even if individual emails fail
- **Processes all spam emails** in a single run

## Prerequisites
1. **n8n instance** (self-hosted or cloud)
2. **Gmail account** with API access enabled
3. **Google OAuth2 credentials** configured in n8n

## Setup Instructions

### Step 1: Import the Workflow
1. Copy the contents of `gmail-spam-cleanup-workflow.json`
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

### Step 3: Adjust Schedule (Optional)
1. Open the **Daily Cleanup Schedule** node
2. Modify the trigger time (default: 3 AM daily)
3. Available options:
   - Change hour: Set a different hour (0-23)
   - Change frequency: Switch to weekly or custom schedule

### Step 4: Test the Workflow
1. Click **Execute Workflow** to test manually
2. Check the execution log to see which emails were processed
3. Verify in your Gmail that spam messages were deleted

### Step 5: Activate the Workflow
1. Click the **Active** toggle to enable automatic execution
2. The workflow will now run daily at the scheduled time

## Workflow Logic

### 1. Schedule Trigger
- Runs daily at 3 AM
- Can be customized for different times/frequencies

### 2. Fetch Spam Messages
- Gets all messages with the SPAM label
- Uses Gmail's API to efficiently retrieve spam messages

### 3. Delete Spam Messages
- Permanently deletes each spam message
- Processes messages one by one

## Customization Options

### Change Schedule Frequency
In the **Daily Cleanup Schedule** node, you can modify:
- **Daily**: Set specific hour and minute
- **Weekly**: Set specific day of week
- **Monthly**: Set specific day of month
- **Custom**: Set custom interval

Example for weekly cleanup on Sundays at 4 AM:
```json
{
  "rule": {
    "interval": [
      {
        "field": "weeks",
        "triggerAtDay": 0,
        "triggerAtHour": 4,
        "triggerAtMinute": 0
      }
    ]
  }
}
```

### Add Notification on Completion
You can add a notification node (like Slack or Email) to be informed when the cleanup is complete:

1. Add a **Function** node after the Delete operation
2. Count the deleted messages
3. Connect to your notification node of choice

### Limit Number of Messages
If you want to limit the number of messages processed in each run:

1. In the **Fetch Spam Messages** node, change:
   - `"returnAll": false`
   - Add `"limit": 100` (or your desired number)

## Safety Features

### Error Handling
- All Gmail operations have `onError: "continueRegularOutput"`
- Workflow continues even if individual emails fail
- Failed operations are logged but don't stop the process

### Focused Scope
- Only processes emails with the SPAM label
- Does not affect any other emails in your account

## Troubleshooting

### Common Issues
1. **OAuth2 Authentication Failed**
   - Re-authorize Gmail credentials
   - Check Google API quotas

2. **No Emails Processed**
   - Verify your spam folder actually contains messages
   - Check execution logs for any API errors

3. **Workflow Not Running**
   - Confirm workflow is activated
   - Check cron trigger configuration
   - Review n8n execution logs

### Performance Tips
- For very large spam folders, consider adding a limit
- Run more frequently if you receive a high volume of spam
- Monitor execution times and adjust as needed

## Security Considerations
- Use OAuth2 (recommended) over service accounts
- Keep n8n instance secure and updated
- Review execution logs periodically to ensure proper operation