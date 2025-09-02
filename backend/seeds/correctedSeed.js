import mongoose from 'mongoose';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

// Corrected seed data matching the exact schema structure
const correctedRoomsData = [
  // 1. Luxury Single Room in Koramangala (Room type)
  {
    name: "Luxury Single Room in Koramangala",
    description: "Premium single occupancy room with modern amenities in the heart of Koramangala",
    propertyType: "Room",
    address: "100 Feet Road, Koramangala 4th Block",
    city: "Bangalore",
    locality: "Koramangala",
    subLocality: "4th Block",
    state: "Karnataka",
    pincode: "560034",
    location: {
      type: "Point",
      coordinates: [77.6369, 12.9352],
      lat: 12.9352,
      lng: 77.6369
    },
    pricing: {
      rent: 18000,
      securityDeposit: 36000,
      maintenanceCharges: 2000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: 500,
      parkingCharges: 1000
    },
    roomConfig: {
      roomType: "Single",
      area: 150,
      furnished: true,
      attachedBathroom: true,
      balcony: true
    },
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: true,
        bed: true,
        wardrobe: true,
        studyTable: true
      },
      luxury: {
        gym: true,
        pool: false,
        clubhouse: true,
        garden: true,
        playground: false,
        sports: false,
        elevator: true,
        security: true,
        cctv: true,
        intercom: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          caption: "Spacious single room",
          category: "room",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: [],
        bedroom: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        livingRoom: [],
        balcony: ["https://images.unsplash.com/photo-1560448204-e4596b1d65ed"],
        parking: [],
        entrance: [],
        others: []
      }
    },
    totalUnits: 1,
    availableUnits: 1,
    status: "Active",
    verified: true,
    contact: {
      primaryPhone: "9876543210",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      ageLimit: { min: 18, max: 35 },
      profession: ["Student", "IT Professional"],
      foodPreference: "Any",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: false
    }
  },

  // 2. Modern 1BHK Apartment (Flat type)
  {
    name: "Modern 1BHK Apartment in Indiranagar",
    description: "Contemporary 1BHK apartment with all modern amenities",
    propertyType: "Flat",
    address: "100 Feet Road, Indiranagar",
    city: "Bangalore",
    locality: "Indiranagar",
    subLocality: "100 Feet Road",
    state: "Karnataka",
    pincode: "560038",
    location: {
      type: "Point",
      coordinates: [77.6413, 12.9716],
      lat: 12.9716,
      lng: 77.6413
    },
    pricing: {
      rent: 25000,
      securityDeposit: 50000,
      maintenanceCharges: 3000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: 800,
      parkingCharges: 1500
    },
    flatConfig: {
      flatType: "1BHK",
      bedrooms: 1,
      bathrooms: 1,
      balconies: 1,
      kitchen: {
        type: "Modular",
        size: "Medium"
      },
      builtupArea: 650,
      carpetArea: 500,
      superBuiltupArea: 750,
      floorNumber: 3,
      totalFloors: 8,
      facing: "East",
      furnishingStatus: "Semi-furnished",
      propertyAge: "1-5 Years",
      parking: {
        covered: 1,
        open: 0
      }
    },
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: false,
        bed: true,
        wardrobe: true,
        sofa: true
      },
      luxury: {
        gym: true,
        pool: true,
        clubhouse: true,
        garden: true,
        playground: false,
        sports: true,
        elevator: true,
        security: true,
        cctv: true,
        intercom: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          caption: "Modern living room",
          category: "living",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: ["https://images.unsplash.com/photo-1585821569339-11e1958fc558"],
        bedroom: ["https://images.unsplash.com/photo-1556912167-f556f1ae4540"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        livingRoom: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        balcony: ["https://images.unsplash.com/photo-1560448204-e4596b1d65ed"],
        parking: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
        entrance: [],
        others: []
      }
    },
    totalUnits: 1,
    availableUnits: 1,
    status: "Active",
    verified: true,
    contact: {
      primaryPhone: "9876543211",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["9 AM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      ageLimit: { min: 22, max: 40 },
      profession: ["IT Professional", "Corporate Employee"],
      foodPreference: "Any",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: false
    }
  },

  // 3. Spacious 2BHK in Whitefield (Flat type)
  {
    name: "Spacious 2BHK in Whitefield",
    description: "Large 2BHK apartment perfect for small families",
    propertyType: "Flat",
    address: "ITPL Main Road, Whitefield",
    city: "Bangalore",
    locality: "Whitefield",
    subLocality: "ITPL Main Road",
    state: "Karnataka",
    pincode: "560066",
    location: {
      type: "Point",
      coordinates: [77.7500, 12.9698],
      lat: 12.9698,
      lng: 77.7500
    },
    pricing: {
      rent: 32000,
      securityDeposit: 64000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: 1000,
      parkingCharges: 2000
    },
    flatConfig: {
      flatType: "2BHK",
      bedrooms: 2,
      bathrooms: 2,
      balconies: 2,
      kitchen: {
        type: "Modular",
        size: "Large"
      },
      builtupArea: 1100,
      carpetArea: 850,
      superBuiltupArea: 1300,
      floorNumber: 5,
      totalFloors: 12,
      facing: "North",
      furnishingStatus: "Furnished",
      propertyAge: "1-5 Years",
      parking: {
        covered: 1,
        open: 1
      }
    },
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: true,
        bed: true,
        wardrobe: true,
        sofa: true
      },
      luxury: {
        gym: true,
        pool: true,
        clubhouse: true,
        garden: true,
        playground: true,
        sports: true,
        elevator: true,
        security: true,
        cctv: true,
        intercom: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          caption: "Spacious living area",
          category: "living",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: ["https://images.unsplash.com/photo-1585821569339-11e1958fc558"],
        bedroom: [
          "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          "https://images.unsplash.com/photo-1620626011761-996317b8d101"
        ],
        livingRoom: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        parking: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
        entrance: [],
        others: []
      }
    },
    totalUnits: 1,
    availableUnits: 1,
    status: "Active",
    verified: true,
    contact: {
      primaryPhone: "9876543212",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      ageLimit: { min: 25, max: 45 },
      profession: ["Any"],
      foodPreference: "Any",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  },

  // 4. Budget Student Room (Room type)
  {
    name: "Budget Student Room in Marathahalli",
    description: "Affordable accommodation for students near tech parks",
    propertyType: "Room",
    address: "Marathahalli Bridge, Near Prestige Tech Park",
    city: "Bangalore",
    locality: "Marathahalli",
    subLocality: "Near Tech Park",
    state: "Karnataka",
    pincode: "560037",
    location: {
      type: "Point",
      coordinates: [77.7011, 12.9591],
      lat: 12.9591,
      lng: 77.7011
    },
    pricing: {
      rent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1500,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: 400,
      parkingCharges: 0
    },
    roomConfig: {
      roomType: "Double",
      area: 120,
      furnished: true,
      attachedBathroom: false,
      balcony: false
    },
    amenities: {
      basic: {
        wifi: true,
        parking: false,
        ac: false,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: false,
        bed: true,
        wardrobe: true,
        studyTable: true
      },
      luxury: {
        gym: false,
        pool: false,
        clubhouse: false,
        garden: false,
        playground: false,
        sports: false,
        elevator: false,
        security: true,
        cctv: true,
        intercom: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          caption: "Budget-friendly room",
          category: "room",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: [],
        bedroom: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: [],
        others: []
      }
    },
    totalUnits: 1,
    availableUnits: 1,
    status: "Active",
    verified: true,
    contact: {
      primaryPhone: "9876543213",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        timeSlots: ["8 AM - 8 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      ageLimit: { min: 18, max: 30 },
      profession: ["Student", "IT Professional"],
      foodPreference: "Vegetarian",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // 5. Luxury 3BHK Family Flat
  {
    name: "Luxury 3BHK Family Apartment in JP Nagar",
    description: "Premium 3BHK apartment perfect for families with children",
    propertyType: "Flat",
    address: "24th Main Road, JP Nagar 5th Phase",
    city: "Bangalore",
    locality: "JP Nagar",
    subLocality: "5th Phase",
    state: "Karnataka",
    pincode: "560078",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9082],
      lat: 12.9082,
      lng: 77.5946
    },
    pricing: {
      rent: 45000,
      securityDeposit: 90000,
      maintenanceCharges: 5000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: 1200,
      parkingCharges: 2500
    },
    flatConfig: {
      flatType: "3BHK",
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      kitchen: {
        type: "Modular",
        size: "Large"
      },
      builtupArea: 1500,
      carpetArea: 1200,
      superBuiltupArea: 1800,
      floorNumber: 7,
      totalFloors: 15,
      facing: "South",
      furnishingStatus: "Furnished",
      propertyAge: "1-5 Years",
      parking: {
        covered: 2,
        open: 0
      }
    },
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: true,
        bed: true,
        wardrobe: true,
        sofa: true
      },
      luxury: {
        gym: true,
        pool: true,
        clubhouse: true,
        garden: true,
        playground: true,
        sports: true,
        elevator: true,
        security: true,
        cctv: true,
        intercom: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          caption: "Luxurious family living room",
          category: "living",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: ["https://images.unsplash.com/photo-1585821569339-11e1958fc558"],
        bedroom: [
          "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          "https://images.unsplash.com/photo-1620626011761-996317b8d101",
          "https://images.unsplash.com/photo-1564540579770-b4a1ff0c4cb7"
        ],
        livingRoom: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        parking: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
        entrance: ["https://images.unsplash.com/photo-1615874959474-d609969a20ed"],
        others: []
      }
    },
    totalUnits: 1,
    availableUnits: 1,
    status: "Active",
    verified: true,
    contact: {
      primaryPhone: "9876543214",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      ageLimit: { min: 25, max: 55 },
      profession: ["Any"],
      foodPreference: "Any",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  }
];

const seedCorrectedRooms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('🗑️ Cleared existing rooms');

    console.log(`📦 Preparing to seed ${correctedRoomsData.length} corrected rooms...`);

    // Add default owner and timestamps
    const roomsWithDefaults = correctedRoomsData.map(room => ({
      ...room,
      owner: new mongoose.Types.ObjectId(), // Generate new ObjectId for owner
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert all rooms
    const insertedRooms = await Room.insertMany(roomsWithDefaults);
    console.log(`✅ Successfully seeded ${insertedRooms.length} rooms!`);

    // Log summary
    const roomTypes = insertedRooms.reduce((acc, room) => {
      acc[room.propertyType] = (acc[room.propertyType] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Seeded Properties Summary:');
    Object.entries(roomTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} properties`);
    });

    const rents = insertedRooms.map(room => room.pricing.rent);
    const avgRent = Math.round(rents.reduce((a, b) => a + b, 0) / rents.length);
    console.log(`💰 Average Rent: ₹${avgRent.toLocaleString()}`);

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
seedCorrectedRooms();

export default seedCorrectedRooms;
