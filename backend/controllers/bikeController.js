import Bike from '../models/Bike.js';

// Create Bike
export const createBike = async (req, res) => {
  try {
    const bike = new Bike({
      ...req.body,
      owner_id: req.user._id,
      status: 'pending',
      verificationStatus: 'pending',
      softDelete: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    await bike.save();
    res.status(201).json(bike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bikes for owner (exclude soft deleted)
export const getOwnerBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({ owner_id: req.user._id, softDelete: false });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bike by ID
export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, owner_id: req.user._id, softDelete: false });
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update bike
export const updateBike = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    const bike = await Bike.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id, softDelete: false },
      updateData,
      { new: true }
    );
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete bike (soft delete)
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id, softDelete: false },
      { softDelete: true, status: 'deleted', updated_at: new Date() },
      { new: true }
    );
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json({ message: 'Bike deleted', bike });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
