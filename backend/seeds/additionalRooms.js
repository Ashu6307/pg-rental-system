// Additional Room & Flat data for seeding - CORRECTED VERSION

const additionalRoomsData = [
  // 6. Premium Studio Room
  {
    name: "Premium Studio Room in HSR Layout",
    description: "Luxury studio room with kitchenette and modern amenities. Perfect for young professionals who value privacy and convenience.",
    propertyType: "Room",
    address: "HSR Layout Sector 1, 27th Main Road",
    city: "Bangalore",
    locality: "HSR Layout",
    subLocality: "Sector 1",
    state: "Karnataka",
    pincode: "560102",
    location: {
      type: "Point",
      coordinates: [77.6473, 12.9082],
      lat: 12.9082,
      lng: 77.6473
    },
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      area: 200,
      furnished: "Fully Furnished",
      attachedBathroom: true,
      balcony: true,
      floor: 5,
      facing: "North",
      acType: "Split AC"
    },
    pricing: {
      rent: 22000,
      securityDeposit: 44000,
      maintenanceCharges: 2500,
      electricityCharges: "Extra",
      electricityRate: 6, // ₹6 per unit
      waterCharges: "Included",
      waterChargesAmount: 0, 
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 1200 // ₹1200 per month
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
          caption: "Premium studio room with kitchenette",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        kitchen: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"],
        bedroom: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        livingRoom: [],
        balcony: ["https://images.unsplash.com/photo-1560448204-e4596b1d65ed"],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543215",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 6 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: false
    }
  },

  // 7. Female-only PG Room
  {
    name: "Safe Female PG Room in Electronic City",
    description: "Secure and comfortable accommodation exclusively for working women. Located in a safe neighborhood with 24/7 security.",
    propertyType: "Room",
    address: "Electronic City Phase 1, Hosur Road",
    city: "Bangalore",
    locality: "Electronic City",
    subLocality: "Phase 1",
    state: "Karnataka",
    pincode: "560100",
    location: {
      type: "Point",
      coordinates: [77.6648, 12.8456],
      lat: 12.8456,
      lng: 77.6648
    },
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      area: 120,
      furnished: "Semi Furnished",
      attachedBathroom: true,
      balcony: false,
      floor: 2,
      facing: "East",
      acType: "Window AC"
    },
    pricing: {
      rent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1500,
      electricityCharges: "Extra",
      electricityRate: 9, // ₹9 per unit
      waterCharges: "Included",
      waterChargesAmount: 0, 
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 0 // free parking
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
        tv: false,
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
        elevator: false,
        security: true,
        cctv: true,
        intercom: true
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          caption: "Safe female PG room",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        kitchen: [],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543216",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 1 PM", "4 PM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Female",
      occupationType: ["Working Professional"],
      foodPreference: "Veg",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // 8. Spacious 2BHK Flat
  {
    name: "Spacious 2BHK Flat in Koramangala",
    description: "Beautiful 2BHK apartment with modern amenities and great connectivity. Perfect for small families or professionals sharing.",
    propertyType: "Flat",
    address: "5th Block Koramangala, 80 Feet Road",
    city: "Bangalore",
    locality: "Koramangala",
    subLocality: "5th Block",
    state: "Karnataka",
    pincode: "560095",
    location: {
      type: "Point",
      coordinates: [77.6299, 12.9352],
      lat: 12.9352,
      lng: 77.6299
    },
    flatConfig: {
      flatType: "2BHK",
      bedrooms: 2,
      bathrooms: 2,
      builtupArea: 1200,
      furnishingStatus: "Furnished",
      balconies: 1,
      kitchen: {
        type: "Modular",
        size: "Large"
      }
    },
    pricing: {
      rent: 45000,
      securityDeposit: 90000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      electricityRate: 6, // ₹6 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Extra",
      internetChargesAmount: 477, // ₹477 per month
      parkingCharges: 2000 // ₹2000 per month
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
          url: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
          caption: "Spacious 2BHK flat",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        kitchen: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"],
        livingRoom: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        balcony: ["https://images.unsplash.com/photo-1560448204-e4596b1d65ed"],
        parking: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
        entrance: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543217",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        timeSlots: ["9 AM - 8 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional", "Family"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  },

  // 9. Budget Student Room
  {
    name: "Affordable Student Room in BTM Layout",
    description: "Budget-friendly accommodation perfect for students. Basic amenities with good study environment and nearby colleges.",
    propertyType: "Room",
    address: "BTM Layout 2nd Stage, 16th Main Road",
    city: "Bangalore",
    locality: "BTM Layout",
    subLocality: "2nd Stage",
    state: "Karnataka",
    pincode: "560076",
    location: {
      type: "Point",
      coordinates: [77.6136, 12.9165],
      lat: 12.9165,
      lng: 77.6136
    },
    roomConfig: {
      roomType: "Shared Room",
      occupancy: 2,
      area: 150,
      furnished: "Semi Furnished",
      attachedBathroom: false,
      balcony: false,
      floor: 1,
      facing: "South",
      acType: "Non AC"
    },
    pricing: {
      rent: 8000,
      securityDeposit: 16000,
      maintenanceCharges: 800,
      electricityCharges: "Extra",
      electricityRate: 8, // ₹8 per unit
      waterCharges: "Included",
      waterChargesAmount: 0, 
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 0 // free parking
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
        security: false,
        cctv: false,
        intercom: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
          caption: "Budget student room",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: ["https://images.unsplash.com/photo-1560185127-6ed189bf02f4"],
        bathroom: [],
        kitchen: [],
        livingRoom: [],
        balcony: [],
        parking: [],
        entrance: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543218",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["5 PM - 8 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Male",
      occupationType: ["Student"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // 10. Luxury 3BHK Flat
  {
    name: "Luxury 3BHK Flat in Whitefield",
    description: "Premium 3BHK apartment with all modern amenities, swimming pool, and clubhouse. Perfect for executives and families.",
    propertyType: "Flat",
    address: "Whitefield Main Road, ITPL",
    city: "Bangalore",
    locality: "Whitefield",
    subLocality: "ITPL",
    state: "Karnataka",
    pincode: "560066",
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9698],
      lat: 12.9698,
      lng: 77.7499
    },
    flatConfig: {
      flatType: "3BHK",
      bedrooms: 3,
      bathrooms: 3,
      builtupArea: 1800,
      furnishingStatus: "Furnished",
      balconies: 2,
      kitchen: {
        type: "Modular",
        size: "Large"
      }
    },
    pricing: {
      rent: 75000,
      securityDeposit: 150000,
      maintenanceCharges: 6000,
      electricityCharges: "Extra",
      electricityRate: 9, // ₹9 per unit
      waterCharges: "Included",
      waterChargesAmount: 0, 
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 3000 // ₹3000 per month
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
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          caption: "Luxury 3BHK flat",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        bathroom: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
        kitchen: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"],
        livingRoom: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        balcony: ["https://images.unsplash.com/photo-1560448204-e4596b1d65ed"],
        parking: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
        entrance: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543219",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional", "Family"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  }
];

export default additionalRoomsData;
