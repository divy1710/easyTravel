# Email OTP Verification Setup Guide

## Overview

The application now includes email-based OTP (One-Time Password) verification for user signup. Users must verify their email address before creating an account.

## Features Implemented

### Backend

1. **OTP Model** (`Backend/src/models/OTP.ts`)

   - Stores email, OTP code, and expiration time
   - Automatically deletes expired OTPs using MongoDB TTL index
   - OTPs expire after 10 minutes

2. **Email Service** (`Backend/src/services/emailService.ts`)

   - Sends formatted HTML emails with 6-digit OTP
   - Uses nodemailer with Gmail SMTP
   - Professional email template

3. **API Endpoints** (`Backend/src/api/v1/routes/auth.ts`)

   - `POST /auth/send-otp` - Sends OTP to user's email
   - `POST /auth/verify-otp` - Verifies the OTP code

4. **User Model Updates**
   - Added `isVerified` field to track email verification status
   - Added `googleId` and `avatar` for Google OAuth support

### Frontend

1. **Two-Step Signup Flow** (`Frontend/src/pages/Signup.tsx`)

   - Step 1: User fills out registration form
   - Step 2: User enters 6-digit OTP received via email
   - Resend OTP functionality
   - Back navigation between steps

2. **API Client Functions** (`Frontend/src/api/auth.ts`)
   - `sendOTP(email)` - Request OTP
   - `verifyOTP(email, otp)` - Verify OTP code

## Email Configuration

### Gmail Setup (Recommended)

1. **Enable 2-Step Verification**

   - Go to Google Account Settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**

   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env File**
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

### Alternative Email Services

To use a different email service, modify `Backend/src/services/emailService.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});
```

## User Flow

1. **User fills signup form**

   - First name, last name, email, phone (optional), password

2. **Click "Send Verification Code"**

   - Backend validates no existing user with that email
   - Generates 6-digit OTP
   - Saves OTP to database with 10-minute expiration
   - Sends OTP via email

3. **User receives email**

   - Professional email with OTP code
   - Clear instructions and branding

4. **User enters OTP**

   - 6-digit input field
   - Real-time validation
   - Resend option available

5. **Verification successful**
   - OTP is validated and deleted
   - User account is created with `isVerified: true`
   - User is logged in and redirected to dashboard

## Security Features

- OTPs expire after 10 minutes
- Each email can only have one active OTP (previous ones are deleted)
- OTP is deleted immediately after successful verification
- Email uniqueness is checked before sending OTP
- Passwords are hashed with bcrypt before storage

## Testing

1. **Start Backend**

   ```bash
   cd Backend
   npm run dev
   ```

2. **Configure Email Settings**

   - Update `.env` with your Gmail credentials
   - Ensure App Password is used, not regular password

3. **Test Signup Flow**
   - Navigate to signup page
   - Enter valid email (you have access to)
   - Complete form and submit
   - Check email for OTP
   - Enter OTP and complete signup

## Troubleshooting

### OTP Email Not Received

1. **Check Spam/Junk Folder**

   - Gmail may mark automated emails as spam

2. **Verify Email Credentials**

   - Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct
   - Use App Password, not regular password

3. **Check Backend Logs**
   - Look for email sending errors in console
   - Verify nodemailer connection

### OTP Verification Fails

1. **Check OTP Expiration**

   - OTPs expire after 10 minutes
   - Request a new OTP if expired

2. **Verify Email Match**

   - Ensure the email used matches the form email

3. **Check Database Connection**
   - Verify MongoDB is running
   - Check OTP collection for records

## Future Enhancements

- Rate limiting for OTP requests
- SMS OTP as alternative to email
- Customizable OTP length and expiration
- Email template customization
- Multi-language support for emails
- OTP attempt tracking and account lockout
