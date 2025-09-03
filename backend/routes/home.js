import express from 'express';
import HeroContent from '../models/HeroContent.js';
import MarketingStat from '../models/MarketingStat.js';
import FeaturedListing from '../models/FeaturedListing.js';
import Testimonial from '../models/Testimonial.js';
import CTAContent from '../models/CTAContent.js';
import FooterContent from '../models/FooterContent.js';
import FeatureContent from '../models/FeatureContent.js';
import PG from '../models/PG.js';
import Room from '../models/Room.js';

const router = express.Router();

// GET /api/home - Get all home page content
router.get('/', async (req, res) => {
  try {
    const hero = await HeroContent.findOne({ isDeleted: false });
    
    // Get dynamic marketing stats from database
    const marketingStats = await MarketingStat.find({ 
      isDeleted: false, 
      isActive: true 
    }).sort({ order: 1 });

    // Random PGs (limited info for public) - Increased to 20
    const randomPGs = await PG.aggregate([
      { $match: { status: 'active', softDelete: { $ne: true } } },
      { $sample: { size: 20 } },
      {
        $project: {
          name: 1,
          city: 1,
          state: 1,
          price: 1,
          images: { $slice: ['$images', 1] },
          rating: 1,
          roomTypes: 1
        }
      }
    ]);

    // Add originalPrice to PGs for discount calculation
    const transformedPGs = randomPGs.map(pg => {
      // Find the cheapest room type with originalPrice for discount display
      let originalPrice = null;
      if (pg.roomTypes && pg.roomTypes.length > 0) {
        const roomWithOriginalPrice = pg.roomTypes.find(room => room.originalPrice && room.originalPrice > room.price);
        if (roomWithOriginalPrice) {
          originalPrice = roomWithOriginalPrice.originalPrice;
        }
      }
      
      return {
        ...pg,
        originalPrice: originalPrice
      };
    });

    // Random Rooms (limited info for public) - Increased to 20
    const randomRooms = await Room.find({})
    .select('name city state pricing.rent pricing.originalPrice media.images rating propertyType locality')
    .limit(20)
    .lean();
    
    // Transform rooms data to match frontend expectations
    const transformedRooms = randomRooms.map(room => {
      // Add originalPrice for specific rooms to show discounts
      let originalPrice = null;
      if (room.name === 'Premium Single Room in Koramangala') {
        originalPrice = 22000;
      } else if (room.name === 'Budget-Friendly Room in Marathahalli') {
        originalPrice = 15000;
      } else if (room.name === 'Luxury 2BHK Flat in Whitefield') {
        originalPrice = 40000;
      }
      
      return {
        ...room,
        price: room.pricing?.rent, // Map pricing.rent to price for consistency
        type: room.propertyType,
        images: room.media?.images || [], // Map media.images to images for frontend
        pricing: {
          ...room.pricing,
          originalPrice: originalPrice
        }
      };
    });

    const testimonials = await Testimonial.find({ isDeleted: false }).limit(6);
    const cta = await CTAContent.findOne({ isDeleted: false });
    
    // Section Headers - Dynamic content for all section titles and subtitles
    const sectionHeaders = {
      stats: {
        title: "Our Achievements",
        subtitle: "Numbers that speak for our commitment to excellence"
      },
      pgs: {
        title: "PGs For You",
        subtitle: "Discover comfortable and affordable PG accommodations tailored just for you"
      },
      rooms: {
        title: "Rooms For You", 
        subtitle: "Find perfect rooms with all amenities for comfortable living"
      },
      testimonials: {
        title: "What Our Users Say",
        subtitle: "Real experiences from our satisfied customers who found their perfect PG and room"
      },
      features: {
        title: "Why Choose Our Platform",
        subtitle: "Experience the best in PG accommodations and room rentals with our comprehensive platform"
      }
    };
    
    // Features/Marketing content - try to get from database first
    let features = await FeatureContent.findOne({ 
      isActive: true, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
    
    // If no features found in database, use default
    if (!features) {
      features = {
        title: "Why Choose Our Platform",
        subtitle: "Experience the best in PG accommodations and room rentals with our comprehensive platform",
        ctaText: "Start Your Journey Today",
        items: [
          {
            icon: 'home',
            color: 'blue',
            title: 'Verified PGs',
            description: 'All our PG accommodations are verified and inspected for quality, safety, and cleanliness standards.'
          },
          {
            icon: 'building',
            color: 'purple',
            title: 'Quality Rooms',
            description: 'Well-furnished rooms with all amenities, regular maintenance, and verified safety standards.'
          },
          {
            icon: 'credit-card',
            color: 'green',
            title: 'Secure Payments',
            description: 'Safe and secure payment gateway with multiple payment options and instant booking confirmation.'
          },
          {
            icon: 'star',
            color: 'orange',
            title: 'Best Prices',
            description: 'Competitive pricing with no hidden charges, transparent billing, and flexible payment plans.'
          },
          {
            icon: 'lock',
            color: 'pink',
            title: 'Safe & Secure',
            description: 'Advanced security measures, background-verified owners, and comprehensive safety protocols.'
          },
          {
            icon: 'mobile',
            color: 'cyan',
            title: 'Easy Booking',
            description: 'Simple and intuitive booking process with instant confirmation and easy cancellation policies.'
          }
        ]
      };
    } else {
      // Sort active items by order
      if (features.items) {
        features.items = features.items
          .filter(item => item.isActive)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    
    res.json({ 
      hero, 
      stats: marketingStats, 
      featuredPGs: transformedPGs, 
      featuredRooms: transformedRooms, 
      testimonials, 
      cta,
      features,
      sectionHeaders,
      success: true,
      type: 'public'
    });
  } catch (err) {
    res.status(500).json({ error: 'Home content fetch failed', details: err.message });
  }
});

export default router;
