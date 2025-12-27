# Quick Start Guide - Google OAuth Setup

## 🚀 Follow These Steps

### Step 1: Get Google OAuth Credentials (5 minutes)

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select Project**
   - Click project dropdown (top left)
   - Click "New Project" or select existing
   - Name it "EasyTravel"

3. **Enable Required API**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API"
   - Click Enable

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External"
   - Fill in:
     - App name: `EasyTravel`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue" through all steps

5. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `EasyTravel Web`
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     https://www.primetravel.in
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173
     https://www.primetravel.in
     ```
   - Click "Create"
   - **COPY** both:
     - Client ID (looks like: `123456789-xxx.apps.googleusercontent.com`)
     - Client Secret (looks like: `GOCSPX-xxxxxxxxxx`)

### Step 2: Update Local Environment Files

#### Backend `.env` file:
```env
GOOGLE_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

#### Frontend `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
```

**Note:** Use the SAME Client ID in both files!

### Step 3: Update Render (Production)

1. Go to Render Dashboard
2. Select your backend service
3. Click "Environment"
4. Add these variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
5. Save changes
6. Redeploy will happen automatically

### Step 4: Test Locally

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

Then:
1. Open http://localhost:5173
2. Click "Login" or "Sign up"
3. Click "Sign in with Google" button
4. Select your Google account
5. You should be logged in!

### Step 5: Deploy to Production

```bash
git add -A
git commit -m "Add Google OAuth login"
git push origin main
```

Render will auto-deploy. Then test at your production URL!

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID and Secret copied
- [ ] Backend `.env` updated with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- [ ] Frontend `.env` updated with VITE_GOOGLE_CLIENT_ID
- [ ] Tested locally (http://localhost:5173)
- [ ] Render environment variables added
- [ ] Code pushed to GitHub
- [ ] Tested in production

## 🐛 Troubleshooting

**"Error: idpiframe_initialization_failed"**
- Check that VITE_GOOGLE_CLIENT_ID is set correctly in Frontend/.env
- Restart frontend dev server: Ctrl+C then `npm run dev`

**"Google login failed"**
- Check browser console for detailed error
- Verify Client ID matches in frontend and backend
- Make sure http://localhost:5173 is in Authorized JavaScript origins

**"Invalid redirect URI"**
- Make sure you added exact URLs to Google Console
- No trailing slashes!
- Check http vs https

**"This app isn't verified"**
- This is normal in development
- Click "Advanced" → "Go to EasyTravel (unsafe)"
- For production, you can verify the app later

## 📝 Notes

- **Client ID is public** - Safe to expose in frontend
- **Client Secret is private** - Keep in backend only
- **Free forever** - Google OAuth is completely free
- **Works offline** - No ongoing costs

## 🎉 What's Next?

Once Google login works:
- Users can sign up with one click
- No password required for Google users
- Avatar from Google profile automatically saved
- Email verified by Google

Enjoy your new Google login! 🚀
