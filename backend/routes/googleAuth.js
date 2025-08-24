import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
const router = express.Router();

// Google OAuth2 redirect endpoint
router.get('/google', (req, res) => {
  const { role } = req.query;
  
  // Google OAuth2 configuration
  const googleClientId = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
  
  // Construct Google OAuth URL
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=email%20profile&response_type=code&state=${role}`;
  
  // Redirect to Google OAuth
  res.redirect(googleAuthUrl);
});

// Google OAuth2 callback endpoint  
router.get('/callback', async (req, res) => {
  const { code, state: role } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
    const { email, name, picture, id: googleId } = userResponse.data;

    if (!email) {
      return res.redirect('/?error=google_email_not_found');
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Register new user
      user = new User({
        email,
        name,
        profilePhoto: picture,
        googleId,
        role: role || 'user',
        isGoogleAuth: true
      });
      await user.save();
    } else {
      // Update existing user with Google info if not already set
      if (!user.isGoogleAuth) {
        user.isGoogleAuth = true;
        user.googleId = googleId;
        if (!user.profilePhoto && picture) {
          user.profilePhoto = picture;
        }
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Redirect to frontend with token
    const frontendUrl = role === 'owner' ? '/owner' : role === 'admin' ? '/admin' : '/user/home';
    res.redirect(`${frontendUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/?error=google_auth_failed');
  }
});

// Google OAuth2 login/signup (POST method for direct token verification)
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
