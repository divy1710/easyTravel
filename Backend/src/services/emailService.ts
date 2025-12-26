import nodemailer from 'nodemailer';
import { config } from '../config';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
  // Production-friendly settings
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 1000,
  rateLimit: 3,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 30000, // 30 seconds
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
    minVersion: 'TLSv1'
  },
  debug: true, // Enable debug logs
  logger: true
});

// Verify transporter configuration on startup (non-blocking)
transporter.verify()
  .then(() => {
    console.log('✅ Email server is ready to send messages');
  })
  .catch((error) => {
    console.warn('⚠️  Email transporter verification failed:', error.message);
    console.warn('Email functionality may not work. OTP will still be saved to database.');
    console.warn('For Gmail: Make sure you have 2FA enabled and use an App Password');
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
    // Add timeout wrapper to prevent indefinite hanging
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 15 seconds')), 15000)
    );
    
    await Promise.race([sendPromise, timeoutPromise]);
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending OTP email:', {
      code: error.code,
      command: error.command,
      message: error.message,
    });
    
    // Don't throw error - just log it and continue
    // OTP is already saved in database, user can still use it
    console.warn('⚠️  Email failed but OTP is saved in database');
  }
};
