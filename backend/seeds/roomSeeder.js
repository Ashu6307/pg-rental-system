// Room & Flat seed data with updated pricing structure

const roomsAndFlatsData = [
  // Premium Single Room
  {
    name: "Premium Single Room in Koramangala",
    description: "Luxurious single occupancy room with all modern amenities in the heart of Koramangala. Perfect for working professionals.",
    propertyType: "Room",
    address: "123 Main Road, Koramangala 5th Block",
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
    pricing: {
      rent: 18000,
      securityDeposit: 36000,
      maintenanceCharges: 2000,
      electricityCharges: "Extra",
      electricityRate: 8, // ₹8 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Extra", 
      internetChargesAmount: 500, // ₹500 per month
      parkingCharges: 800 // ₹800 per month
    },
    totalUnits: 1,
    availableUnits: 1,
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      area: 150,
      furnished: "Fully Furnished",
      attachedBathroom: true,
      balcony: true,
      floor: 3,
      facing: "East",
      acType: "Split AC"
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
        gym: false,
        pool: false,
        clubhouse: false,
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
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Premium single room",
          category: "Main",
          isPrimary: true
        },
        {
          url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Room interior",
          category: "Main",
          isPrimary: false
        }
      ],
      areaImages: {
        bedroom: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        entrance: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        kitchen: [],
        livingRoom: [],
        parking: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543210",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 1 PM", "3 PM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional", "Student"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // Affordable Room
  {
    name: "Budget-Friendly Room in Marathahalli",
    description: "Affordable single room perfect for students and young professionals. Located near major IT parks with good connectivity to public transport.",
    propertyType: "Room",
    address: "456 Service Road, Marathahalli",
    city: "Bangalore",
    locality: "Marathahalli",
    subLocality: "AECS Layout",
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
      electricityRate: 7, // ₹7 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Extra",
      internetChargesAmount: 400, // ₹400 per month
      parkingCharges: 500 // ₹500 per month
    },
    totalUnits: 1,
    availableUnits: 1,
    roomConfig: {
      roomType: "Single Occupancy",
      occupancy: 1,
      area: 120,
      furnished: "Semi Furnished",
      attachedBathroom: true,
      balcony: false,
      floor: 2,
      facing: "North",
      acType: "Window AC"
    },
    amenities: {
      basic: {
        wifi: true,
        parking: true,
        ac: true,
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
        security: true,
        cctv: false,
        intercom: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Budget friendly room",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: [
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        balcony: [],
        entrance: [],
        kitchen: [],
        livingRoom: [],
        parking: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543211",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["6 PM - 8 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Male",
      occupationType: ["Student", "Working Professional"],
      foodPreference: "Veg",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // Sharing Room
  {
    name: "Comfortable Sharing Room in BTM Layout",
    description: "Well-maintained sharing accommodation with double occupancy. Ideal for students and budget-conscious professionals.",
    propertyType: "Room",
    address: "789 2nd Stage, BTM Layout",
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
    pricing: {
      rent: 8000,
      securityDeposit: 16000,
      maintenanceCharges: 1200,
      electricityCharges: "As per usage",
      electricityRate: 6, // ₹6 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 0 // free parking
    },
    totalUnits: 2,
    availableUnits: 1,
    roomConfig: {
      roomType: "Double Occupancy",
      occupancy: 2,
      area: 180,
      furnished: "Semi Furnished",
      attachedBathroom: false,
      balcony: true,
      floor: 1,
      facing: "South",
      acType: "Non AC"
    },
    amenities: {
      basic: {
        wifi: true,
        parking: false,
        ac: false,
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
        elevator: false,
        security: false,
        cctv: false,
        intercom: false
      }
    },
    media: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Sharing room",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        bathroom: [],
        balcony: [
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        entrance: [],
        kitchen: [],
        livingRoom: [],
        parking: [],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543212",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 1 PM", "3 PM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Any",
      occupationType: ["Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: true,
      petFriendly: true
    }
  },

  // Luxury 2BHK Flat
  {
    name: "Luxury 2BHK Flat in Whitefield",
    description: "Spacious 2BHK apartment with premium amenities and excellent connectivity to IT corridor. Perfect for professionals and small families.",
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
    pricing: {
      rent: 35000,
      securityDeposit: 70000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      electricityRate: 9, // ₹9 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 1500 // ₹1500 per month for 2 wheeler
    },
    totalUnits: 1,
    availableUnits: 1,
    flatConfig: {
      flatType: "2BHK",
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: "Furnished",
      kitchen: {
        type: "Modular",
        size: "Large"
      },
      builtupArea: 1100,
      carpetArea: 950,
      superBuiltupArea: 1250,
      balconies: 2
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
          url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Luxury 2BHK flat",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        kitchen: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        livingRoom: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        parking: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        entrance: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543213",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 7 PM"]
      }
    },
    tenantPreferences: {
      genderPreference: "Male",
      occupationType: ["Working Professional"],
      foodPreference: "Both",
      smokingAllowed: false,
      drinkingAllowed: false,
      petFriendly: false
    }
  },

  // Spacious 3BHK Flat
  {
    name: "Spacious 3BHK Family Flat in HSR Layout",
    description: "Large 3BHK apartment perfect for families. Located in prime HSR Layout with excellent schools and shopping centers nearby.",
    propertyType: "Flat",
    address: "HSR Layout Sector 2, 27th Main Road",
    city: "Bangalore",
    locality: "HSR Layout",
    subLocality: "Sector 2",
    state: "Karnataka",
    pincode: "560102",
    location: {
      type: "Point",
      coordinates: [77.6387, 12.9082],
      lat: 12.9082,
      lng: 77.6387
    },
    pricing: {
      rent: 55000,
      securityDeposit: 110000,
      maintenanceCharges: 5500,
      electricityCharges: "Extra",
      electricityRate: 10, // ₹10 per unit
      waterCharges: "Extra",
      waterChargesAmount: 800, // ₹800 per month
      internetCharges: "Extra",
      internetChargesAmount: 1000, // ₹1000 per month for high speed
      parkingCharges: 2000 // ₹2000 per month for car parking
    },
    totalUnits: 1,
    availableUnits: 1,
    flatConfig: {
      flatType: "3BHK",
      bedrooms: 3,
      bathrooms: 3,
      furnishingStatus: "Semi-furnished",
      kitchen: {
        type: "Modular",
        size: "Large"
      },
      builtupArea: 1600,
      carpetArea: 1400,
      superBuiltupArea: 1850,
      balconies: 2
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
        bed: false,
        wardrobe: true,
        studyTable: false
      },
      luxury: {
        gym: true,
        pool: false,
        clubhouse: true,
        garden: true,
        playground: true,
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
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          caption: "Spacious 3BHK flat",
          category: "Main",
          isPrimary: true
        }
      ],
      areaImages: {
        bedroom: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        bathroom: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        kitchen: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        livingRoom: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        balcony: [
          "https://images.unsplash.com/photo-1560448204-e4596b1d65ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        parking: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        entrance: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        others: []
      }
    },
    contact: {
      primaryPhone: "9876543214",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["10 AM - 1 PM", "3 PM - 7 PM"]
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

export { roomsAndFlatsData };
