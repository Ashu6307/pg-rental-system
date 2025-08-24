// Optimized PG Data Structure for Different Use Cases

// 1. LISTING PAGE - Light Version (~1KB)
const pgListingData = {
  "_id": "6891cd4c5b208cf60dc82a24",
  "name": "PG Residency Premium",
  "price": 8000,
  "originalPrice": 10000,
  "location": {
    "city": "Delhi",
    "area": "Sector 15"
  },
  "images": [{
    "url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
    "isPrimary": true
  }],
  "rating": {
    "overall": 4.5,
    "total": 45
  },
  "pgType": "Single",
  "availableRooms": 5,
  "featured": true,
  "amenities": ["WiFi", "AC", "Security"], // Top 3 only
  "distance": 2.5 // From user location
};

// 2. DETAIL PAGE - Complete Version (~8.9KB)
const pgDetailData = {
  // ... Complete improved_pg_sample.json data
};

// 3. API ENDPOINTS
/*
GET /api/pgs              -> Light version for listings
GET /api/pgs/:id          -> Complete version for details
GET /api/pgs/search       -> Light version with filters
GET /api/pgs/:id/images   -> Images separately
GET /api/pgs/:id/reviews  -> Reviews separately
*/

// 4. FRONTEND OPTIMIZATION
const PGOptimization = {
  // Pagination
  itemsPerPage: 10, // 10 PGs = 10KB (very fast)
  
  // Lazy Loading
  imageLoading: "lazy",
  
  // Caching
  cacheStrategy: "30 minutes",
  
  // Search Optimization
  searchFields: ["name", "city", "price", "amenities"],
  
  // Mobile Optimization
  mobileDataSaver: true // Load minimal data on mobile
};

export { pgListingData, pgDetailData, PGOptimization };
