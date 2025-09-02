import mongoose from 'mongoose';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

// Import the corrected seed data directly
import { roomsAndFlatsData } from './roomSeeder.js';
import additionalRoomsData from './additionalRooms.js';

dotenv.config();

const seedAllRooms = async () => {
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

    // Combine both seed data arrays
    const allRoomsData = [...roomsAndFlatsData, ...additionalRoomsData];
    console.log(`📦 Preparing to seed ${allRoomsData.length} rooms...`);

    // Add default fields for each room with proper schema compliance
    // Add default values for new pricing fields if missing
    const roomsWithDefaults = allRoomsData.map(room => ({
      ...room,
      owner: new mongoose.Types.ObjectId(),
      status: 'Active',
      verified: true,
      featured: false,
      viewCount: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure pricing structure has all required fields
      pricing: {
        ...room.pricing,
        electricityRate: room.pricing.electricityRate || (room.pricing.electricityCharges === "Extra" ? 8 : 0),
        waterChargesAmount: room.pricing.waterChargesAmount || (room.pricing.waterCharges === "Extra" ? 300 : 0),
        internetChargesAmount: room.pricing.internetChargesAmount || (room.pricing.internetCharges === "Extra" ? 500 : 0),
        parkingCharges: room.pricing.parkingCharges || 0
      },
      // Ensure tenantPreferences structure
      tenantPreferences: {
        ...room.tenantPreferences,
        occupationType: room.tenantPreferences?.occupationType || ["Working Professional"],
        foodPreference: room.tenantPreferences?.foodPreference === "Any" ? "Both" : (room.tenantPreferences?.foodPreference || "Both")
      },
      // Add area images if not present
      media: {
        ...room.media,
        areaImages: room.media?.areaImages || {
          kitchen: [],
          bedroom: [],
          bathroom: [],
          balcony: [],
          livingRoom: [],
          parking: [],
          entrance: [],
          others: []
        }
      }
    }));

    // Insert all rooms
    const insertedRooms = await Room.insertMany(roomsWithDefaults);
    console.log(`✅ Successfully seeded ${insertedRooms.length} rooms!`);

    // Log summary by city
    const citySummary = {};
    insertedRooms.forEach(room => {
      citySummary[room.city] = (citySummary[room.city] || 0) + 1;
    });

    console.log('\n📊 Rooms by City:');
    Object.entries(citySummary).forEach(([city, count]) => {
      console.log(`   ${city}: ${count} properties`);
    });

    // Log summary by property type
    const typeSummary = {};
    insertedRooms.forEach(room => {
      typeSummary[room.propertyType] = (typeSummary[room.propertyType] || 0) + 1;
    });

    console.log('\n🏠 Properties by Type:');
    Object.entries(typeSummary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} properties`);
    });

    // Show price range
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
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
seedAllRooms();

export default seedAllRooms;
