# Dynamic Offer System

## Overview
The offer system has been converted from static sample data to a fully dynamic database-driven system. Now offers are stored in MongoDB and can be managed through admin APIs.

## Changes Made

### 1. Updated Offer Model (`models/Offer.js`)
- Converted to ES6 imports
- Added new fields: `title`, `discount`, `validUntil`, `type`
- Added backward compatibility for existing fields
- Added validation and middleware for data consistency

### 2. Dynamic Offers Route (`routes/offersSimple.js`)
- **Removed**: Hard-coded sample data
- **Added**: Database integration with MongoDB
- **Added**: Query filtering by type, active status
- **Added**: Automatic expiry checking
- **Added**: Individual offer retrieval by ID
- **Added**: Proper error handling and responses

### 3. Enhanced Offer Controller (`controllers/offerController.js`)
- Converted to ES6 imports and exports
- Added pagination support
- Enhanced validation
- Better error handling
- Added getOfferById method

### 4. Seed Script (`scripts/seedOffers.js`)
- Initial offers data for testing
- Can be run to populate database with sample offers

## API Endpoints

### GET `/api/offers/`
Fetch all active offers with optional filtering

**Query Parameters:**
- `type`: Filter by offer type (`pg`, `room`, `both`)
- `active`: Filter by active status (`true`, `false`)
- `limit`: Number of offers to return (default: 10)

**Response:**
```json
{
  "success": true,
  "offers": [...],
  "count": 5,
  "message": "Found 5 offers"
}
```

### GET `/api/offers/:id`
Get specific offer by ID

**Response:**
```json
{
  "success": true,
  "offer": {
    "id": "...",
    "title": "Special Discount",
    "description": "...",
    "discount": "20%",
    "validUntil": "2025-12-31",
    "type": "pg",
    "active": true,
    "imageUrl": "..."
  }
}
```

## Admin Management

Offers can be managed through the existing offer controller endpoints:
- `POST /api/admin/offers` - Create new offer
- `PUT /api/admin/offers/:id` - Update offer
- `DELETE /api/admin/offers/:id` - Delete offer
- `GET /api/admin/offers` - List all offers with pagination

## Database Schema

```javascript
{
  title: String (required),
  name: String (required),
  description: String (required),
  discount: String (required), // e.g., "20%", "₹500 off"
  validUntil: Date (required),
  type: String (enum: ['pg', 'room', 'both']),
  images: [String],
  imageUrl: String,
  isActive: Boolean,
  active: Boolean, // Synced with isActive
  createdBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

1. **Run the seed script** to populate initial offers:
   ```bash
   cd backend
   node scripts/seedOffers.js
   ```

2. **Update your frontend** to handle the new response format:
   - Offers are now in `response.offers` array
   - Each offer has an `id` field instead of hardcoded numbers
   - New fields available: `validUntil`, `type`, etc.

3. **Environment Variables**: Ensure `MONGODB_URI` is set in your `.env` file

## Features

✅ **Dynamic Data**: Offers loaded from database
✅ **Filtering**: By type, active status
✅ **Expiry Handling**: Automatic filtering of expired offers
✅ **Error Handling**: Comprehensive error responses
✅ **Backward Compatibility**: Existing frontend code should work
✅ **Admin Management**: Full CRUD operations
✅ **Performance**: Optimized queries with lean() and select()
✅ **Validation**: Input validation for all fields

## Migration Notes

- **Sample data removed**: The 3 hardcoded offers are no longer returned
- **New response format**: Includes `success`, `count`, and `message` fields
- **Automatic expiry**: Only valid offers are returned by default
- **ID format**: Uses MongoDB ObjectId instead of incremental numbers

The system is now fully dynamic and ready for production use!