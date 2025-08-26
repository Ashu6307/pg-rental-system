import express from 'express';
import User from '../models/User.js';
import OTP from '../models/Otp.js';
import { sendEmail } from '../utils/sendEmail.js';
import emailTemplates from '../utils/emailTemplates.js';
const router = express.Router();

// Forgot password endpoint - Send OTP
router.post('/forgot-password', async (req, res) => {
  const { email, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP record
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      verified: false
    });
    await otpRecord.save();
    
    // Send OTP email using professional template
    const emailResult = await sendEmail({ 
      to: email, 
      subject: '🔑 Password Reset Request - PG & Bike Rental', 
      html: emailTemplates.passwordReset({
        name: user.name || 'User',
        email: email,
        role: role,
        otp: otp
      })
    });
    
    if (emailResult.success) {
      res.json({ success: true, message: 'OTP sent to your email for password reset' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Reset password via OTP
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, otp, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Find and verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });
    
    // Update password
    const bcrypt = await import('bcryptjs');
    user.password_hash = await bcrypt.default.hash(newPassword, 10);
    await user.save();
    
    // Mark OTP as verified and cleanup
    await OTP.deleteMany({ email });
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
