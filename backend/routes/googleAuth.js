import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
const router = express.Router();

// Google OAuth2 login/signup
router.post('/google', async (req, res) => {
  const { tokenId } = req.body;
  try {
    // Verify token with Google
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`);
    const { email, name, picture, sub: googleId } = googleRes.data;
    if (!email) return res.status(400).json({ error: 'Google email not found.' });
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Register new user
      user = new User({
        email,
        name,
        profilePhoto: picture,
        googleId,
        role: 'user', // Default role, can be changed
        isGoogleAuth: true
      });
      await user.save();
    }
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: 'Google authentication failed.' });
  }
});

export default router;
