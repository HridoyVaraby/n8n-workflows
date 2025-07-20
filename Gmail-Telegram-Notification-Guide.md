# Gmail to Telegram Notification - Setup Guide

## Overview
This n8n workflow monitors your Gmail "Primary" inbox and sends instant Telegram notifications whenever a new email arrives. It extracts key details from the email—sender, subject, and a message preview—and delivers them directly to your Telegram account, ensuring you never miss important messages.

## Workflow Features
- **Real-time monitoring** of Gmail Primary inbox
- **Instant notifications** via Telegram
- **Smart filtering** to focus on Primary category emails only
- **Rich message format** with clickable link to open the email
- **Error handling** to ensure reliable operation
- **Clean message preview** with sender, subject, and snippet

## Prerequisites
1. **n8n instance** (self-hosted or cloud)
2. **Gmail account** with API access enabled
3. **Google OAuth2 credentials** configured in n8n
4. **Telegram Bot** created via BotFather
5. **Telegram Chat ID** for your account or group

## Setup Instructions

### Step 1: Import the Workflow
1. Copy the contents of `gmail-telegram-notification-workflow.json`
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

### Step 3: Set Up Telegram Bot
1. Open Telegram and search for **@BotFather**
2. Start a chat and send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the **API token** provided by BotFather

### Step 4: Configure Telegram API Credentials
1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Telegram API**
3. Enter your **Access Token** (the API token from BotFather)
4. Save the credential with name: `Telegram API`

### Step 5: Get Your Telegram Chat ID
1. Search for **@get_id_bot** in Telegram
2. Start a chat and the bot will reply with your Chat ID
3. If using a group, add @get_id_bot to the group and it will show the group's Chat ID

### Step 6: Set Environment Variable
1. In n8n, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key**: `TELEGRAM_CHAT_ID`
   - **Value**: Your Telegram Chat ID (e.g., `123456789`)
3. Save the changes

### Step 7: Test the Workflow
1. Click **Execute Workflow** to test manually
2. Send yourself a test email to your Gmail account
3. Check if you receive a notification in Telegram
4. Verify that the message format and content are correct

### Step 8: Activate the Workflow
1. Click the **Active** toggle to enable automatic execution
2. The workflow will now monitor your Gmail inbox and send notifications

## Workflow Logic

### 1. Gmail Trigger
- Monitors your Gmail Primary inbox for new messages
- Uses Gmail's category filter (`category:primary`)
- Only processes unread messages in the INBOX
- Polls at regular intervals (default: every minute)

### 2. Extract Email Details
- Extracts key information from the email:
  - Sender name/address
  - Email subject
  - Message snippet (preview)
  - Received time
  - Direct link to the email

### 3. Send Telegram Notification
- Formats a clean, readable message
- Includes all key email details
- Uses Markdown formatting for better readability
- Provides a direct link to open the email
- Disables web page previews to keep notifications clean

## Customization Options

### Change Email Filtering
In the **Monitor Gmail Primary Inbox** node, modify the `q` parameter:
- `category:primary` - Current setting for Primary inbox
- `category:social` - For social media notifications
- `category:promotions` - For promotional emails
- `category:updates` - For updates and notifications
- `category:forums` - For forum posts and mailing lists

You can also combine filters:
- `category:primary is:important` - Important Primary emails
- `category:primary from:example.com` - Primary emails from specific domain

### Customize Notification Format
In the **Send Telegram Notification** node, modify the `text` parameter to change the message format. The current format is:

```
🔔 *New Email Alert*

*From:* {{ $json.from }}
*Subject:* {{ $json.subject }}
*Received:* {{ $json.receivedTime }}

*Preview:*
{{ $json.snippet }}

[Open Email]({{ $json.emailLink }})
```

### Add More Information
To include additional email details, modify the **Extract Email Details** node:

```json
{
  "name": "hasAttachments",
  "value": "={{ $json.payload?.headers?.find(h => h.name === 'X-Attachment-Id') ? 'Yes' : 'No' }}"
}
```

Then update the Telegram message to include this information:
```
*Attachments:* {{ $json.hasAttachments }}
```

## Troubleshooting

### Common Issues
1. **No Notifications Received**
   - Verify your Telegram Bot is active
   - Check that you've started a conversation with your bot
   - Confirm the Chat ID is correct
   - Review n8n execution logs

2. **Authentication Errors**
   - Re-authorize Gmail OAuth2 credentials
   - Check Google API quotas and limits
   - Ensure your Gmail account has API access enabled

3. **Missing Emails**
   - Verify the Gmail category filter is correct
   - Check if emails are being properly categorized in Gmail
   - Adjust the polling interval if needed

4. **Workflow Not Running**
   - Confirm workflow is activated
   - Check execution history for errors
   - Verify n8n is running properly

### Performance Tips
- Adjust polling frequency based on your email volume
- Consider adding more specific filters for high-volume inboxes
- Use environment variables for sensitive information
- Monitor execution times and adjust as needed

## Security Considerations
- Store your Telegram Chat ID as an environment variable
- Use OAuth2 authentication for Gmail
- Keep your n8n instance and credentials secure
- Regularly review and update your workflow
- Don't include sensitive email content in notifications

## Support
- Review n8n documentation for Gmail and Telegram nodes
- Test thoroughly before activating
- Monitor the first few executions to ensure proper operation
- Adjust filters and formatting as needed