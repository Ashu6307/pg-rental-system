import express from 'express';
import { 
  getOwnerDashboardOverview,
  getOwnerRoomStats,
  getOwnerTenantStats,
  getOwnerFinancialStats,
  getOwnerMaintenanceStats,
  getOwnerUtilityStats,
  getOwnerRecentActivities
} from '../controllers/ownerDashboardController.js';
import { ownerAuth } from '../middleware/auth.js';

const router = express.Router();

// Dashboard overview with all key metrics
router.get('/overview', ownerAuth, getOwnerDashboardOverview);

// Specific section data
router.get('/rooms', ownerAuth, getOwnerRoomStats);
router.get('/tenants', ownerAuth, getOwnerTenantStats);
router.get('/financial', ownerAuth, getOwnerFinancialStats);
router.get('/maintenance', ownerAuth, getOwnerMaintenanceStats);
router.get('/utilities', ownerAuth, getOwnerUtilityStats);
router.get('/activities', ownerAuth, getOwnerRecentActivities);

export default router;
