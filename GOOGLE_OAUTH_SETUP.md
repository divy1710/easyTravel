# Google OAuth Setup Guide for EasyTravel

## Overview
Add "Continue with Google" authentication to allow users to sign up/login using their Google account.

## Step 1: Get Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 1.2 Create a New Project (or select existing)
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name: `EasyTravel` or similar
4. Click "Create"

### 1.3 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### 1.4 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: `EasyTravel`
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click **Save and Continue**
6. **Scopes**: Click **Add or Remove Scopes**
   - Add: `email`, `profile`, `openid`
   - Click **Update** then **Save and Continue**
7. **Test users** (optional for development): Add your email
8. Click **Save and Continue** → **Back to Dashboard**

### 1.5 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `EasyTravel Web Client`
5. **Authorized JavaScript origins**:
   - Add: `http://localhost:5173` (development)
   - Add: `https://www.primetravel.in` (production - your actual domain)
6. **Authorized redirect URIs**:
   - Add: `http://localhost:5173` (development)
   - Add: `https://www.primetravel.in` (production)
7. Click **Create**
8. **IMPORTANT**: Copy both:
   - **Client ID** (starts with something like `123456789-xxx.apps.googleusercontent.com`)
   - **Client Secret** (starts with `GOCSPX-xxx`)

## Step 2: Update Backend Environment Variables

### 2.1 Add to `.env` file
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 2.2 Add to Render Dashboard (Production)
1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add:
   - `GOOGLE_CLIENT_ID`: Your client ID
   - `GOOGLE_CLIENT_SECRET`: Your client secret
5. Save changes

## Step 3: Install Google Identity Services (Frontend)

The frontend needs Google's Identity Services library. Add this to your `index.html`:

**Location**: `Frontend/index.html`

Add this script tag in the `<head>` section:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## Step 4: Backend Implementation

I'll add the Google OAuth endpoint to handle the authentication.

## Step 5: Frontend Implementation

I'll add the Google Sign-In button to your Login and Signup pages.

## Step 6: Testing

### Development Testing:
1. Run backend: `npm run dev` in Backend folder
2. Run frontend: `npm run dev` in Frontend folder
3. Go to `http://localhost:5173`
4. Click "Continue with Google"
5. Select your Google account
6. Should redirect to dashboard

### Production Testing:
1. Make sure environment variables are set on Render
2. Deploy changes
3. Visit your production URL
4. Test Google login

## Security Notes

✅ **Client ID is public** - It's okay to expose in frontend code
❌ **Client Secret is private** - Keep it in backend environment only
✅ **Use HTTPS in production** - Required for secure cookies
✅ **Verify tokens on backend** - Never trust frontend-only validation

## Troubleshooting

### "Unauthorized redirect URI"
- Make sure you added the exact URL to "Authorized redirect URIs" in Google Console
- Check for http vs https mismatch

### "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen setup
- Add test users in development mode

### "Invalid token"
- Check that GOOGLE_CLIENT_ID matches between frontend and backend
- Verify token hasn't expired (tokens are valid for ~1 hour)

## What Happens During Google Login?

1. User clicks "Continue with Google"
2. Google popup opens for account selection
3. User selects account and grants permissions
4. Google returns a credential (JWT token)
5. Frontend sends credential to backend `/auth/google`
6. Backend verifies token with Google
7. Backend creates/finds user in database
8. Backend returns JWT token and sets cookie
9. User is logged in!

## Next Steps After Setup

Once working:
- Test with multiple Google accounts
- Add Google profile picture (avatar) display
- Consider adding "Sign in with Apple" or other OAuth providers
