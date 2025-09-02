import mongoose from 'mongoose';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

// FINAL CORRECTED seed data with proper enum values
const finalCorrectedData = [
  // 1. Luxury Single Room (Room type)
  {
    name: "Luxury Single Room in Koramangala",
    description: "Premium single occupancy room with modern amenities",
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
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      area: 150,
      furnished: "Fully Furnished",
      attachedBathroom: true,
      balcony: true
    },
    pricing: {
      rent: 18000,
      securityDeposit: 36000,
      maintenanceCharges: 2000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra",
      parkingCharges: 1000,
      rentType: "Monthly"
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
          caption: "Spacious single room with modern amenities",
          category: "Main",
          order: 1,
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          caption: "Clean attached bathroom",
          category: "Bathroom",
          order: 2,
          isMain: false
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
      occupationType: ["Student", "Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: false
    }
  },

  // 2. Modern 1BHK Apartment (Flat type)
  {
    name: "Modern 1BHK Apartment in Indiranagar",
    description: "Contemporary 1BHK apartment with premium amenities",
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
    pricing: {
      rent: 25000,
      securityDeposit: 50000,
      maintenanceCharges: 3000,
      electricityCharges: "Extra",
      waterCharges: "Included", 
      internetCharges: "Extra",
      parkingCharges: 1500,
      rentType: "Monthly"
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
          caption: "Modern living room with city view",
          category: "Main",
          order: 1,
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1585821569339-11e1958fc558",
          caption: "Well-equipped modular kitchen",
          category: "Kitchen",
          order: 2,
          isMain: false
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
      occupationType: ["Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: false
    }
  },

  // 3. Budget Double Room (Room type)
  {
    name: "Budget Double Room in Marathahalli",
    description: "Affordable double sharing room near tech parks",
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
    roomConfig: {
      roomType: "Double Occupancy",
      occupancy: 2,
      area: 120,
      furnished: "Semi Furnished",
      attachedBathroom: false,
      balcony: false
    },
    pricing: {
      rent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1500,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included", 
      parkingCharges: 0,
      rentType: "Monthly"
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
          caption: "Budget-friendly double sharing room",
          category: "Main",
          order: 1,
          isMain: true
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
      occupationType: ["Student", "Working Professional"],
      foodPreference: "Veg",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // 4. Spacious 2BHK Flat
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
    pricing: {
      rent: 32000,
      securityDeposit: 64000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra",
      parkingCharges: 2000,
      rentType: "Monthly"
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
          caption: "Spacious 2BHK living area",
          category: "Main",
          order: 1,
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          caption: "Master bedroom with balcony",
          category: "Bedroom",
          order: 2,
          isMain: false
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
      occupationType: ["Family", "Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  },

  // 5. Premium 3BHK Family Flat
  {
    name: "Premium 3BHK Family Apartment in JP Nagar",
    description: "Luxury 3BHK apartment with premium amenities for families",
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
    pricing: {
      rent: 45000,
      securityDeposit: 90000,
      maintenanceCharges: 5000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra",
      parkingCharges: 2500,
      rentType: "Monthly"
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
          caption: "Premium family living room",
          category: "Main",
          order: 1,
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          caption: "Master bedroom suite",
          category: "Bedroom",
          order: 2,
          isMain: false
        },
        {
          url: "https://images.unsplash.com/photo-1585821569339-11e1958fc558",
          caption: "Designer modular kitchen",
          category: "Kitchen",
          order: 3,
          isMain: false
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
      occupationType: ["Family"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  }
];

const seedFinalData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    await Room.deleteMany({});
    console.log('🗑️ Cleared existing rooms');

    console.log(`📦 Seeding ${finalCorrectedData.length} properties with corrected schema...`);

    const roomsWithOwner = finalCorrectedData.map(room => ({
      ...room,
      owner: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const insertedRooms = await Room.insertMany(roomsWithOwner);
    console.log(`✅ Successfully seeded ${insertedRooms.length} properties!`);

    console.log('\n📊 Seeded Data Summary:');
    
    const summary = insertedRooms.reduce((acc, room) => {
      acc[room.propertyType] = (acc[room.propertyType] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} properties`);
    });

    const cities = [...new Set(insertedRooms.map(r => r.city))];
    console.log(`🏙️ Cities: ${cities.join(', ')}`);
    
    const rentRange = insertedRooms.map(r => r.pricing.rent);
    console.log(`💰 Rent Range: ₹${Math.min(...rentRange).toLocaleString()} - ₹${Math.max(...rentRange).toLocaleString()}`);

    console.log('\n🎉 All properties seeded successfully with proper schema validation!');
    
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    console.log('\n🔧 Schema validation details:');
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.log(`   ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedFinalData();

export default seedFinalData;
