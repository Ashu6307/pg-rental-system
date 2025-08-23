// Node.js script to seed about content for public audience
import mongoose from 'mongoose';
import Content from './models/Content.js';
import fs from 'fs';

async function seedAboutContent() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pg_bike_rental');
  // Delete existing About content
  await Content.deleteMany({ type: 'about' });
  // Insert new unified About content
  const data = JSON.parse(fs.readFileSync('./data/about_content_full.json', 'utf-8'));
  for (const item of data) {
    await Content.create(item);
  }
  console.log('Unified About content seeded!');
  process.exit();
}

seedAboutContent();
