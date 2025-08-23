

import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html, attachmentBuffer }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments: attachmentBuffer ? [{ filename: 'invoice.pdf', content: attachmentBuffer }] : []
  };

  await transporter.sendMail(mailOptions);
}
