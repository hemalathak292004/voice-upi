# Google Contacts Integration Setup Guide

This guide will help you set up Google Contacts integration for the Voice UPI application.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google People API (for contacts)
   - Google+ API (for authentication)

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: Voice UPI
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
4. Add scopes:
   - `https://www.googleapis.com/auth/contacts.readonly`
5. Save and continue through the remaining steps

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3000/callback`
5. Save and copy your:
   - Client ID
   - Client Secret

### 4. Update the Application

Replace the following in `src/components/GoogleContacts.jsx`:

```javascript
apiKey: "YOUR_API_KEY",
clientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",
```

With your actual credentials from step 3.

### 5. Test the Integration

1. Start the application
2. Go to Contacts page
3. Click "Import Now" button
4. Click "Connect Google" button
5. Sign in with your Google account
6. Grant permissions for contacts access
7. Your Google contacts will be fetched and displayed

## Demo Mode

For quick testing without setting up Google API, the application includes a **demo mode** that shows sample contacts:

- **Demo Mode** activates automatically if Google API setup is not configured
- It shows 3 sample contacts that can be imported
- To use real Google Contacts, follow the setup instructions above

## Troubleshooting

### Issue: "Failed to initialize Google API"
- **Solution**: Make sure you've added your API key and Client ID correctly
- Verify that Google People API is enabled in your project

### Issue: "Sign in failed"
- **Solution**: The app automatically falls back to demo mode
- Check browser console for detailed error messages

### Issue: "No contacts found"
- **Solution**: Verify your Google account has contacts saved
- Make sure you've granted permissions for contacts access

## Features

- ✅ **Google OAuth Authentication**
- ✅ **Fetch Google Contacts**
- ✅ **Import Contacts** with automatic UPI generation
- ✅ **Fallback Demo Mode** for testing without setup
- ✅ **Secure Token Management**

## Security Notes

- OAuth tokens are stored in browser session
- No credentials are stored on the server
- All API calls are made client-side
- Demo mode shows sample data only



