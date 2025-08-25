import express from 'express';
import PG from '../models/PG.js';

const router = express.Router();

// Public PGs with filtering and sorting
router.get('/public', async (req, res) => {
  try {
    const { 
      search, 
      pgType, 
      genderAllowed,
      sort = 'price_low',
      limit = 20
    } = req.query;

    // Build filter object
    let filter = { 
      status: 'active', 
      softDelete: { $ne: true }
    };

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // PG Type filter
    if (pgType) {
      filter.pgType = pgType;
    }

    // Gender filter
    if (genderAllowed) {
      filter.$or = [
        { genderAllowed: genderAllowed },
        { genderAllowed: 'both' }
      ];
    }

    // Sorting
    let sortObj = {};
    switch (sort) {
      case 'price_low':
        sortObj = { price: 1 };
        break;
      case 'price_high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.overall': -1 };
        break;
      case 'popular':
        sortObj = { 'analytics.views': -1 };
        break;
      default:
        sortObj = { price: 1 };
    }

    const pgs = await PG.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit));

    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all active PGs
router.get('/', async (req, res) => {
  try {
    const pgs = await PG.find({ status: 'active', softDelete: { $ne: true } });
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add PG (enforce T&C consent)
router.post('/', async (req, res) => {
  try {
    const ownerId = req.body.owner_id;
    const { default: User } = await import('../models/User.js');
    const owner = await User.findById(ownerId);
    if (!owner || !owner.data_consent) {
      return res.status(403).json({ error: 'You must accept Terms & Conditions before adding a PG.' });
    }
    const pg = new PG(req.body);
    await pg.save();
    res.status(201).json({ success: true, pg });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;