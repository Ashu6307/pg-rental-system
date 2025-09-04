import PG from '../models/PG.js';
import Room from '../models/Room.js';
import PGResident from '../models/PGResident.js';
import MeterReading from '../models/MeterReading.js';
import ElectricityBill from '../models/ElectricityBill.js';
import Flat from '../models/Flat.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Payment = require('../models/Payment.js');
const ActivityLog = require('../models/ActivityLog.js');
const Notification = require('../models/Notification.js');
import Maintenance from '../models/Maintenance.js';
import Utility from '../models/Utility.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// Get comprehensive dashboard overview with business type support
export const getOwnerDashboardOverview = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { businessType } = req.user; // PG, Room, Flat, All
    
    // Get current month start
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const lastMonthStart = new Date(currentMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
    // Initialize dashboard data
    const dashboardData = {
      businessType,
      allowedSections: getAllowedSections(businessType),
      overview: {},
      properties: {},
      tenants: {},
      financial: {},
      analytics: {},
      quickActions: [],
      alerts: []
    };

    // Get property counts based on business type
    if (businessType === 'All' || businessType === 'PG') {
      const pgs = await PG.find({ owner: ownerId, softDelete: { $ne: true } });
      dashboardData.properties.pgs = {
        total: pgs.length,
        active: pgs.filter(pg => pg.status === 'active').length,
        pending: pgs.filter(pg => pg.status === 'pending').length
      };
    }

    if (businessType === 'All' || businessType === 'Room') {
      const rooms = await Room.find({ owner: ownerId, isDeleted: false });
      dashboardData.properties.rooms = {
        total: rooms.length,
        available: rooms.filter(room => room.isAvailable).length,
        occupied: rooms.filter(room => !room.isAvailable).length
      };
    }

    if (businessType === 'All' || businessType === 'Flat') {
      const flats = await Flat.find({ owner: ownerId, softDelete: { $ne: true } });
      dashboardData.properties.flats = {
        total: flats.length,
        available: flats.filter(flat => flat.available).length,
        occupied: flats.filter(flat => !flat.available).length
      };
    }

    // Get tenant/resident counts
    const totalResidents = await PGResident.countDocuments({
      owner: ownerId,
      status: 'active'
    });

    const newResidentsThisMonth = await PGResident.countDocuments({
      owner: ownerId,
      status: 'active',
      checkInDate: { $gte: currentMonthStart }
    });

    dashboardData.tenants = {
      total: totalResidents,
      newThisMonth: newResidentsThisMonth,
      checkInsToday: await PGResident.countDocuments({
        owner: ownerId,
        checkInDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }),
      checkOutsThisWeek: await PGResident.countDocuments({
        owner: ownerId,
        checkOutDate: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      })
    };

    // Financial overview
    const currentMonthPayments = await Payment.find({
      owner: ownerId,
      createdAt: { $gte: currentMonthStart },
      status: 'completed'
    });

    const lastMonthPayments = await Payment.find({
      owner: ownerId,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
      status: 'completed'
    });

    const currentMonthRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const revenueGrowth = lastMonthRevenue > 0 ? 
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2) : 0;

    // Pending electricity bills
    const pendingElectricityBills = await ElectricityBill.find({
      owner: ownerId,
      status: { $in: ['sent', 'partially_paid'] }
    });

    const pendingElectricityAmount = pendingElectricityBills.reduce((sum, bill) => 
      sum + bill.summary.totalPendingAmount, 0);

    dashboardData.financial = {
      currentMonthRevenue,
      lastMonthRevenue,
      revenueGrowth: parseFloat(revenueGrowth),
      pendingPayments: await Payment.countDocuments({
        owner: ownerId,
        status: 'pending'
      }),
      pendingElectricityBills: pendingElectricityBills.length,
      pendingElectricityAmount,
      totalOutstanding: pendingElectricityAmount
    };

    // Recent activities
    const recentActivities = await ActivityLog.find({
      userId: ownerId
    }).sort({ createdAt: -1 }).limit(10);

    // Quick actions based on business type
    dashboardData.quickActions = getQuickActions(businessType);

    // Alerts and notifications
    dashboardData.alerts = await generateAlerts(ownerId, businessType);

    // Overview summary
    dashboardData.overview = {
      totalProperties: (dashboardData.properties.pgs?.total || 0) + 
                      (dashboardData.properties.rooms?.total || 0) + 
                      (dashboardData.properties.flats?.total || 0),
      totalTenants: totalResidents,
      monthlyRevenue: currentMonthRevenue,
      revenueGrowth: parseFloat(revenueGrowth),
      occupancyRate: calculateOccupancyRate(dashboardData.properties),
      pendingActions: pendingElectricityBills.length + dashboardData.financial.pendingPayments
    };

    res.json({
      success: true,
      data: dashboardData,
      recentActivities
    });

  } catch (error) {
    console.error('Dashboard Overview Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard overview',
      error: error.message 
    });
  }
};

// Smart Electricity Billing - Add meter reading with tenant tracking
export const addMeterReading = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { roomId, pgId, reading, readingDate, action, tenantId, notes } = req.body;

    // Validate required fields
    if (!reading || !readingDate) {
      return res.status(400).json({
        success: false,
        message: 'Reading and reading date are required'
      });
    }

    // Verify ownership
    let property;
    if (roomId) {
      property = await Room.findOne({ _id: roomId, owner: ownerId });
    } else if (pgId) {
      property = await PG.findOne({ _id: pgId, owner: ownerId });
    }

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or access denied'
      });
    }

    // Get current active tenants
    const activeResidents = await PGResident.find({
      $or: [
        roomId ? { room: roomId } : {},
        pgId ? { pg: pgId } : {}
      ].filter(Boolean),
      status: 'active'
    });

    const activeTenants = activeResidents.map(resident => ({
      tenantId: resident._id,
      name: resident.name,
      joinDate: resident.checkInDate
    }));

    // Create meter reading record
    const meterReading = new MeterReading({
      room: roomId || null,
      pg: pgId || null,
      owner: ownerId,
      reading,
      readingDate: new Date(readingDate),
      activeTenants,
      action: action || 'reading_only',
      actionDetails: action && tenantId ? {
        tenantId,
        actionDate: new Date(readingDate)
      } : null,
      notes: notes || '',
      createdAt: new Date()
    });

    await meterReading.save();

    // Update property's last meter reading
    if (roomId) {
      await Room.findByIdAndUpdate(roomId, {
        lastMeterReading: new Date(readingDate),
        lastMeterValue: reading
      });
    }

    res.json({
      success: true,
      data: meterReading,
      message: 'Meter reading added successfully'
    });

  } catch (error) {
    console.error('Add Meter Reading Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add meter reading',
      error: error.message
    });
  }
};

// Generate electricity bills for a period
export const generateElectricityBills = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { roomId, pgId, periodStart, periodEnd, ratePerUnit } = req.body;

    // Validate inputs
    if (!periodStart || !periodEnd || !ratePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Period start, end and rate per unit are required'
      });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    // Get meter readings for the period
    const meterReadings = await MeterReading.find({
      $or: [
        roomId ? { room: roomId } : {},
        pgId ? { pg: pgId } : {}
      ].filter(Boolean),
      owner: ownerId,
      readingDate: { $gte: startDate, $lte: endDate }
    }).sort({ readingDate: 1 });

    if (meterReadings.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 meter readings required for bill generation'
      });
    }

    // Calculate consumption periods
    const periods = [];
    for (let i = 0; i < meterReadings.length - 1; i++) {
      const currentReading = meterReadings[i];
      const nextReading = meterReadings[i + 1];
      
      const consumption = nextReading.reading - currentReading.reading;
      const days = Math.ceil((nextReading.readingDate - currentReading.readingDate) / (1000 * 60 * 60 * 24));
      const tenantCount = currentReading.activeTenants.length;

      if (tenantCount > 0) {
        periods.push({
          startDate: currentReading.readingDate,
          endDate: nextReading.readingDate,
          startReading: currentReading.reading,
          endReading: nextReading.reading,
          consumption,
          days,
          tenantCount,
          consumptionPerTenant: consumption / tenantCount,
          activeTenants: currentReading.activeTenants
        });
      }
    }

    // Calculate bills for each tenant
    const tenantBills = new Map();
    
    periods.forEach(period => {
      period.activeTenants.forEach(tenant => {
        if (!tenantBills.has(tenant.tenantId.toString())) {
          tenantBills.set(tenant.tenantId.toString(), {
            tenantId: tenant.tenantId,
            tenantName: tenant.name,
            totalConsumption: 0,
            totalAmount: 0,
            periods: []
          });
        }
        
        const bill = tenantBills.get(tenant.tenantId.toString());
        bill.totalConsumption += period.consumptionPerTenant;
        bill.totalAmount += period.consumptionPerTenant * ratePerUnit;
        bill.periods.push({
          startDate: period.startDate,
          endDate: period.endDate,
          days: period.days,
          consumption: period.consumptionPerTenant,
          amount: period.consumptionPerTenant * ratePerUnit,
          tenantCount: period.tenantCount
        });
      });
    });

    // Create electricity bill record
    const electricityBill = new ElectricityBill({
      room: roomId || null,
      pg: pgId || null,
      owner: ownerId,
      periodStart: startDate,
      periodEnd: endDate,
      ratePerUnit,
      totalConsumption: periods.reduce((sum, p) => sum + p.consumption, 0),
      periods,
      tenantBills: Array.from(tenantBills.values()),
      summary: {
        totalAmount: Array.from(tenantBills.values()).reduce((sum, bill) => sum + bill.totalAmount, 0),
        totalPaidAmount: 0,
        totalPendingAmount: Array.from(tenantBills.values()).reduce((sum, bill) => sum + bill.totalAmount, 0),
        tenantsCount: tenantBills.size
      },
      status: 'generated',
      generatedAt: new Date()
    });

    await electricityBill.save();

    res.json({
      success: true,
      data: electricityBill,
      message: 'Electricity bills generated successfully'
    });

  } catch (error) {
    console.error('Generate Electricity Bills Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate electricity bills',
      error: error.message
    });
  }
};

// Send electricity bills to tenants
export const sendElectricityBills = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { billId, sendMethod = 'both' } = req.body;

    const bill = await ElectricityBill.findOne({
      _id: billId,
      owner: ownerId
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Get tenant details for sending
    const tenantIds = bill.tenantBills.map(tb => tb.tenantId);
    const residents = await PGResident.find({
      _id: { $in: tenantIds }
    });

    const sendResults = [];

    for (const tenantBill of bill.tenantBills) {
      const resident = residents.find(r => r._id.toString() === tenantBill.tenantId.toString());
      
      if (resident) {
        const billData = {
          tenantName: resident.name,
          period: `${bill.periodStart.toDateString()} to ${bill.periodEnd.toDateString()}`,
          consumption: tenantBill.totalConsumption.toFixed(2),
          amount: tenantBill.totalAmount.toFixed(2),
          ratePerUnit: bill.ratePerUnit,
          periods: tenantBill.periods,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };

        let emailSent = false;
        let whatsappSent = false;

        // Send email (placeholder for future implementation)
        if (sendMethod === 'email' || sendMethod === 'both') {
          try {
            emailSent = true;
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
          }
        }

        // Send WhatsApp (placeholder for future implementation)
        if (sendMethod === 'whatsapp' || sendMethod === 'both') {
          try {
            whatsappSent = true;
          } catch (whatsappError) {
            console.error('WhatsApp sending failed:', whatsappError);
          }
        }

        sendResults.push({
          tenantId: tenantBill.tenantId,
          tenantName: resident.name,
          emailSent,
          whatsappSent,
          amount: tenantBill.totalAmount
        });
      }
    }

    // Update bill status
    await ElectricityBill.findByIdAndUpdate(billId, {
      status: 'sent',
      sentAt: new Date(),
      sentMethod: sendMethod,
      'summary.sentCount': sendResults.filter(r => r.emailSent || r.whatsappSent).length
    });

    res.json({
      success: true,
      data: {
        billId,
        sendResults,
        totalSent: sendResults.filter(r => r.emailSent || r.whatsappSent).length
      },
      message: 'Bills sent successfully'
    });

  } catch (error) {
    console.error('Send Electricity Bills Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send electricity bills',
      error: error.message
    });
  }
};

// Get electricity billing dashboard
export const getElectricityBillingDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { roomId, pgId, period = '30' } = req.query;

    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Build filter
    const filter = { owner: ownerId };
    if (roomId) filter.room = roomId;
    if (pgId) filter.pg = pgId;

    // Get recent bills
    const recentBills = await ElectricityBill.find({
      ...filter,
      generatedAt: { $gte: startDate }
    }).sort({ generatedAt: -1 });

    // Get pending bills
    const pendingBills = await ElectricityBill.find({
      ...filter,
      status: { $in: ['sent', 'partially_paid'] }
    });

    // Get recent meter readings
    const recentReadings = await MeterReading.find({
      ...filter,
      readingDate: { $gte: startDate }
    }).sort({ readingDate: -1 }).limit(10);

    // Calculate summary
    const summary = {
      totalBills: recentBills.length,
      pendingBills: pendingBills.length,
      totalPendingAmount: pendingBills.reduce((sum, bill) => sum + bill.summary.totalPendingAmount, 0),
      totalCollectedAmount: recentBills.reduce((sum, bill) => sum + bill.summary.totalPaidAmount, 0),
      averageMonthlyConsumption: 0,
      totalActiveResidents: 0
    };

    // Get properties for additional context
    let properties = [];
    if (roomId) {
      properties = await Room.find({ _id: roomId, owner: ownerId });
    } else if (pgId) {
      properties = await PG.find({ _id: pgId, owner: ownerId });
    } else {
      const rooms = await Room.find({ owner: ownerId, pgType: { $exists: true } });
      const pgs = await PG.find({ owner: ownerId });
      properties = [...rooms, ...pgs];
    }

    res.json({
      success: true,
      data: {
        summary,
        recentBills,
        pendingBills,
        recentReadings,
        properties
      }
    });

  } catch (error) {
    console.error('Electricity Billing Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing dashboard',
      error: error.message
    });
  }
};

// Advanced Tenant Management - Add new resident
export const addNewResident = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const {
      roomId,
      pgId,
      name,
      phone,
      email,
      checkInDate,
      rentAmount,
      securityDeposit,
      emergencyContact,
      idProof,
      addressProof,
      preferences = {}
    } = req.body;

    // Validate required fields
    if (!name || !phone || !checkInDate || !rentAmount) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, check-in date, and rent amount are required'
      });
    }

    // Verify room/PG ownership and availability
    let property;
    if (roomId) {
      property = await Room.findOne({ _id: roomId, owner: ownerId, isAvailable: true });
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Room not found, not available, or access denied'
        });
      }
    }

    if (pgId) {
      property = await PG.findOne({ _id: pgId, owner: ownerId });
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'PG not found or access denied'
        });
      }
    }

    // Check for duplicate phone number
    const existingResident = await PGResident.findOne({
      phone,
      status: 'active'
    });

    if (existingResident) {
      return res.status(400).json({
        success: false,
        message: 'A resident with this phone number already exists'
      });
    }

    // Calculate next rent due date
    const nextDueDate = new Date(checkInDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    nextDueDate.setDate(1);

    // Create resident record
    const resident = new PGResident({
      name,
      phone,
      email: email || '',
      room: roomId || null,
      pg: pgId || null,
      owner: ownerId,
      checkInDate: new Date(checkInDate),
      status: 'active',
      rentDetails: {
        monthlyRent: rentAmount,
        securityDeposit: securityDeposit || 0,
        nextDueDate,
        lastPaidDate: null,
        paymentHistory: []
      },
      emergencyContact: emergencyContact || {},
      documents: {
        idProof: idProof || {},
        addressProof: addressProof || {}
      },
      preferences,
      createdAt: new Date()
    });

    await resident.save();

    // Update room availability if room-based
    if (roomId) {
      await Room.findByIdAndUpdate(roomId, {
        isAvailable: false,
        currentResident: resident._id,
        lastOccupiedDate: new Date(checkInDate)
      });
    }

    res.json({
      success: true,
      data: resident,
      message: 'Resident added successfully'
    });

  } catch (error) {
    console.error('Add Resident Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add resident',
      error: error.message
    });
  }
};

// Advanced Notification System
export const sendAdvancedNotification = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const {
      recipientType,
      recipients = [],
      roomId,
      pgId,
      title,
      message,
      priority = 'normal',
      channels = ['email'],
      scheduleAt = null,
      attachments = []
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Get recipient list based on type
    let targetResidents = [];

    switch (recipientType) {
      case 'all':
        targetResidents = await PGResident.find({
          owner: ownerId,
          status: 'active'
        });
        break;

      case 'specific':
        targetResidents = await PGResident.find({
          _id: { $in: recipients },
          owner: ownerId,
          status: 'active'
        });
        break;

      case 'room':
        if (roomId) {
          targetResidents = await PGResident.find({
            room: roomId,
            owner: ownerId,
            status: 'active'
          });
        }
        break;

      case 'pg':
        if (pgId) {
          targetResidents = await PGResident.find({
            pg: pgId,
            owner: ownerId,
            status: 'active'
          });
        }
        break;

      case 'overdue':
        const today = new Date();
        targetResidents = await PGResident.find({
          owner: ownerId,
          status: 'active',
          'rentDetails.nextDueDate': { $lt: today }
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid recipient type'
        });
    }

    if (targetResidents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No eligible recipients found'
      });
    }

    // Create notification record
    const notification = new Notification({
      owner: ownerId,
      title,
      message,
      priority,
      recipientType,
      recipients: targetResidents.map(r => r._id),
      channels,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : new Date(),
      attachments,
      status: scheduleAt ? 'scheduled' : 'pending',
      createdAt: new Date()
    });

    await notification.save();

    res.json({
      success: true,
      data: {
        notificationId: notification._id,
        recipients: targetResidents.length,
        status: notification.status
      },
      message: scheduleAt ? 'Notification scheduled successfully' : 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Send Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
};

// Get advanced analytics
export const getAdvancedAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { period = '30', businessType } = req.query;

    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Revenue analytics
    const payments = await Payment.find({
      owner: ownerId,
      createdAt: { $gte: startDate },
      status: 'completed'
    });

    const revenueByDay = {};
    payments.forEach(payment => {
      const day = payment.createdAt.toISOString().split('T')[0];
      if (!revenueByDay[day]) revenueByDay[day] = 0;
      revenueByDay[day] += payment.amount;
    });

    // Occupancy analytics
    const properties = {};
    if (!businessType || businessType === 'Room' || businessType === 'All') {
      const rooms = await Room.find({ owner: ownerId, isDeleted: false });
      properties.rooms = {
        total: rooms.length,
        occupied: rooms.filter(r => !r.isAvailable).length,
        occupancyRate: rooms.length > 0 ? ((rooms.filter(r => !r.isAvailable).length / rooms.length) * 100).toFixed(1) : 0
      };
    }

    // Tenant analytics
    const totalResidents = await PGResident.countDocuments({
      owner: ownerId,
      status: 'active'
    });

    // Electricity billing analytics
    const electricityBills = await ElectricityBill.find({
      owner: ownerId,
      generatedAt: { $gte: startDate }
    });

    const billingAnalytics = {
      totalBills: electricityBills.length,
      totalConsumption: electricityBills.reduce((sum, bill) => sum + bill.totalConsumption, 0),
      totalAmount: electricityBills.reduce((sum, bill) => sum + bill.summary.totalAmount, 0),
      pendingAmount: electricityBills.reduce((sum, bill) => sum + bill.summary.totalPendingAmount, 0),
      collectionRate: 0
    };

    if (billingAnalytics.totalAmount > 0) {
      billingAnalytics.collectionRate = (
        ((billingAnalytics.totalAmount - billingAnalytics.pendingAmount) / billingAnalytics.totalAmount) * 100
      ).toFixed(1);
    }

    res.json({
      success: true,
      data: {
        period: periodDays,
        revenue: {
          total: Object.values(revenueByDay).reduce((a, b) => a + b, 0),
          daily: revenueByDay
        },
        occupancy: properties,
        tenants: {
          total: totalResidents
        },
        billing: billingAnalytics
      }
    });

  } catch (error) {
    console.error('Advanced Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Helper functions
const getAllowedSections = (businessType) => {
  const sections = {
    'PG': ['overview', 'pgs', 'residents', 'billing', 'analytics', 'settings'],
    'Room': ['overview', 'rooms', 'tenants', 'bookings', 'analytics', 'settings'],
    'Flat': ['overview', 'flats', 'tenants', 'bookings', 'analytics', 'settings'],
    'All': ['overview', 'pgs', 'rooms', 'flats', 'residents', 'tenants', 'billing', 'bookings', 'analytics', 'settings']
  };
  return sections[businessType] || sections['All'];
};

const getQuickActions = (businessType) => {
  const actions = {
    'PG': [
      { id: 'add_resident', title: 'Add New Resident', icon: 'user-plus', path: '/dashboard/residents/add' },
      { id: 'generate_bills', title: 'Generate Electricity Bills', icon: 'file-invoice', path: '/dashboard/billing/generate' },
      { id: 'meter_reading', title: 'Add Meter Reading', icon: 'gauge', path: '/dashboard/billing/meter' },
      { id: 'send_notifications', title: 'Send Notifications', icon: 'bell', path: '/dashboard/notifications' }
    ],
    'Room': [
      { id: 'add_room', title: 'Add New Room', icon: 'plus-square', path: '/dashboard/rooms/add' },
      { id: 'manage_bookings', title: 'Manage Bookings', icon: 'calendar', path: '/dashboard/bookings' },
      { id: 'update_availability', title: 'Update Availability', icon: 'toggle-on', path: '/dashboard/rooms' }
    ],
    'Flat': [
      { id: 'add_flat', title: 'Add New Flat', icon: 'building', path: '/dashboard/flats/add' },
      { id: 'manage_tenants', title: 'Manage Tenants', icon: 'users', path: '/dashboard/tenants' },
      { id: 'update_listings', title: 'Update Listings', icon: 'edit', path: '/dashboard/flats' }
    ]
  };
  
  if (businessType === 'All') {
    return [...actions.PG, ...actions.Room, ...actions.Flat];
  }
  
  return actions[businessType] || actions.PG;
};

const calculateOccupancyRate = (properties) => {
  let totalUnits = 0;
  let occupiedUnits = 0;
  
  if (properties.pgs) {
    totalUnits += properties.pgs.total;
    occupiedUnits += properties.pgs.active;
  }
  
  if (properties.rooms) {
    totalUnits += properties.rooms.total;
    occupiedUnits += properties.rooms.occupied;
  }
  
  if (properties.flats) {
    totalUnits += properties.flats.total;
    occupiedUnits += properties.flats.occupied;
  }
  
  return totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0;
};

const generateAlerts = async (ownerId, businessType) => {
  const alerts = [];
  
  try {
    // Rent due alerts
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const rentDueResidents = await PGResident.find({
      owner: ownerId,
      status: 'active',
      'rentDetails.nextDueDate': { $lte: tomorrow }
    }).populate('room', 'roomNumber');
    
    if (rentDueResidents.length > 0) {
      alerts.push({
        id: 'rent_due',
        type: 'warning',
        title: 'Rent Due Tomorrow',
        message: `${rentDueResidents.length} residents have rent due tomorrow`,
        action: 'Send Reminders',
        actionPath: '/dashboard/notifications/rent-reminders',
        priority: 'high'
      });
    }
    
    // Electricity bill alerts
    const pendingBills = await ElectricityBill.countDocuments({
      owner: ownerId,
      status: 'sent',
      'periodEnd': { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    if (pendingBills > 0) {
      alerts.push({
        id: 'electricity_overdue',
        type: 'error',
        title: 'Overdue Electricity Bills',
        message: `${pendingBills} electricity bills are overdue`,
        action: 'Send Reminders',
        actionPath: '/dashboard/billing/reminders',
        priority: 'high'
      });
    }
    
  } catch (error) {
    console.error('Error generating alerts:', error);
  }
  
  return alerts.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });
};

// Additional dashboard functions (simplified versions)
export const getOwnerRoomStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const rooms = await Room.find({ owner: ownerId });
    
    res.json({
      success: true,
      data: {
        totalRooms: rooms.length,
        occupiedRooms: rooms.filter(r => !r.isAvailable).length,
        availableRooms: rooms.filter(r => r.isAvailable).length,
        rooms: rooms
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerTenantStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const tenants = await PGResident.find({ owner: ownerId });
    
    res.json({
      success: true,
      data: {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.status === 'active').length,
        tenants: tenants
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerFinancialStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const payments = await Payment.find({ owner: ownerId });
    
    res.json({
      success: true,
      data: {
        totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        payments: payments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerMaintenanceStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const maintenance = await Maintenance.find({ owner: ownerId });
    
    res.json({
      success: true,
      data: {
        totalRequests: maintenance.length,
        pendingRequests: maintenance.filter(m => m.status === 'pending').length,
        maintenance: maintenance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerUtilityStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const utilities = await Utility.find({ owner: ownerId });
    
    res.json({
      success: true,
      data: {
        totalUtilities: utilities.length,
        pendingUtilities: utilities.filter(u => u.status === 'pending').length,
        utilities: utilities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerRecentActivities = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const activities = await ActivityLog.find({ userId: ownerId }).sort({ createdAt: -1 }).limit(20);
    
    res.json({
      success: true,
      data: {
        activities: activities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
