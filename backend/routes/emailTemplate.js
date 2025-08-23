const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');

// Advanced email template search/filter endpoint
router.post('/search', async (req, res) => {
  const { query, filters, sort, page, limit } = req.body;
  try {
    // TODO: Implement advanced search/filter logic
    // Example: Use MongoDB aggregation for flexible search
    const templates = await EmailTemplate.aggregate([
      { $match: filters || {} },
      { $sort: sort || { createdAt: -1 } },
      { $skip: ((page || 1) - 1) * (limit || 20) },
      { $limit: limit || 20 },
    ]);
    res.status(200).json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;