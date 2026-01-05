# Render Environment Variables Setup

## 🚨 CRITICAL: Set These on Render Dashboard

Go to your Render dashboard → Your backend service → Environment

Add these environment variables (replace with your actual values):

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
MAPBOX_TOKEN=your_mapbox_token
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

```

## ⚠️ Security Recommendations

1. **Change JWT_SECRET** to a strong random string in production:

   ```bash
   # Generate a secure secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Regenerate Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Create new app password specifically for production
   - Use that in EMAIL_PASSWORD on Render

## 📝 Steps to Deploy

1. Set all environment variables on Render
2. Trigger a new deploy (or wait for auto-deploy)
3. Check logs for: `✅ Email server is ready to send messages`
4. Test login from https://www.primetravel.in

## 🔍 Verify Deployment

After deployment, check Render logs for:

- ✅ Database connection success
- ✅ Email server ready
- ✅ Server running on port 5000

## 🐛 If Still Getting 401

1. **Check CORS**: Make sure backend allows `https://www.primetravel.in`
2. **Clear Browser Cookies**: Old invalid cookies might be cached
3. **Check Render Logs**: Look for JWT or auth errors
4. **Test with Postman**: Verify API works independently
