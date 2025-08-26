
import nodemailer from 'nodemailer';

// Production-ready email service with error handling and retry logic
export async function sendEmail({ to, subject, html, attachmentBuffer }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000, // 1 second
    rateLimit: 10    // 10 emails per rateDelta
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments: attachmentBuffer ? [{ filename: 'invoice.pdf', content: attachmentBuffer }] : []
  };

  // Retry mechanism with exponential backoff
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${to} (attempt ${attempt})`);
      return { success: true, attempt };
    } catch (error) {
      lastError = error;
      console.log(`📧 Email attempt ${attempt} failed for ${to}:`, error.message);
      // Don't retry on certain errors
      if (error.code === 'EENVELOPE' && error.responseCode === 421) {
        console.log(`🚫 Gmail rate limit hit for ${to}, skipping retries`);
        break;
      }
      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`⏳ Waiting ${backoffTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  // Email failed after all retries
  console.log(`❌ Email failed to ${to} after ${maxRetries} attempts:`, lastError?.message);
  // Don't throw error - return failure status instead to prevent server crash
  return { 
    success: false, 
    error: lastError?.message || 'Unknown email error',
    code: lastError?.code,
    responseCode: lastError?.responseCode
  };
}
