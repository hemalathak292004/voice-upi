# Quick Setup for Real Google Contacts (No Demo)

Follow these simple steps to connect YOUR real Google account:

## Step 1: Get Google Credentials

1. Open https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Name it "Voice UPI" → **Create**
4. Wait for project creation (10 seconds)

## Step 2: Enable Google People API

1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google People API"**
3. Click it → Click **"Enable"**
4. Wait 10 seconds

## Step 3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** → Click **"Create"**
3. Fill in:
   - App name: `Voice UPI`
   - User support email: *(your email)*
   - Developer contact: *(your email)*
4. Click **"Save and Continue"**
5. Click **"Save and Continue"** again (scopes)
6. Add your email → Click **"Save and Continue"**
7. Click **"Back to Dashboard"**

## Step 4: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"API Key"**
3. Copy the API key (looks like: `AIzaSy...`)

## Step 5: Create OAuth Client

1. Still in Credentials page
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name it: `Voice UPI Client`
5. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**
6. Add: `http://localhost:3000`
7. Click **"Create"**
8. Copy the **Client ID** (looks like: `123...@...apps.googleusercontent.com`)
9. Click **"OK"**

## Step 6: Add to Your Project

Create a file named `.env` in the `voice-upi3/voice-upi` folder:

**File location**: `voice-upi3/voice-upi/.env`

**File content**:
```
REACT_APP_GOOGLE_API_KEY=PASTE_YOUR_API_KEY_HERE
REACT_APP_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
```

**Example**:
```
REACT_APP_GOOGLE_API_KEY=AIzaSyAbc123Xyz789
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

## Step 7: Restart Server

1. Stop the server (Ctrl+C in terminal)
2. Start again: `npm start`
3. Your app will now use REAL Google Contacts!

## Step 8: Test It

1. Go to Contacts page
2. Click "Import Now"
3. Click "Connect Google"
4. Sign in with YOUR Gmail
5. Grant permissions
6. Your real contacts will appear!

---

## That's It! 

After Step 7, demo mode is DISABLED and you'll see YOUR real contacts from Google.

## Need Help?

- Make sure `.env` file is in `voice-upi3/voice-upi/` folder
- Make sure you copied the entire API key and Client ID
- Restart the server after creating .env file



