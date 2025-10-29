# Environment Variables Setup

To enable **real Google Contacts integration** (instead of demo mode), follow these steps:

## Step 1: Create `.env` file

In the `voice-upi3/voice-upi` directory, create a file named `.env` with the following content:

```env
# Google API Credentials
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

## Step 2: Get Your Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google People API**
4. Go to **APIs & Services** > **Credentials**
5. Create **OAuth 2.0 Client ID** for Web Application
6. Add authorized redirect URI: `http://localhost:3000`
7. Copy your **API Key** and **Client ID**

## Step 3: Update `.env` file

Replace the placeholders in your `.env` file:

```env
REACT_APP_GOOGLE_API_KEY=AIzaSy...your-actual-api-key
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
```

## Step 4: Restart Server

After updating `.env`, restart the React development server:

1. Stop the current server (Ctrl+C)
2. Run `npm start` again
3. The app will now use real Google Contacts

## Demo Mode vs Real Mode

### Demo Mode (Current)
- ✅ Works without any setup
- ✅ Shows 5 sample contacts
- ✅ No Google account needed
- ❌ Can't access real Google Contacts

### Real Mode (After setup)
- ✅ Connects to your Google account
- ✅ Fetches real contacts from Google
- ✅ Imports actual contact information
- ✅ Fully functional OAuth integration

## Troubleshooting

**Issue**: Still showing "Demo Mode"
- **Solution**: Make sure you created `.env` file in the correct directory (`voice-upi3/voice-upi`)
- Restart the server after creating/updating `.env`

**Issue**: "Failed to initialize Google API"
- **Solution**: Verify your API key and Client ID are correct
- Check that Google People API is enabled

**Issue**: "Sign in failed"
- **Solution**: Make sure you added `http://localhost:3000` as redirect URI
- Check browser console for detailed errors

## Current Status

Your app is currently in **Demo Mode** because:
- No `.env` file exists, OR
- Environment variables are not set

To switch to **Real Mode**, follow the steps above.



