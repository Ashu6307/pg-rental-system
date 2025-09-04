import express from 'express';
import { 
  getOwnerDashboardOverview,
  getOwnerRoomStats,
  getOwnerTenantStats,
  getOwnerFinancialStats,
  getOwnerMaintenanceStats,
  getOwnerUtilityStats,
  getOwnerRecentActivities,
  // Smart Electricity Billing Functions
  addMeterReading,
  generateElectricityBills,
  sendElectricityBills,
  getElectricityBillingDashboard,
  // Advanced Tenant Management
  addNewResident,
  // Advanced Notification System
  sendAdvancedNotification,
  // Advanced Analytics
  getAdvancedAnalytics
} from '../controllers/ownerDashboardController.js';
import { ownerAuth } from '../middleware/auth.js';

const router = express.Router();

// Main Dashboard Routes
router.get('/overview', ownerAuth, getOwnerDashboardOverview);

// Property Management Routes
router.get('/rooms', ownerAuth, getOwnerRoomStats);
router.get('/tenants', ownerAuth, getOwnerTenantStats);
router.get('/financial', ownerAuth, getOwnerFinancialStats);
router.get('/maintenance', ownerAuth, getOwnerMaintenanceStats);
router.get('/utilities', ownerAuth, getOwnerUtilityStats);
router.get('/activities', ownerAuth, getOwnerRecentActivities);

// Smart Electricity Billing Routes
router.post('/billing/meter-reading', ownerAuth, addMeterReading);
router.post('/billing/generate-bills', ownerAuth, generateElectricityBills);
router.post('/billing/send-bills', ownerAuth, sendElectricityBills);
router.get('/billing/dashboard', ownerAuth, getElectricityBillingDashboard);

// Advanced Tenant Management Routes
router.post('/residents/add', ownerAuth, addNewResident);

// Advanced Notification Routes
router.post('/notifications/send', ownerAuth, sendAdvancedNotification);

// Advanced Analytics Routes
router.get('/analytics/advanced', ownerAuth, getAdvancedAnalytics);

export default router;
