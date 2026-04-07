import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

let transporter: any = null;

// Initialize transporter with environment variables
const initializeTransporter = () => {
  console.log('=== Email Configuration ===');
  console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'SET' : 'NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET (length: ' + process.env.SMTP_PASS?.length + ')' : 'NOT SET');
  console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET');

  // Check if Gmail is being used
  const isGmail = process.env.SMTP_USER?.includes('gmail.com');
  console.log('Is Gmail:', isGmail ? 'YES' : 'NO');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ WARNING: SMTP credentials not fully configured in .env file');
    console.warn('Please set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM');
    return null;
  }

  try {
    const config: any = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // Special handling for Gmail
    if (isGmail && process.env.SMTP_PORT === '465') {
      config.secure = true;
    }

    console.log('Creating transporter with config:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user.substring(0, 5) + '****',
    });

    transporter = nodemailer.createTransport(config);
    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    return null;
  }
};

export const sendEmail = async (options: EmailOptions): Promise<any> => {
  console.log('\n=== Sending Email ===');
  console.log('To:', options.to);
  console.log('Subject:', options.subject);

  // Initialize transporter if not already done
  if (!transporter) {
    console.log('Initializing transporter...');
    initializeTransporter();
  }

  if (!transporter) {
    const error = new Error(
      'Email service not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env file.'
    );
    console.error('❌ Email failed:', error.message);
    throw error;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@serviceflow.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  console.log('Mail options from:', mailOptions.from);

  try {
    console.log('Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    console.log('Response:', {
      messageId: result.messageId,
      response: result.response?.substring(0, 100),
    });
    return result;
  } catch (error: any) {
    console.error('❌ Email sending failed');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

// Verify transporter on startup
export const verifyEmailConfig = async () => {
  console.log('\n=== Verifying Email Configuration ===');
  if (!transporter) {
    initializeTransporter();
  }

  if (!transporter) {
    console.warn('❌ Email transporter not available');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error: any) {
    console.error('❌ SMTP connection verification failed');
    console.error('Error:', error.message);
    return false;
  }
};
