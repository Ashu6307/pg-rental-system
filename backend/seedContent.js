// seedContent.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const contactContent = {
  type: 'contact',
  for: 'public',
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pg_bike_rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Content.deleteOne({ type: 'contact', for: 'public' }); // Remove old if exists
  await Content.create(contactContent);
  console.log('Contact page content seeded!');
  mongoose.disconnect();
}

seed();