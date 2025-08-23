import mongoose from 'mongoose';
import FeatureContent from './models/FeatureContent.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pg-bike-rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedFeatureContent = async () => {
  try {
    console.log('🌱 Seeding Feature Content...');

    // Clear existing data
    await FeatureContent.deleteMany({});

    // Default features data
    const featuresData = {
      title: "Why Choose Our Platform",
      subtitle: "Experience the best in PG accommodations and bike rentals with our comprehensive platform",
      ctaText: "Start Your Journey Today",
      items: [
        {
          icon: 'home',
          color: 'blue',
          title: 'Verified PGs',
          description: 'All our PG accommodations are verified and inspected for quality, safety, and cleanliness standards.',
          order: 1,
          isActive: true
        },
        {
          icon: 'bicycle',
          color: 'purple',
          title: 'Premium Bikes',
          description: 'Well-maintained bikes with regular servicing, insurance coverage, and 24/7 roadside assistance.',
          order: 2,
          isActive: true
        },
        {
          icon: 'credit-card',
          color: 'green',
          title: 'Secure Payments',
          description: 'Safe and secure payment gateway with multiple payment options and instant booking confirmation.',
          order: 3,
          isActive: true
        },
        {
          icon: 'star',
          color: 'orange',
          title: 'Best Prices',
          description: 'Competitive pricing with no hidden charges, transparent billing, and flexible payment plans.',
          order: 4,
          isActive: true
        },
        {
          icon: 'lock',
          color: 'pink',
          title: 'Safe & Secure',
          description: 'Advanced security measures, background-verified owners, and comprehensive safety protocols.',
          order: 5,
          isActive: true
        },
        {
          icon: 'mobile',
          color: 'cyan',
          title: 'Easy Booking',
          description: 'Simple and intuitive booking process with instant confirmation and easy cancellation policies.',
          order: 6,
          isActive: true
        }
      ],
      isActive: true,
      isDeleted: false
    };

    // Create features content
    const featureContent = new FeatureContent(featuresData);
    await featureContent.save();

    console.log('✅ Feature Content seeded successfully!');
    console.log(`📊 Created ${featuresData.items.length} feature items`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Feature Content:', error);
    process.exit(1);
  }
};

seedFeatureContent();
