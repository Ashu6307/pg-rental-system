// PG Controller for Owner PG CRUD
import PG from '../models/PG.js';

// Create a new PG
export const createPG = async (req, res) => {
  try {
    const pg = new PG(req.body);
    await pg.save();
    res.status(201).json(pg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all PGs for an owner
export const getOwnerPGs = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const pgs = await PG.find({ owner: ownerId, softDelete: false });
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single PG by ID
export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg || pg.softDelete) return res.status(404).json({ error: 'PG not found' });
    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update PG
export const updatePG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pg || pg.softDelete) return res.status(404).json({ error: 'PG not found' });
    res.json(pg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete PG
export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(req.params.id, { softDelete: true }, { new: true });
    if (!pg) return res.status(404).json({ error: 'PG not found' });
    res.json({ message: 'PG deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
