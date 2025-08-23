import express from 'express';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
const router = express.Router();

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  const { email, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Generate reset token (simple random string for demo)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&role=${role}`;
    await sendEmail(email, 'Password Reset', `Click to reset your password: ${resetLink}`);
    res.json({ success: true, message: 'Reset link sent' });
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
    // Find OTP record
    const Otp = require('../models/Otp');
    const otpRecord = await Otp.findOne({ email, otp, verified: true });
    if (!otpRecord) return res.status(400).json({ success: false, message: 'Invalid or unverified OTP' });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });
    // Update password
    const bcrypt = require('bcryptjs');
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Otp.deleteMany({ email }); // Cleanup OTPs
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
