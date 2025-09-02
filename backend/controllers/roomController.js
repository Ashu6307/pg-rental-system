// Enhanced Room Controller with Industry-Level Features
import Room from '../models/Room.js';

// Create a new Room with enhanced validation
export const createRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      owner: req.user._id,
      status: 'Active', // Set status as Active by default
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const room = new Room(roomData);
    await room.save();
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    console.error('Create Room Error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
};

// Get all rooms with basic filtering
export const getAllRooms = async (req, res) => {
  try {
    console.log('getAllRooms API called');
    
    // Simple query to get all rooms
    const rooms = await Room.find({}).limit(20).lean();
    console.log('Found rooms:', rooms.length);
    
    // Add some computed fields for frontend compatibility
    const enrichedRooms = rooms.map(room => {
      const { viewCount, ...roomWithoutViewCount } = room;
      return {
        ...roomWithoutViewCount,
        averageRating: room.rating?.overall || 0,
        viewCount: room.analytics?.views?.total || 0
      };
    });
    
    res.status(200).json({
      success: true,
      data: enrichedRooms,
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(rooms.length / 20),
        totalItems: rooms.length,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false
      },
      filters: {
        priceRange: {},
        location: null
      }
    });
  } catch (error) {
    console.error('Get All Rooms Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
};

// Get room by ID with complete details
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findById(id)
      .populate('owner', 'name email phone verified businessType profileImage')
      .lean();

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Increment view count
    await Room.findByIdAndUpdate(id, { 
      $inc: { 'analytics.views': 1 } 
    });

    // Add computed fields
    const enrichedRoom = {
      ...room,
      averageRating: room.rating?.overall || 0,
      viewCount: (room.analytics?.views || 0) + 1
    };

    res.status(200).json({
      success: true,
      data: enrichedRoom
    });
  } catch (error) {
    console.error('Get Room By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room',
      error: error.message
    });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Authorization check
    if (room.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    console.error('Update Room Error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Authorization check
    if (room.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message
    });
  }
};

// Get rooms by owner
export const getRoomsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId || req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    let query = { owner: ownerId };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      data: rooms,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get Rooms By Owner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner rooms',
      error: error.message
    });
  }
};

// Add review to room
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, categories } = req.body;
    const userId = req.user._id;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user already reviewed
    const existingReview = room.reviews?.find(r => r.user.toString() === userId.toString());
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this room'
      });
    }

    const newReview = {
      user: userId,
      rating: rating,
      review: review,
      categories: categories || {},
      createdAt: new Date()
    };

    if (!room.reviews) room.reviews = [];
    room.reviews.push(newReview);
    
    // Update rating
    if (!room.rating) room.rating = {};
    room.rating.overall = room.reviews.reduce((acc, rev) => acc + rev.rating, 0) / room.reviews.length;

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: newReview
    });
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

export default {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByOwner,
  addReview
};