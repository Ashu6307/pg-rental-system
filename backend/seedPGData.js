// Seed Script for Industry-Level PG Data
import mongoose from 'mongoose';
import PG from './models/PG.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-pg-rental');
    console.log('MongoDB connected for PG data seeding');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const seedPGData = async () => {
  try {
    console.log('🌱 Starting PG data seeding...');

    // Clear existing PG data
    await PG.deleteMany({});
    console.log('✅ Cleared existing PG data');

    // Read the improved PG data
    const pgDataPath = path.join(__dirname, 'data', 'all_improved_pg_data.json');
    const pgData = JSON.parse(fs.readFileSync(pgDataPath, 'utf8'));

    console.log(`📊 Found ${pgData.length} PG records to seed`);

    // Process and insert data
    const processedData = pgData.map(pg => {
      // Ensure location has proper GeoJSON structure
      if (pg.location && pg.location.coordinates) {
        pg.location = {
          type: 'Point',
          coordinates: pg.location.coordinates,
          lat: pg.location.lat,
          lng: pg.location.lng
        };
      }

      // Ensure proper date conversion
      if (pg.createdAt && pg.createdAt.$date) {
        pg.createdAt = new Date(pg.createdAt.$date);
      }
      if (pg.updatedAt && pg.updatedAt.$date) {
        pg.updatedAt = new Date(pg.updatedAt.$date);
      }
      if (pg.verificationDetails && pg.verificationDetails.verifiedAt) {
        pg.verificationDetails.verifiedAt = new Date(pg.verificationDetails.verifiedAt);
      }

      // Process approval logs
      if (pg.approvalLogs) {
        pg.approvalLogs = pg.approvalLogs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }

      // Convert MongoDB ObjectId strings to proper ObjectIds
      if (pg._id && pg._id.$oid) {
        delete pg._id; // Let MongoDB generate new IDs
      }
      if (pg.owner && pg.owner.$oid) {
        pg.owner = new mongoose.Types.ObjectId(pg.owner.$oid);
      }

      return pg;
    });

    // Insert data in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      await PG.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(processedData.length/batchSize)}`);
    }

    console.log(`🎉 Successfully seeded ${processedData.length} PG records!`);

    // Create indexes for better performance
    console.log('📈 Creating database indexes...');
    
    // Location index for geospatial queries
    await PG.collection.createIndex({ "location.coordinates": "2dsphere" });
    
    // Text index for search functionality
    await PG.collection.createIndex({
      name: "text",
      description: "text",
      city: "text",
      state: "text",
      amenities: "text",
      highlights: "text"
    });

    // Other useful indexes
    await PG.collection.createIndex({ city: 1, state: 1 });
    await PG.collection.createIndex({ price: 1 });
    await PG.collection.createIndex({ pgType: 1 });
    await PG.collection.createIndex({ genderAllowed: 1 });
    await PG.collection.createIndex({ status: 1, verificationStatus: 1, softDelete: 1 });
    await PG.collection.createIndex({ featured: 1, "rating.overall": -1 });
    await PG.collection.createIndex({ "seo.slug": 1 });

    console.log('✅ Database indexes created successfully');

    // Display summary statistics
    const stats = await PG.aggregate([
      {
        $group: {
          _id: null,
          totalPGs: { $sum: 1 },
          activePGs: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          featuredPGs: { $sum: { $cond: ['$featured', 1, 0] } },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating.overall' },
          totalRooms: { $sum: '$rooms' },
          cities: { $addToSet: '$city' }
        }
      }
    ]);

    if (stats.length > 0) {
      const summary = stats[0];
      console.log('\n📊 PG Data Summary:');
      console.log(`   Total PGs: ${summary.totalPGs}`);
      console.log(`   Active PGs: ${summary.activePGs}`);
      console.log(`   Featured PGs: ${summary.featuredPGs}`);
      console.log(`   Average Price: ₹${Math.round(summary.avgPrice)}`);
      console.log(`   Average Rating: ${summary.avgRating.toFixed(1)}/5`);
      console.log(`   Total Rooms: ${summary.totalRooms}`);
      console.log(`   Cities: ${summary.cities.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error seeding PG data:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await seedPGData();
    console.log('\n🎊 PG data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedPGData };
