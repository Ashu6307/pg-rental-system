import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
const router = express.Router();

// Check if Google OAuth is configured (for development)
router.get('/check-config', (req, res) => {
  const isConfigured = 
    process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here' &&
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret-here';
  
  if (isConfigured) {
    res.json({ configured: true });
  } else {
    res.status(400).json({ 
      configured: false, 
      message: 'Google OAuth credentials not configured' 
    });
  }
});

// Google OAuth2 redirect endpoint
router.get('/google', (req, res) => {
  const { role, mode } = req.query;
  
  // Google OAuth2 configuration
  const googleClientId = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
  
  // Check if Google OAuth is configured
  if (googleClientId === 'your-google-client-id' || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('/?error=google_not_configured');
  }
  
  // Construct state parameter with role and mode
  const state = JSON.stringify({ role: role || 'user', mode: mode || 'login' });
  
  // Construct Google OAuth URL
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=email%20profile&response_type=code&state=${encodeURIComponent(state)}`;
  
  // Redirect to Google OAuth
  res.redirect(googleAuthUrl);
});

// Google OAuth2 callback endpoint  
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // Parse state parameter
    let parsedState = { role: 'user', mode: 'login' };
    try {
      parsedState = JSON.parse(decodeURIComponent(state));
    } catch (err) {
      // Fallback for old state format (just role string)
      parsedState = { role: state || 'user', mode: 'login' };
    }
    
    const { role, mode } = parsedState;
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
    let isNewUser = false;
    
    if (!user) {
      // Register new user
      isNewUser = true;
      user = new User({
        email,
        name,
        profilePhoto: picture,
        googleId,
        role: role || 'user',
        isGoogleAuth: true,
        status: 'active', // Google users are immediately active
        emailVerified: true, // Google email is verified
        emailVerifiedAt: new Date(),
        data_consent: true, // Implicit consent through Google OAuth
        consent_date: new Date()
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
        // Activate user account if logging in via Google
        if (user.status === 'pending') {
          user.status = 'active';
          user.emailVerified = true;
          user.emailVerifiedAt = new Date();
        }
        await user.save();
      }
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Redirect to frontend with token
    // Always redirect to the callback route and let frontend handle role-based navigation
    res.redirect(`/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}&new=${isNewUser}`);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/?error=google_auth_failed');
  }
});

// Google OAuth2 login/signup (POST method for direct token verification)
router.post('/google', async (req, res) => {
  const { tokenId, role } = req.body;
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
        role: role || 'user', // Use role from request or default to 'user'
        isGoogleAuth: true,
        status: 'active', // Google users are immediately active
        emailVerified: true, // Google email is verified
        emailVerifiedAt: new Date(),
        data_consent: true, // Implicit consent through Google OAuth
        consent_date: new Date()
      });
      await user.save();
    } else {
      // Update existing user
      if (!user.isGoogleAuth) {
        user.isGoogleAuth = true;
        user.googleId = googleId;
        if (!user.profilePhoto && picture) {
          user.profilePhoto = picture;
        }
        // Activate user account if logging in via Google
        if (user.status === 'pending') {
          user.status = 'active';
          user.emailVerified = true;
          user.emailVerifiedAt = new Date();
        }
      }
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Google OAuth POST error:', err);
    res.status(400).json({ error: 'Google authentication failed.' });
  }
});

export default router;
