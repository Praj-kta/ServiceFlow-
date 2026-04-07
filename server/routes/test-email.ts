import { Router, Request, Response } from 'express';
import { sendEmail } from '../utils/email';

const router = Router();

/**
 * Test email endpoint - helps diagnose email configuration issues
 */
router.post('/send-test', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('\n=== TEST EMAIL REQUEST ===');
    console.log('Recipient:', email);

    const testHtml = `
      <h1>ServiceFlow Test Email</h1>
      <p>This is a test email to verify your SMTP configuration is working.</p>
      <p><strong>Status:</strong> If you received this, your email setup is working correctly! ✅</p>
      <p><strong>Config Details:</strong></p>
      <ul>
        <li>Host: ${process.env.SMTP_HOST}</li>
        <li>From: ${process.env.SMTP_FROM || process.env.SMTP_USER}</li>
        <li>Port: ${process.env.SMTP_PORT}</li>
        <li>Secure: ${process.env.SMTP_SECURE}</li>
      </ul>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `;

    await sendEmail({
      to: email,
      subject: 'ServiceFlow Test Email - Configuration Check',
      html: testHtml,
      text: 'This is a test email for ServiceFlow configuration check',
    });

    res.json({
      message: 'Test email sent successfully',
      recipient: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    res.status(500).json({
      message: 'Failed to send test email',
      error: error.message,
      details: {
        code: error.code,
        response: error.response,
      },
    });
  }
});

export const testEmailRouter = router;
