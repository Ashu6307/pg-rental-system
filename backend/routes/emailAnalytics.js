import express from 'express';
import {
  getEmailDashboard,
  getEmailLogs,
  getCampaignDetails,
  getEmailAnalytics,
  deleteEmailLogs
} from '../controllers/emailAnalyticsController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Admin only middleware
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Email Dashboard Overview
router.get('/dashboard', authenticateJWT, adminAuth, getEmailDashboard);

// Email Logs with Filtering
router.get('/logs', authenticateJWT, adminAuth, getEmailLogs);

// Campaign Details
router.get('/campaigns/:campaignId', authenticateJWT, adminAuth, getCampaignDetails);

// Email Analytics
router.get('/analytics', authenticateJWT, adminAuth, getEmailAnalytics);

// Delete Old Email Logs (Cleanup)
router.delete('/logs/cleanup', authenticateJWT, adminAuth, deleteEmailLogs);

export default router;
