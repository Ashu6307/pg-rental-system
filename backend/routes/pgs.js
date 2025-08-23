import express from 'express';
import PG from '../models/PG.js';

const router = express.Router();

// Public random PGs for homepage/listing
router.get('/public', async (req, res) => {
  try {
    // 8 random active PGs
    const pgs = await PG.aggregate([
      { $match: { status: 'active', softDelete: { $ne: true } } },
      { $sample: { size: 8 } }
    ]);
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