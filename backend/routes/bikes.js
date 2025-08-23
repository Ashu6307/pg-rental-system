
import express from 'express';
import Bike from '../models/Bike.js';
import {
  createBike,
  getOwnerBikes,
  getBikeById,
  updateBike,
  deleteBike
} from '../controllers/bikeController.js';
import { ownerAuth } from '../middleware/auth.js';
import { authenticateJWT } from '../middleware/auth.js';
import { logAction } from '../utils/auditLogService.js';

const router = express.Router();

// Public random bikes for homepage/listing
router.get('/public', async (req, res) => {
  try {
    // 8 random approved & available bikes
    const bikes = await Bike.aggregate([
      { $match: { status: 'approved', softDelete: { $ne: true }, available: true } },
      { $sample: { size: 8 } }
    ]);
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner Bike CRUD (advanced fields supported)
router.post('/', ownerAuth, createBike);
// Owner-specific listing
router.get('/owner', ownerAuth, getOwnerBikes);
router.get('/:id', ownerAuth, getBikeById);
router.put('/:id', ownerAuth, updateBike);
router.delete('/:id', ownerAuth, deleteBike);

// Create Bike
router.post('/', authenticateJWT, async (req, res) => {
  try {
    // KYC approval check
    const ownerProfile = await OwnerProfile.findOne({ owner_id: req.user.id });
    if (!ownerProfile || ownerProfile.approval_status !== 'approved') {
      return res.status(403).json({ error: 'KYC approval required. Please complete your profile.' });
    }
    // Terms & Conditions check for owner
    const owner = await User.findById(req.user.id);
    if (!owner.data_consent) {
      return res.status(403).json({ error: 'You must accept Terms & Conditions before adding a product.' });
    }
    const bike = new Bike(req.body);
    await bike.save();
    // Audit log
    await logAction({
      action: 'Bike Created',
      performedBy: req.user.id,
      targetId: bike._id,
      targetType: 'Bike',
      details: req.body
    });
    res.status(201).json(bike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Bikes
// Get all active Bikes
// Public listing for all users
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'approved', softDelete: { $ne: true }, available: true });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Bike by ID
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Bike
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft delete Bike
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    bike.status = 'deleted';
    await bike.save();
    res.json({ message: 'Bike soft deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Advanced bike search/filter endpoint
router.post('/search', async (req, res) => {
  const { query, filters, sort, page, limit } = req.body;
  try {
    // TODO: Implement advanced search/filter logic
    // Example: Use MongoDB aggregation for flexible search
    const bikes = await Bike.aggregate([
      { $match: filters || {} },
      { $sort: sort || { createdAt: -1 } },
      { $skip: ((page || 1) - 1) * (limit || 20) },
      { $limit: limit || 20 },
    ]);
    res.status(200).json({ success: true, bikes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
