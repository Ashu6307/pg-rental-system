import mongoose from 'mongoose';
import HeroContent from './models/HeroContent.js';
import Stat from './models/Stat.js';
import FeaturedListing from './models/FeaturedListing.js';
import Testimonial from './models/Testimonial.js';
import CTAContent from './models/CTAContent.js';
import FooterContent from './models/FooterContent.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pg_bike_rental';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Hero Content
  await HeroContent.deleteMany({});
  await HeroContent.create({
    title: 'Welcome to PG & Bike Rental',
    subtitle: 'Find your perfect PG and bike rental in one place!',
    image: 'https://dummyimage.com/600x400/007bff/fff&text=PG+Bike+Rental',
    isDeleted: false
  });

  // Stats
  await Stat.deleteMany({});
  await Stat.create([
    { type: 'pg', count: 120, isDeleted: false },
    { type: 'bike', count: 80, isDeleted: false },
    { type: 'user', count: 5000, isDeleted: false }
  ]);

  // Featured Listings
  await FeaturedListing.deleteMany({});
  await FeaturedListing.create([
    { name: 'PG Elite', location: 'Delhi', price: 7000, isFeatured: true, isDeleted: false, refId: new mongoose.Types.ObjectId(), type: 'pg' },
    { name: 'Bike Express', location: 'Mumbai', price: 1200, isFeatured: true, isDeleted: false, refId: new mongoose.Types.ObjectId(), type: 'bike' }
  ]);

  // Testimonials
  await Testimonial.deleteMany({});
  await Testimonial.create([
    { user: new mongoose.Types.ObjectId(), review: 'Best PG experience!', rating: 5, isDeleted: false },
    { user: new mongoose.Types.ObjectId(), review: 'Bike rental was super easy.', rating: 4, isDeleted: false }
  ]);

  // CTA Content
  await CTAContent.deleteMany({});
  await CTAContent.create({
    heading: 'Ready to book your PG or bike?',
    description: 'Register now and get instant access to verified listings.',
    buttonText: 'Register',
    buttonLink: '/register',
    isDeleted: false
  });

  // Footer Content
  await FooterContent.deleteMany({});
  await FooterContent.create({
    address: '123 Main Street, City, State 12345',
    phone: '+91 9876543210',
    email: 'info@pgrental.com',
    isDeleted: false
  });

  console.log('Home content seeded successfully!');
  mongoose.disconnect();
}

seed();
