
import express from 'express';
import PG from '../models/PG.js';
import OwnerProfile from '../models/OwnerProfile.js';
import { authenticateJWT, ownerAuth } from '../middleware/auth.js';
import { logAction } from '../utils/auditLogService.js';

const router = express.Router();

// Public random PGs for homepage/listing
router.get('/public', async (req, res) => {
  try {
    // 8 random active PGs (not deleted/pending/rejected)
    const pgs = await PG.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: 8 } }
    ]);
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PG Routes for Owner PG CRUD
// Create PG
router.post('/', ownerAuth, async (req, res) => {
  try {
    // KYC approval check
    const ownerProfile = await OwnerProfile.findOne({ owner_id: req.user.id });
    if (!ownerProfile || ownerProfile.approval_status !== 'approved') {
      return res.status(403).json({ error: 'KYC approval required. Please complete your profile.' });
    }

    const pg = new PG(req.body);
    await pg.save();
    // Audit log
    await logAction({
      action: 'PG Created',
      performedBy: req.user.id,
      targetId: pg._id,
      targetType: 'PG',
      details: req.body
    });
    res.status(201).json(pg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all PGs for owner
router.get('/', ownerAuth, async (req, res) => {
  try {
    const pgs = await PG.find({ owner_id: req.user.id });
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single PG by ID
router.get('/:id', ownerAuth, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ error: 'PG not found' });
    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update PG
router.put('/:id', ownerAuth, async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pg) return res.status(404).json({ error: 'PG not found' });
    res.json(pg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft delete PG
router.delete('/:id', ownerAuth, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ error: 'PG not found' });
    pg.status = 'deleted';
    await pg.save();
    res.json({ message: 'PG soft deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
