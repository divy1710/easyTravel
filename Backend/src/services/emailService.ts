import nodemailer from 'nodemailer';
import { config } from '../config';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('Please check your EMAIL_USER and EMAIL_PASSWORD in .env file');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: 'EasyTravel - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">EasyTravel Email Verification</h2>
        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  // Log email configuration (without showing password)
  console.log('📧 Attempting to send email:', {
    from: config.emailUser,
    to: email,
    hasAuth: !!config.emailUser && !!config.emailPassword,
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending OTP email:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
    });
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD in environment variables. For Gmail, you need an App Password (not your regular password).');
    }
    
    if (error.code === 'ESOCKET') {
      throw new Error('Network connection failed. Unable to reach email server.');
    }
    
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};
