// src/config/filtersConfig.js

// ✅ Universal Filters
const baseFilters = [
  {
    key: "search",
    label: "Search",
    type: "search",
    role: "all", // sab ke liye
  },
  {
    key: "sort",
    label: "Sort By",
    type: "select",
    role: "all",
    options: [
      { value: "price_low", label: "💰 Price: Low to High" },
      { value: "price_high", label: "💸 Price: High to Low" },
      { value: "rating", label: "⭐ Highest Rated" },
      { value: "popular", label: "🔥 Most Popular" },
      { value: "newest", label: "🆕 Newly Added" },
    ],
  },
  {
    key: "rating",
    label: "Rating",
    type: "select",
    role: "all",
    options: [
      { value: "4plus", label: "⭐ 4+ Stars" },
      { value: "3plus", label: "⭐ 3+ Stars" },
      { value: "2plus", label: "⭐ 2+ Stars" },
    ],
  },
];

// ✅ PG Filters (Customer + Owner)
export const filtersConfigPG = [
  ...baseFilters,
  {
    key: "pgType",
    label: "Room Type",
    type: "select",
    role: "all",
    options: [
      { value: "single", label: "🛏️ Single" },
      { value: "double", label: "👥 Double" },
      { value: "triple", label: "👨‍👩‍👧 Triple" },
    ],
  },
  {
    key: "genderAllowed",
    label: "Gender",
    type: "select",
    role: "customer",
    options: [
      { value: "male", label: "👨 Boys" },
      { value: "female", label: "👩 Girls" },
      { value: "both", label: "👫 Co-living" },
    ],
  },
  {
    key: "amenities",
    label: "Amenities",
    type: "multiselect",
    role: "all",
    options: [
      { value: "wifi", label: "📶 WiFi" },
      { value: "food", label: "🍽️ Food" },
      { value: "laundry", label: "🧺 Laundry" },
      { value: "parking", label: "🅿️ Parking" },
      { value: "ac", label: "❄️ AC" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    role: "admin", // sirf admin/owner ko dikhana
    options: [
      { value: "active", label: "✅ Active" },
      { value: "inactive", label: "⛔ Inactive" },
      { value: "pending", label: "⏳ Pending" },
    ],
  },
];

// ✅ Bike Filters (Customer + Owner)
export const filtersConfigBike = [
  ...baseFilters,
  {
    key: "brand",
    label: "Brand",
    type: "select",
    role: "all",
    options: [
      { value: "honda", label: "Honda" },
      { value: "yamaha", label: "Yamaha" },
      { value: "royalEnfield", label: "Royal Enfield" },
      { value: "ktm", label: "KTM" },
    ],
  },
  {
    key: "bikeType",
    label: "Bike Type",
    type: "select",
    role: "all",
    options: [
      { value: "scooter", label: "🛵 Scooty" },
      { value: "sports", label: "🏍️ Sports" },
      { value: "cruiser", label: "🛣️ Cruiser" },
    ],
  },
  {
    key: "fuelType",
    label: "Fuel Type",
    type: "select",
    role: "customer",
    options: [
      { value: "petrol", label: "⛽ Petrol" },
      { value: "electric", label: "⚡ Electric" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    role: "admin",
    options: [
      { value: "active", label: "✅ Active" },
      { value: "inactive", label: "⛔ Inactive" },
      { value: "pending", label: "⏳ Pending" },
    ],
  },
];
