// adminNotificationController.js
// Industry-level notification controller for Admin Dashboard
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const notificationService = require('../utils/notificationService');

// List notifications (with filters)
exports.listNotifications = async (req, res) => {
  try {
    const { type, channel, status, user, dateFrom, dateTo } = req.query;
    const query = {};
    if (type) query.type = type;
    if (channel) query.channel = channel;
    if (status) query.status = status;
    if (user) query.user = user;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    const notifications = await Notification.find(query).populate('user').sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Send notification (multi-channel)
exports.sendNotification = async (req, res) => {
  try {
    const { userIds, title, message, channel, templateId } = req.body;
    let results = [];
    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (!user) continue;
      let result = {};
      if (channel === 'email') {
        result = await sendEmail(user.email, title, message, templateId);
      } else {
        result = await notificationService.send(user, title, message, channel, templateId);
      }
      await Notification.create({ user: userId, title, message, channel, status: result.success ? 'sent' : 'failed', details: result });
      results.push(result);
    }
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};

// Get notification templates
exports.listTemplates = async (req, res) => {
  try {
    // Assume templates are stored in DB or static file
    const templates = await notificationService.getTemplates();
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Test notification (send to test user)
exports.testNotification = async (req, res) => {
  try {
    const { channel, templateId } = req.body;
    // Use a test user/email for sending
    const testUser = await User.findOne({ role: 'admin' });
    if (!testUser) return res.status(404).json({ error: 'No test user found' });
    let result = {};
    if (channel === 'email') {
      result = await sendEmail(testUser.email, 'Test Notification', 'This is a test notification.', templateId);
    } else {
      result = await notificationService.send(testUser, 'Test Notification', 'This is a test notification.', channel, templateId);
    }
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send test notification' });
  }
};
