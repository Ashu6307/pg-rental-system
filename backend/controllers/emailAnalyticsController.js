import EmailLog from '../models/EmailLog.js';
import EmailCampaign from '../models/EmailCampaign.js';
import User from '../models/User.js';

// Get Email Dashboard Overview
export const getEmailDashboard = async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Email stats for last 30 days
    const [
      totalEmailsLast30Days,
      successfulEmailsLast30Days,
      failedEmailsLast30Days,
      totalEmailsLast7Days,
      activeCampaigns,
      recentCampaigns,
      emailTypeStats,
      topPerformingCampaigns
    ] = await Promise.all([
      EmailLog.countDocuments({ sentAt: { $gte: last30Days } }),
      EmailLog.countDocuments({ sentAt: { $gte: last30Days }, status: { $in: ['sent', 'delivered'] } }),
      EmailLog.countDocuments({ sentAt: { $gte: last30Days }, status: 'failed' }),
      EmailLog.countDocuments({ sentAt: { $gte: last7Days } }),
      EmailCampaign.countDocuments({ status: { $in: ['scheduled', 'sending'] } }),
      EmailCampaign.find({}).sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),
      
      // Email type breakdown
      EmailLog.aggregate([
        { $match: { sentAt: { $gte: last30Days } } },
        { $group: { _id: '$emailType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Top performing campaigns
      EmailCampaign.find({ status: 'sent' })
        .sort({ 'stats.emailsOpened': -1 })
        .limit(5)
        .select('name type stats')
    ]);

    // User subscription stats
    const [
      totalUsers,
      newsletterSubscribers,
      promotionalSubscribers
    ] = await Promise.all([
      User.countDocuments({ emailVerified: true }),
      User.countDocuments({ emailVerified: true, 'emailPreferences.newsletter': { $ne: false } }),
      User.countDocuments({ emailVerified: true, 'emailPreferences.promotional': { $ne: false } })
    ]);

    // Calculate delivery rate
    const deliveryRate = totalEmailsLast30Days > 0 
      ? ((successfulEmailsLast30Days / totalEmailsLast30Days) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      dashboard: {
        overview: {
          totalEmailsLast30Days,
          successfulEmailsLast30Days,
          failedEmailsLast30Days,
          totalEmailsLast7Days,
          deliveryRate: parseFloat(deliveryRate),
          activeCampaigns
        },
        userStats: {
          totalUsers,
          newsletterSubscribers,
          promotionalSubscribers,
          unsubscribedUsers: totalUsers - promotionalSubscribers
        },
        recentCampaigns,
        emailTypeStats,
        topPerformingCampaigns
      }
    });

  } catch (error) {
    console.error('Email dashboard error:', error);
    res.status(500).json({ success: false, error: 'Failed to get email dashboard' });
  }
};

// Get Email Logs with Filters
export const getEmailLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      emailType,
      status,
      recipient,
      campaignId,
      dateFrom,
      dateTo,
      sortBy = 'sentAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    if (emailType) filter.emailType = emailType;
    if (status) filter.status = status;
    if (recipient) filter.recipient = new RegExp(recipient, 'i');
    if (campaignId) filter.campaignId = campaignId;
    
    if (dateFrom || dateTo) {
      filter.sentAt = {};
      if (dateFrom) filter.sentAt.$gte = new Date(dateFrom);
      if (dateTo) filter.sentAt.$lte = new Date(dateTo);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [logs, totalLogs] = await Promise.all([
      EmailLog.find(filter)
        .populate('userId', 'name email')
        .populate('sentBy', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      EmailLog.countDocuments(filter)
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / parseInt(limit)),
        totalLogs,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Email logs error:', error);
    res.status(500).json({ success: false, error: 'Failed to get email logs' });
  }
};

// Get Campaign Details
export const getCampaignDetails = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await EmailCampaign.findById(campaignId)
      .populate('createdBy', 'name email');

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    // Get campaign email logs
    const campaignLogs = await EmailLog.find({ campaignId })
      .populate('userId', 'name email')
      .sort({ sentAt: -1 })
      .limit(100);

    // Calculate detailed stats
    const detailedStats = await EmailLog.aggregate([
      { $match: { campaignId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      campaign,
      logs: campaignLogs,
      detailedStats
    });

  } catch (error) {
    console.error('Campaign details error:', error);
    res.status(500).json({ success: false, error: 'Failed to get campaign details' });
  }
};

// Get Email Analytics
export const getEmailAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const today = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { sentAt: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { sentAt: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { sentAt: { $gte: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { sentAt: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    // Daily email volume
    const dailyVolume = await EmailLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$sentAt' },
            month: { $month: '$sentAt' },
            day: { $dayOfMonth: '$sentAt' }
          },
          count: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [{ $in: ['$status', ['sent', 'delivered']] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Email type performance
    const typePerformance = await EmailLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$emailType',
          total: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [{ $in: ['$status', ['sent', 'delivered']] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$successful', '$total'] },
              100
            ]
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Campaign performance
    const campaignPerformance = await EmailCampaign.find({ status: 'sent' })
      .select('name type stats createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      analytics: {
        period,
        dailyVolume,
        typePerformance,
        campaignPerformance
      }
    });

  } catch (error) {
    console.error('Email analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to get email analytics' });
  }
};

// Delete Email Logs (Admin only - for cleanup)
export const deleteEmailLogs = async (req, res) => {
  try {
    const { olderThan } = req.body; // Number of days
    
    if (!olderThan || olderThan < 30) {
      return res.status(400).json({ 
        success: false, 
        error: 'Must be at least 30 days old' 
      });
    }

    const cutoffDate = new Date(Date.now() - olderThan * 24 * 60 * 60 * 1000);
    
    const result = await EmailLog.deleteMany({ 
      sentAt: { $lt: cutoffDate },
      status: { $in: ['sent', 'failed'] } // Keep delivered/opened for analytics
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} old email logs`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Delete email logs error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete email logs' });
  }
};
