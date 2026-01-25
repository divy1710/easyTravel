# Google OAuth Production Setup

## 🚀 Quick Fix for Production Errors

If you're seeing these errors in production:
- ❌ `Cross-Origin-Opener-Policy policy would block the window.postMessage call`
- ❌ `POST /api/v1/auth/google 401 (Unauthorized)`

Follow these steps:

## 1️⃣ Add Environment Variables to Render (Backend)

Go to [Render Dashboard](https://dashboard.render.com/) → Your backend service → Environment

Add these two variables:

```
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
```

**Important:** After adding, click **"Save Changes"** and Render will automatically redeploy.

## 2️⃣ Add Environment Variable to Vercel (Frontend)

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your project → Settings → Environment Variables

Add this variable:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Important:** After adding, go to Deployments tab and click **"Redeploy"** on the latest deployment.

## 3️⃣ Verify Google Cloud Console Settings

Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

Make sure your OAuth 2.0 Client has these URLs:

### Authorized JavaScript origins:
```
https://www.primetravel.in
https://easy-travel-kappa.vercel.app
http://localhost:5173
```

### Authorized redirect URIs:
```
https://www.primetravel.in
https://easy-travel-kappa.vercel.app
http://localhost:5173
```

## 4️⃣ Test After Deployment

1. Wait 2-3 minutes for both Render and Vercel to redeploy
2. Go to your production site: https://www.primetravel.in
3. Try clicking "Continue with Google" on login or signup page
4. It should now work! ✅

## 🐛 Still Not Working?

### Check Browser Console
Press F12 and check for any errors. Common issues:

1. **Wrong Client ID:** Make sure `VITE_GOOGLE_CLIENT_ID` on Vercel matches the one from Google Console
2. **Missing Redirect URIs:** Add your production domain to Google Console
3. **CORS Issues:** Backend CORS is already configured for `www.primetravel.in`

### Check Backend Logs on Render
1. Go to Render Dashboard → Your service → Logs
2. Look for any Google OAuth errors
3. Make sure you see both environment variables loaded

## ✅ Quick Verification Checklist

- [ ] GOOGLE_CLIENT_ID added to Render
- [ ] GOOGLE_CLIENT_SECRET added to Render
- [ ] VITE_GOOGLE_CLIENT_ID added to Vercel
- [ ] Production URLs added to Google Cloud Console
- [ ] Both services redeployed
- [ ] Tested on production site

---

**Need Help?** Check the main [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed setup instructions.
