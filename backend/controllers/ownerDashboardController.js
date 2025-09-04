import PG from '../models/PG.js';
import Room from '../models/Room.js';
import PGResident from '../models/PGResident.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Payment = require('../models/Payment.js');
const ActivityLog = require('../models/ActivityLog.js');
import Maintenance from '../models/Maintenance.js';
import Utility from '../models/Utility.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// Get comprehensive dashboard overview
export const getOwnerDashboardOverview = async (req, res) => {
  try {
    const ownerId = req.user._id;
    
    // Get current month start
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    // Get previous month for comparison
    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setDate(0);

    // Basic property stats
    const totalPGProperties = await PG.countDocuments({ owner: ownerId });
    const totalRooms = await Room.countDocuments({ owner: ownerId });
    const occupiedRooms = await Room.countDocuments({ owner: ownerId, status: 'occupied' });
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(1) : 0;

    // Tenant stats
    const totalTenants = await PGResident.countDocuments({ owner: ownerId, status: 'active' });
    const newTenantsThisMonth = await PGResident.countDocuments({
      owner: ownerId,
      status: 'active',
      checkinDate: { $gte: currentMonthStart }
    });

    // Revenue stats
    const currentMonthRevenue = await Payment.aggregate([
      { 
        $match: { 
          owner: ownerId, 
          createdAt: { $gte: currentMonthStart },
          status: 'completed'
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const previousMonthRevenue = await Payment.aggregate([
      { 
        $match: { 
          owner: ownerId, 
          createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
          status: 'completed'
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const currentRevenue = currentMonthRevenue[0]?.total || 0;
    const previousRevenue = previousMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0 ? 
      (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1) : 0;

    // Pending payments
    const pendingPayments = await Payment.aggregate([
      { 
        $match: { 
          owner: ownerId, 
          status: 'pending',
          dueDate: { $lt: new Date() }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Maintenance requests
    const pendingMaintenance = await Maintenance.countDocuments({
      owner: ownerId,
      status: { $in: ['pending', 'in-progress'] }
    });

    // Recent activities
    const recentActivities = await ActivityLog.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('tenant', 'name')
      .populate('room', 'roomNumber');

    // Satisfaction score
    const reviewStats = await Review.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    // Quick action counts
    const expiredDocuments = await PGResident.countDocuments({
      owner: ownerId,
      'documents.expiryDate': { $lt: new Date() }
    });

    const overdueUtilities = await Utility.countDocuments({
      owner: ownerId,
      dueDate: { $lt: new Date() },
      status: 'unpaid'
    });

    const overview = {
      stats: {
        monthlyRevenue: {
          amount: currentRevenue,
          growth: parseFloat(revenueGrowth),
          isPositive: revenueGrowth >= 0,
          count: currentMonthRevenue[0]?.count || 0
        },
        totalRooms: {
          count: totalRooms,
          occupied: occupiedRooms,
          available: availableRooms,
          occupancyRate: parseFloat(occupancyRate)
        },
        currentTenants: {
          count: totalTenants,
          newThisMonth: newTenantsThisMonth,
          retentionRate: 85 // Calculate based on historical data
        },
        pendingBills: {
          amount: pendingPayments[0]?.total || 0,
          count: pendingPayments[0]?.count || 0
        },
        pendingActions: {
          count: pendingMaintenance + expiredDocuments + overdueUtilities,
          maintenance: pendingMaintenance,
          documents: expiredDocuments,
          utilities: overdueUtilities
        },
        satisfaction: {
          score: reviewStats[0]?.avgRating || 0,
          reviewCount: reviewStats[0]?.count || 0
        },
        properties: {
          total: totalPGProperties
        }
      },
      recentActivities: recentActivities.map(activity => ({
        id: activity._id,
        type: activity.type,
        description: activity.description,
        tenant: activity.tenant?.name,
        room: activity.room?.roomNumber,
        timestamp: activity.createdAt,
        severity: activity.severity || 'normal'
      })),
      quickActions: [
        {
          id: 'add-tenant',
          label: 'Add New Tenant',
          count: availableRooms,
          enabled: availableRooms > 0
        },
        {
          id: 'generate-bills',
          label: 'Generate Monthly Bills',
          count: totalTenants,
          enabled: totalTenants > 0
        },
        {
          id: 'maintenance-requests',
          label: 'Pending Maintenance',
          count: pendingMaintenance,
          urgent: pendingMaintenance > 0
        },
        {
          id: 'payment-reminders',
          label: 'Payment Reminders',
          count: pendingPayments[0]?.count || 0,
          urgent: (pendingPayments[0]?.count || 0) > 0
        }
      ]
    };

    res.json(overview);
  } catch (err) {
    console.error('Dashboard Overview Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get detailed room statistics
export const getOwnerRoomStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const rooms = await Room.find({ owner: ownerId })
      .populate('currentResident', 'name phone email checkinDate')
      .populate('pg', 'name address');

    const roomStats = {
      totalRooms: rooms.length,
      occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
      availableRooms: rooms.filter(r => r.status === 'available').length,
      maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
      avgRent: rooms.reduce((sum, room) => sum + (room.rent || 0), 0) / rooms.length || 0,
      roomDetails: rooms.map(room => ({
        id: room._id,
        roomNumber: room.roomNumber,
        type: room.type,
        rent: room.rent,
        status: room.status,
        tenant: room.currentResident,
        pg: room.pg,
        amenities: room.amenities,
        lastUpdated: room.updatedAt
      }))
    };

    res.json(roomStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detailed tenant statistics
export const getOwnerTenantStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const tenants = await PGResident.find({ owner: ownerId })
      .populate('room', 'roomNumber type rent')
      .populate('pg', 'name')
      .sort({ checkinDate: -1 });

    const tenantStats = {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      newThisMonth: tenants.filter(t => {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return new Date(t.checkinDate) >= thisMonth;
      }).length,
      avgStayDuration: calculateAverageStay(tenants),
      tenantDetails: tenants.map(tenant => ({
        id: tenant._id,
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        status: tenant.status,
        checkinDate: tenant.checkinDate,
        checkoutDate: tenant.checkoutDate,
        room: tenant.room,
        pg: tenant.pg,
        rent: tenant.room?.rent || 0,
        documents: tenant.documents,
        emergencyContact: tenant.emergencyContact
      }))
    };

    res.json(tenantStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get financial statistics
export const getOwnerFinancialStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const payments = await Payment.find({ owner: ownerId, createdAt: { $gte: currentMonth } })
      .populate('resident', 'name')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 });

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments.filter(p => p.status === 'pending');
    const overduePayments = payments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date());

    const financialStats = {
      monthlyRevenue: totalRevenue,
      pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
      overdueAmount: overduePayments.reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: payments.length,
      completedTransactions: payments.filter(p => p.status === 'completed').length,
      paymentMethods: getPaymentMethodBreakdown(payments),
      recentPayments: payments.slice(0, 20).map(payment => ({
        id: payment._id,
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        dueDate: payment.dueDate,
        paidAt: payment.paidAt,
        tenant: payment.resident,
        room: payment.room,
        method: payment.paymentMethod
      }))
    };

    res.json(financialStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get maintenance statistics
export const getOwnerMaintenanceStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const maintenanceRequests = await Maintenance.find({ owner: ownerId })
      .populate('room', 'roomNumber')
      .populate('requestedBy', 'name phone')
      .sort({ createdAt: -1 });

    const maintenanceStats = {
      totalRequests: maintenanceRequests.length,
      pendingRequests: maintenanceRequests.filter(m => m.status === 'pending').length,
      inProgressRequests: maintenanceRequests.filter(m => m.status === 'in-progress').length,
      completedRequests: maintenanceRequests.filter(m => m.status === 'completed').length,
      totalCost: maintenanceRequests.reduce((sum, m) => sum + (m.cost || 0), 0),
      avgResolutionTime: calculateAvgResolutionTime(maintenanceRequests),
      requestsByCategory: getMaintenanceByCategory(maintenanceRequests),
      recentRequests: maintenanceRequests.slice(0, 20).map(request => ({
        id: request._id,
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: request.status,
        cost: request.cost,
        room: request.room,
        tenant: request.requestedBy,
        createdAt: request.createdAt,
        completedAt: request.completedAt
      }))
    };

    res.json(maintenanceStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get utility statistics
export const getOwnerUtilityStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const utilities = await Utility.find({ owner: ownerId })
      .populate('room', 'roomNumber')
      .populate('resident', 'name')
      .sort({ createdAt: -1 });

    const utilityStats = {
      totalBills: utilities.length,
      paidBills: utilities.filter(u => u.status === 'paid').length,
      unpaidBills: utilities.filter(u => u.status === 'unpaid').length,
      overdueBills: utilities.filter(u => u.status === 'unpaid' && new Date(u.dueDate) < new Date()).length,
      totalAmount: utilities.reduce((sum, u) => sum + u.amount, 0),
      collectedAmount: utilities.filter(u => u.status === 'paid').reduce((sum, u) => sum + u.amount, 0),
      utilityBreakdown: getUtilityBreakdown(utilities),
      recentBills: utilities.slice(0, 20).map(utility => ({
        id: utility._id,
        type: utility.type,
        amount: utility.amount,
        unitsConsumed: utility.unitsConsumed,
        billingPeriod: utility.billingPeriod,
        dueDate: utility.dueDate,
        status: utility.status,
        room: utility.room,
        tenant: utility.resident,
        createdAt: utility.createdAt
      }))
    };

    res.json(utilityStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recent activities
export const getOwnerRecentActivities = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { limit = 50, type, days = 30 } = req.query;

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);

    const filter = { 
      owner: ownerId, 
      createdAt: { $gte: dateFilter }
    };

    if (type) {
      filter.type = type;
    }

    const activities = await ActivityLog.find(filter)
      .populate('resident', 'name')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      activities: activities.map(activity => ({
        id: activity._id,
        type: activity.type,
        description: activity.description,
        tenant: activity.resident,
        room: activity.room,
        metadata: activity.metadata,
        severity: activity.severity,
        timestamp: activity.createdAt
      })),
      total: activities.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper functions
const calculateAverageStay = (tenants) => {
  const activeTenants = tenants.filter(t => t.status === 'active' && t.checkinDate);
  if (activeTenants.length === 0) return 0;

  const totalDays = activeTenants.reduce((sum, tenant) => {
    const checkIn = new Date(tenant.checkinDate);
    const now = new Date();
    const daysDiff = Math.floor((now - checkIn) / (1000 * 60 * 60 * 24));
    return sum + daysDiff;
  }, 0);

  return Math.floor(totalDays / activeTenants.length);
};

const calculateAvgResolutionTime = (requests) => {
  const completed = requests.filter(r => r.status === 'completed' && r.completedAt);
  if (completed.length === 0) return 0;

  const totalTime = completed.reduce((sum, request) => {
    const created = new Date(request.createdAt);
    const completed = new Date(request.completedAt);
    return sum + (completed - created);
  }, 0);

  return Math.floor(totalTime / (completed.length * 1000 * 60 * 60 * 24)); // days
};

const getPaymentMethodBreakdown = (payments) => {
  const breakdown = {};
  payments.forEach(payment => {
    const method = payment.paymentMethod || 'cash';
    breakdown[method] = (breakdown[method] || 0) + payment.amount;
  });
  return breakdown;
};

const getMaintenanceByCategory = (requests) => {
  const breakdown = {};
  requests.forEach(request => {
    const category = request.category || 'other';
    breakdown[category] = (breakdown[category] || 0) + 1;
  });
  return breakdown;
};

const getUtilityBreakdown = (utilities) => {
  const breakdown = {};
  utilities.forEach(utility => {
    const type = utility.type || 'electricity';
    if (!breakdown[type]) {
      breakdown[type] = { amount: 0, units: 0, count: 0 };
    }
    breakdown[type].amount += utility.amount;
    breakdown[type].units += utility.unitsConsumed || 0;
    breakdown[type].count += 1;
  });
  return breakdown;
};
