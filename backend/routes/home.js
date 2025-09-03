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

    // Random PGs (limited info for public)
    const randomPGs = await PG.aggregate([
      { $match: { status: 'active', softDelete: { $ne: true } } },
      { $sample: { size: 4 } },
      {
        $project: {
          name: 1,
          city: 1,
          state: 1,
          price: 1,
          images: { $slice: ['$images', 1] },
          rating: 1
        }
      }
    ]);

    // Random Rooms (limited info for public) - Added for featured rooms
    const randomRooms = await Room.find({})
      .select('name city state pricing.rent pricing.originalPrice media.images rating propertyType locality')
      .limit(10)
      .lean();
    
    // Transform rooms data to match frontend expectations
    const transformedRooms = randomRooms.map(room => {
      return {
        ...room,
        price: room.pricing?.rent, // Map pricing.rent to price for consistency
        type: room.propertyType,
        images: room.media?.images || [], // Map media.images to images for frontend
        pricing: {
          ...room.pricing
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
    
    // Features/Marketing content - get from database only
    let features = await FeatureContent.findOne({ 
      isActive: true, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
    
    // Sort active items by order if features exist
    if (features && features.items) {
      features.items = features.items
        .filter(item => item.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    res.json({ 
      hero, 
      stats: marketingStats, 
      featuredPGs: randomPGs, 
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
