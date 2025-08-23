// softDeleteController.js
// Industry-level soft delete + audit log controller
const AuditLog = require('../models/AuditLog');

// Generic soft delete for any model
exports.softDelete = async (req, res) => {
  try {
    const { model, id, userId } = req.body;
    const Model = require(`../models/${model}`);
    const doc = await Model.findById(id);
    if (!doc) return res.status(404).json({ error: `${model} not found` });
    doc.status = 'deleted';
    await doc.save();
    await AuditLog.create({ action: 'soft_delete', user: userId, targetType: model, targetId: id, details: { status: 'deleted' } });
    res.json({ success: true, message: `${model} soft deleted`, doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete' });
  }
};

// Restore soft deleted record
exports.restore = async (req, res) => {
  try {
    const { model, id, userId } = req.body;
    const Model = require(`../models/${model}`);
    const doc = await Model.findById(id);
    if (!doc) return res.status(404).json({ error: `${model} not found` });
    doc.status = 'active';
    await doc.save();
    await AuditLog.create({ action: 'restore', user: userId, targetType: model, targetId: id, details: { status: 'active' } });
    res.json({ success: true, message: `${model} restored`, doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore' });
  }
};
