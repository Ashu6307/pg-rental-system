import express from 'express';
import { getOwnerAnalytics, getOwnerAnalyticsByPeriod } from '../controllers/ownerAnalyticsController.js';
import { ownerAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ownerAuth, getOwnerAnalytics);
router.get('/period/:period/:year/:month', ownerAuth, getOwnerAnalyticsByPeriod);

export default router;
