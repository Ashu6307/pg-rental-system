// Quick seed script with corrected enum values
import mongoose from 'mongoose';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

const fixedRoomsData = [
  // 1. Luxury Single Room
  {
    name: "Luxury Single Room in Koramangala",
    description: "Premium single occupancy room with modern amenities in the heart of Koramangala. Perfect for young professionals working in nearby tech companies.",
    propertyType: "Room",
    address: "123 Koramangala 5th Block",
    city: "Bangalore",
    locality: "Koramangala",
    subLocality: "5th Block",
    state: "Karnataka",
    pincode: "560095",
    location: {
      type: "Point",
      coordinates: [77.6412, 12.9352],
      lat: 12.9352,
      lng: 77.6412
    },
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      furnished: "Fully Furnished",
      attachedBathroom: true,
      balcony: true,
      area: 200
    },
    pricing: {
      rent: 18000,
      securityDeposit: 36000,
      maintenanceCharges: 2000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included"
    },
    totalUnits: 1,
    availableUnits: 1,
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
        gym: false,
        pool: false,
        clubhouse: false,
        garden: true,
        playground: false,
        sports: false,
        elevator: true,
        security: true,
        cctv: true,
        intercom: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          caption: "Luxury single room with modern furniture",
          category: "Main",
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          caption: "Attached bathroom with premium fittings",
          category: "Bathroom"
        }
      ],
      areaImages: {
        kitchen: [],
        bedroom: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
        ],
        livingRoom: [],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed"
        ],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543210",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional"],
      foodPreference: "Both",
      ageGroup: { min: 21, max: 35 }
    },
    rules: {
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: false
    }
  },

  // 2. Budget Room
  {
    name: "Budget-Friendly Room in Marathahalli",
    description: "Affordable accommodation for students and young professionals. Basic amenities with shared facilities in a safe neighborhood.",
    propertyType: "Room",
    address: "Near Marathahalli Bridge",
    city: "Bangalore",
    locality: "Marathahalli",
    subLocality: "Near Bridge",
    state: "Karnataka",
    pincode: "560037",
    location: {
      type: "Point",
      coordinates: [77.7011, 12.9568],
      lat: 12.9568,
      lng: 77.7011
    },
    roomConfig: {
      roomType: "Double Occupancy",
      occupancy: 2,
      furnished: "Semi Furnished",
      attachedBathroom: false,
      balcony: false,
      area: 120
    },
    pricing: {
      rent: 8000,
      securityDeposit: 16000,
      maintenanceCharges: 1000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra"
    },
    totalUnits: 1,
    availableUnits: 1,
    amenities: {
      basic: {
        wifi: true,
        parking: false,
        ac: false,
        geyser: true,
        fridge: false,
        washingMachine: false,
        tv: false,
        bed: true,
        wardrobe: true,
        studyTable: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          caption: "Simple and clean room",
          category: "Main",
          isMain: true
        }
      ],
      areaImages: {
        kitchen: [],
        bedroom: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
        ],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543211",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Male",
      occupationType: ["Student", "Working Professional"],
      foodPreference: "Veg"
    },
    rules: {
      smokingAllowed: false,
      drinkingAllowed: false,
      petsAllowed: false
    }
  },

  // 3. 1BHK Apartment
  {
    name: "Modern 1BHK Apartment in Indiranagar",
    description: "Spacious 1BHK apartment in trendy Indiranagar with all modern amenities. Perfect for couples and young professionals.",
    propertyType: "Flat",
    address: "HAL 2nd Stage, Indiranagar",
    city: "Bangalore",
    locality: "Indiranagar",
    subLocality: "HAL 2nd Stage",
    state: "Karnataka",
    pincode: "560008",
    location: {
      type: "Point",
      coordinates: [77.6408, 12.9784],
      lat: 12.9784,
      lng: 77.6408
    },
    flatConfig: {
      flatType: "1BHK",
      bedrooms: 1,
      bathrooms: 1,
      halls: 1,
      kitchen: true,
      balconies: 1,
      floor: 3,
      totalFloors: 5,
      areas: {
        carpetArea: 500,
        builtUpArea: 600,
        superBuiltUpArea: 700
      },
      furnishingStatus: "Semi Furnished",
      powerBackup: true,
      liftAvailable: false
    },
    pricing: {
      rent: 25000,
      securityDeposit: 50000,
      maintenanceCharges: 2500,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra"
    },
    totalUnits: 1,
    availableUnits: 1,
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
        geyser: true,
        fridge: false,
        washingMachine: false,
        tv: false,
        bed: false,
        wardrobe: true,
        sofa: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          caption: "Modern living room",
          category: "Living Room",
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          caption: "Comfortable bedroom",
          category: "Bedroom"
        }
      ],
      areaImages: {
        kitchen: [
          "https://images.unsplash.com/photo-1585821569339-11e1958fc558"
        ],
        bedroom: [
          "https://images.unsplash.com/photo-1556912167-f556f1ae4540"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
        ],
        livingRoom: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed"
        ],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543212",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["10 AM - 5 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional", "Couple"],
      foodPreference: "Both"
    },
    rules: {
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: false
    }
  },

  // 4. Female Only PG
  {
    name: "Ladies Only PG in Koramangala",
    description: "Safe and secure accommodation for working women with all meals included and 24/7 security.",
    propertyType: "Room",
    address: "Koramangala 4th Block",
    city: "Bangalore",
    locality: "Koramangala",
    subLocality: "4th Block",
    state: "Karnataka",
    pincode: "560034",
    location: {
      type: "Point",
      coordinates: [77.6299, 12.9279],
      lat: 12.9279,
      lng: 77.6299
    },
    roomConfig: {
      roomType: "Double Occupancy",
      occupancy: 2,
      furnished: "Fully Furnished",
      attachedBathroom: true,
      balcony: false,
      area: 150
    },
    pricing: {
      rent: 15000,
      securityDeposit: 30000,
      maintenanceCharges: 1500,
      electricityCharges: "Included",
      waterCharges: "Included",
      internetCharges: "Included"
    },
    totalUnits: 1,
    availableUnits: 1,
    amenities: {
      basic: {
        wifi: true,
        parking: false,
        ac: true,
        geyser: true,
        fridge: true,
        washingMachine: true,
        tv: true,
        bed: true,
        wardrobe: true,
        studyTable: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          caption: "Clean and comfortable ladies PG",
          category: "Main",
          isMain: true
        }
      ],
      areaImages: {
        kitchen: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
        ],
        bedroom: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
        ],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543213",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["9 AM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Female",
      occupationType: ["Working Professional", "Student"],
      foodPreference: "Veg"
    },
    rules: {
      smokingAllowed: false,
      drinkingAllowed: false,
      petsAllowed: false
    }
  },

  // 5. Luxury 2BHK
  {
    name: "Spacious 2BHK in Whitefield",
    description: "Premium 2BHK apartment in Whitefield tech corridor with swimming pool and gym facilities.",
    propertyType: "Flat",
    address: "ITPL Main Road, Whitefield",
    city: "Bangalore",
    locality: "Whitefield",
    subLocality: "ITPL Road",
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
      halls: 1,
      kitchen: true,
      balconies: 2,
      floor: 8,
      totalFloors: 15,
      areas: {
        carpetArea: 1000,
        builtUpArea: 1200,
        superBuiltUpArea: 1400
      },
      furnishingStatus: "Fully Furnished",
      powerBackup: true,
      liftAvailable: true
    },
    pricing: {
      rent: 40000,
      securityDeposit: 80000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included"
    },
    totalUnits: 1,
    availableUnits: 1,
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
          caption: "Spacious living room with city view",
          category: "Living Room",
          isMain: true
        },
        {
          url: "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          caption: "Master bedroom",
          category: "Bedroom"
        }
      ],
      areaImages: {
        kitchen: [
          "https://images.unsplash.com/photo-1585821569339-11e1958fc558",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
        ],
        bedroom: [
          "https://images.unsplash.com/photo-1556912167-f556f1ae4540",
          "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          "https://images.unsplash.com/photo-1620626011761-996317b8d101"
        ],
        livingRoom: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        parking: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
        ],
        entrance: [
          "https://images.unsplash.com/photo-1615874959474-d609969a20ed"
        ],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543214",
      secondaryPhone: "8765432105",
      whatsappNumber: "9876543214",
      email: "owner@example.com",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional", "Family"],
      foodPreference: "Both"
    },
    rules: {
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: true
    }
  }
];

const seedFixedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    await Room.deleteMany({});
    console.log('🗑️ Cleared existing rooms');

    const roomsWithDefaults = fixedRoomsData.map(room => ({
      ...room,
      owner: '64f5a1b2c3d4e5f6a7b8c9d0',
      status: 'Active',
      verified: true,
      featured: false,
      viewCount: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const insertedRooms = await Room.insertMany(roomsWithDefaults);
    console.log(`✅ Successfully seeded ${insertedRooms.length} rooms!`);

    const citySummary = {};
    insertedRooms.forEach(room => {
      citySummary[room.city] = (citySummary[room.city] || 0) + 1;
    });

    console.log('\n📊 Rooms by City:');
    Object.entries(citySummary).forEach(([city, count]) => {
      console.log(`   ${city}: ${count} properties`);
    });

    const typeSummary = {};
    insertedRooms.forEach(room => {
      typeSummary[room.propertyType] = (typeSummary[room.propertyType] || 0) + 1;
    });

    console.log('\n🏠 Properties by Type:');
    Object.entries(typeSummary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} properties`);
    });

    const rents = insertedRooms.map(room => room.pricing.rent);
    const minRent = Math.min(...rents);
    const maxRent = Math.max(...rents);
    const avgRent = Math.round(rents.reduce((a, b) => a + b, 0) / rents.length);

    console.log('\n💰 Rent Range:');
    console.log(`   Minimum: ₹${minRent.toLocaleString()}`);
    console.log(`   Maximum: ₹${maxRent.toLocaleString()}`);
    console.log(`   Average: ₹${avgRent.toLocaleString()}`);

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedFixedRooms();
