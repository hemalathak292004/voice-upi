# Connect Your Google Account - 5 Minutes Setup

## 🚀 Quick Start

Follow these steps to connect YOUR real Google account and import YOUR contacts:

---

## STEP 1: Go to Google Cloud Console (30 seconds)
1. Open: **https://console.cloud.google.com/**
2. Sign in with your Gmail account

---

## STEP 2: Create New Project (20 seconds)
1. Click **"Select a project"** (top bar)
2. Click **"NEW PROJECT"**
3. Name: `Voice-UPI`
4. Click **"CREATE"**
5. Wait 10 seconds, then select your new project

---

## STEP 3: Enable Google People API (30 seconds)
1. Click **☰ Menu** (top left)
2. Go to **"APIs & Services"** → **"Library"**
3. Search: **"Google People API"**
4. Click on it
5. Click blue **"ENABLE"** button
6. Wait 10 seconds

---

## STEP 4: Create OAuth Consent Screen (1 minute)
1. Click **☰ Menu** → **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** → Click **"CREATE"**
3. Fill in:
   - **App name:** `Voice UPI`
   - **User support email:** _(your Gmail)_
   - **Developer contact:** _(your Gmail)_
4. Click **"SAVE AND CONTINUE"**
5. Click **"SAVE AND CONTINUE"** again (skip scopes)
6. Click **"ADD USERS"** → Enter your email → Click **"ADD"** → **"SAVE AND CONTINUE"**
7. Click **"BACK TO DASHBOARD"**

---

## STEP 5: Create API Key (30 seconds)
1. Click **☰ Menu** → **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** button
3. Select **"API key"**
4. **Copy** the API key that appears (it's already selected, just Ctrl+C)
5. Click **"RESTRICT KEY"** (optional but recommended)
   - Under "API restrictions", select **"Restrict key"**
   - Select **"Google People API"** from the list
   - Click **"SAVE"**

---

## STEP 6: Create OAuth Client ID (1 minute)
1. Still in **"Credentials"** page
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name: `Voice UPI Client`
5. Under **"Authorized redirect URIs"** click **"+ ADD URI"**
6. Enter: `http://localhost:3000`
7. Click **"CREATE"**
8. **Copy** the **Client ID** (not the secret, just the ID)
9. Click **"OK"**

---

## STEP 7: Create .env File (30 seconds)
1. In your project, go to: `voice-upi3/voice-upi/` folder
2. Create a new file named: **`.env`** (exactly that name, with the dot)
3. Open it and paste this (replace with YOUR values):

```env
REACT_APP_GOOGLE_API_KEY=paste_your_api_key_here
REACT_APP_GOOGLE_CLIENT_ID=paste_your_client_id_here
```

4. Replace:
   - `paste_your_api_key_here` with your API key from Step 5
   - `paste_your_client_id_here` with your Client ID from Step 6
5. Save the file

**Example:**
```env
REACT_APP_GOOGLE_API_KEY=AIzaSyAbc123XYZ789...
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

---

## STEP 8: Restart Server (10 seconds)
1. Stop the server (press `Ctrl+C` in the terminal)
2. Type: `npm start`
3. Press Enter
4. Wait for "Compiled successfully!"

---

## STEP 9: Test It! (30 seconds)
1. Open: **http://localhost:3000**
2. Sign in with your UPI account
3. Go to **"Contacts"** tab
4. Click **"Import Now"** button
5. Click **"Connect Google"** button
6. Sign in with YOUR Gmail
7. Allow permissions
8. Your real Google contacts will appear!
9. Click **"Import"** on any contact to add it

---

## ✅ Done!

You now have real Google Contacts integration working on localhost!

---

## 🆘 Troubleshooting

**"Demo mode active" message?**
- Check that `.env` file is in `voice-upi3/voice-upi/` folder
- Make sure you copied the entire keys (no spaces before/after)
- Restart the server after creating `.env`

**"Failed to initialize Google API"?**
- Verify your API key is correct
- Check that People API is enabled
- Make sure OAuth consent screen is configured

**"Sign in failed"?**
- Check browser console for detailed errors
- Verify redirect URI is exactly: `http://localhost:3000`
- Make sure you added your email in OAuth consent screen

---

## 📝 Summary

Total time: ~5 minutes
Files created: 1 (.env file)
Result: Real Google Contacts integration ✨



