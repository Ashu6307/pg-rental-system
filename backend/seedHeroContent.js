import mongoose from 'mongoose';
import HeroContent from './models/HeroContent.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pgbike')
  .then(() => console.log('MongoDB connected for seeding hero content'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedHeroContent = async () => {
  try {
    // Clear existing hero content
    await HeroContent.deleteMany({});

    // Create new hero content with multiple images
    const heroContent = new HeroContent({
      title: 'Welcome to PG & Bike Rental',
      subtitle: 'Find your perfect PG accommodation and bike rental solution in one convenient platform',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Single image for fallback
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1503174971373-b1f69850bded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
      ],
      ctaText: 'Get Started Today',
      tenantId: null,
      isDeleted: false
    });

    await heroContent.save();
    console.log('✅ Hero content seeded successfully with image!');
    
    console.log('Hero Content:', {
      title: heroContent.title,
      subtitle: heroContent.subtitle,
      image: heroContent.image,
      ctaText: heroContent.ctaText
    });

  } catch (error) {
    console.error('❌ Error seeding hero content:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedHeroContent();
