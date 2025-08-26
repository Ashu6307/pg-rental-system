
import { sendEmail } from '../utils/sendEmail.js';
import emailTemplates from '../utils/emailTemplates.js';
import EmailLog from '../models/EmailLog.js';
import EmailCampaign from '../models/EmailCampaign.js';

// Send Newsletter to All Users
export const sendNewsletter = async (req, res) => {
  try {
    const { 
      month, 
      year, 
      featuredPGs, 
      featuredBikes, 
      specialOffers, 
      blogPosts, 
      customerStories 
    } = req.body;

    // Create campaign record
    const campaign = new EmailCampaign({
      name: `${month} ${year} Newsletter`,
      type: 'newsletter',
      subject: `📰 ${month} ${year} Newsletter - PG & Bike Rental`,
      status: 'sending',
      targetAudience: 'subscribers_only',
      content: {
        templateData: { month, year, featuredPGs, featuredBikes, specialOffers, blogPosts, customerStories }
      },
      createdBy: req.user.id,
      sentAt: new Date()
    });
    await campaign.save();

    const campaignId = campaign._id.toString();

    // Get all users who haven't unsubscribed from newsletters
    const users = await User.find({ 
      emailVerified: true,
      'emailPreferences.newsletter': { $ne: false }
    }).select('name email');

    console.log(`📧 Sending newsletter to ${users.length} users...`);

    // Update campaign stats
    campaign.stats.totalRecipients = users.length;
    await campaign.save();

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      // Process batch
      const emailPromises = batch.map(async (user) => {
        try {
          await sendEmail({
            to: user.email,
            subject: `📰 ${month} ${year} Newsletter - PG & Bike Rental`,
            html: emailTemplates.newsletter({
              name: user.name,
              month,
              year,
              featuredPGs,
              featuredBikes,
              specialOffers,
              blogPosts,
              customerStories
            })
          });

          // Log successful email
          await EmailLog.create({
            recipient: user.email,
            recipientName: user.name,
            subject: `📰 ${month} ${year} Newsletter - PG & Bike Rental`,
            emailType: 'newsletter',
            status: 'sent',
            campaignId: campaignId,
            campaignName: campaign.name,
            templateUsed: 'newsletter',
            userId: user._id,
            sentBy: req.user.id
          });

          successCount++;
          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Failed to send newsletter to ${user.email}:`, error);
          
          // Log failed email
          await EmailLog.create({
            recipient: user.email,
            recipientName: user.name,
            subject: `📰 ${month} ${year} Newsletter - PG & Bike Rental`,
            emailType: 'newsletter',
            status: 'failed',
            errorMessage: error.message,
            campaignId: campaignId,
            campaignName: campaign.name,
            templateUsed: 'newsletter',
            userId: user._id,
            sentBy: req.user.id
          });

          failureCount++;
          return { success: false, email: user.email, error: error.message };
        }
      });

      // Wait for current batch to complete
      await Promise.allSettled(emailPromises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    // Update campaign final stats
    campaign.stats.emailsSent = successCount;
    campaign.stats.emailsFailed = failureCount;
    campaign.status = 'sent';
    await campaign.save();

    res.json({
      success: true,
      message: 'Newsletter sent successfully',
      campaignId: campaignId,
      stats: {
        totalUsers: users.length,
        successCount,
        failureCount
      }
    });

  } catch (error) {
    console.error('Newsletter sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send newsletter' 
    });
  }
};

// Send Promotional Offer to All Users
export const sendPromotionalOffer = async (req, res) => {
  try {
    const { 
      offerTitle,
      discount,
      description,
      validTill,
      offerCode,
      terms,
      serviceType,
      originalPrice,
      discountedPrice,
      targetUserType // 'all', 'inactive', 'active', 'new'
    } = req.body;

    // Build user query based on target type
    let userQuery = { 
      emailVerified: true,
      'emailPreferences.promotional': { $ne: false }
    };

    if (targetUserType === 'inactive') {
      // Users who haven't booked in last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      userQuery.lastBookingDate = { $lt: thirtyDaysAgo };
    } else if (targetUserType === 'active') {
      // Users who booked in last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      userQuery.lastBookingDate = { $gte: thirtyDaysAgo };
    } else if (targetUserType === 'new') {
      // Users who registered in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      userQuery.createdAt = { $gte: sevenDaysAgo };
    }

    const users = await User.find(userQuery).select('name email');

    console.log(`🎉 Sending promotional offer to ${users.length} ${targetUserType} users...`);

    let successCount = 0;
    let failureCount = 0;
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (user) => {
        try {
          await sendEmail({
            to: user.email,
            subject: `🎉 ${offerTitle} - Special Offer Inside!`,
            html: emailTemplates.promotionalOffer({
              name: user.name,
              offerTitle,
              discount,
              description,
              validTill,
              offerCode,
              terms,
              serviceType,
              originalPrice,
              discountedPrice
            })
          });
          successCount++;
          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Failed to send offer to ${user.email}:`, error);
          failureCount++;
          return { success: false, email: user.email, error: error.message };
        }
      });

      await Promise.allSettled(emailPromises);
      
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    res.json({
      success: true,
      message: 'Promotional offer sent successfully',
      stats: {
        targetUserType,
        totalUsers: users.length,
        successCount,
        failureCount
      }
    });

  } catch (error) {
    console.error('Promotional offer sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send promotional offer' 
    });
  }
};

// Send Seasonal Campaign
export const sendSeasonalCampaign = async (req, res) => {
  try {
    const {
      season,
      campaignTitle,
      mainOffer,
      subOffers,
      bgColor,
      seasonIcon,
      campaignEndDate,
      targetLocation // Optional: target users by location
    } = req.body;

    let userQuery = { 
      emailVerified: true,
      'emailPreferences.promotional': { $ne: false }
    };

    // Add location filter if specified
    if (targetLocation) {
      userQuery['address.city'] = new RegExp(targetLocation, 'i');
    }

    const users = await User.find(userQuery).select('name email address');

    console.log(`🌟 Sending ${season} campaign to ${users.length} users...`);

    let successCount = 0;
    let failureCount = 0;
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (user) => {
        try {
          await sendEmail({
            to: user.email,
            subject: `${seasonIcon} ${campaignTitle} - Limited Time!`,
            html: emailTemplates.seasonalCampaign({
              name: user.name,
              season,
              campaignTitle,
              mainOffer,
              subOffers,
              bgColor,
              seasonIcon,
              campaignEndDate
            })
          });
          successCount++;
          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Failed to send campaign to ${user.email}:`, error);
          failureCount++;
          return { success: false, email: user.email, error: error.message };
        }
      });

      await Promise.allSettled(emailPromises);
      
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    res.json({
      success: true,
      message: 'Seasonal campaign sent successfully',
      stats: {
        season,
        totalUsers: users.length,
        successCount,
        failureCount,
        targetLocation: targetLocation || 'All locations'
      }
    });

  } catch (error) {
    console.error('Seasonal campaign sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send seasonal campaign' 
    });
  }
};

// Send Customer Retention Email to Inactive Users
export const sendRetentionEmail = async (req, res) => {
  try {
    const { missedYouDiscount, personalizedOffers } = req.body;

    // Find users who haven't booked in last 60 days
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    
    const inactiveUsers = await User.find({
      emailVerified: true,
      'emailPreferences.promotional': { $ne: false },
      lastBookingDate: { $lt: sixtyDaysAgo }
    }).select('name email lastBookingDate loyaltyPoints favoriteServices');

    console.log(`💌 Sending retention emails to ${inactiveUsers.length} inactive users...`);

    let successCount = 0;
    let failureCount = 0;
    const batchSize = 30; // Smaller batch for retention emails

    for (let i = 0; i < inactiveUsers.length; i += batchSize) {
      const batch = inactiveUsers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (user) => {
        try {
          await sendEmail({
            to: user.email,
            subject: '😊 We Miss You! Come Back with Special Offers',
            html: emailTemplates.customerRetention({
              name: user.name,
              lastBookingDate: user.lastBookingDate ? 
                new Date(user.lastBookingDate).toLocaleDateString() : 
                'A while ago',
              loyaltyPoints: user.loyaltyPoints || 0,
              personalizedOffers,
              missedYouDiscount,
              favoriteServices: user.favoriteServices?.join(', ') || 'PG & Bike Rental'
            })
          });
          successCount++;
          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Failed to send retention email to ${user.email}:`, error);
          failureCount++;
          return { success: false, email: user.email, error: error.message };
        }
      });

      await Promise.allSettled(emailPromises);
      
      if (i + batchSize < inactiveUsers.length) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay for retention emails
      }
    }

    res.json({
      success: true,
      message: 'Retention emails sent successfully',
      stats: {
        totalInactiveUsers: inactiveUsers.length,
        successCount,
        failureCount
      }
    });

  } catch (error) {
    console.error('Retention email sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send retention emails' 
    });
  }
};

// Get Email Campaign Statistics
export const getEmailStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ emailVerified: true });
    const newsletterSubscribers = await User.countDocuments({ 
      emailVerified: true,
      'emailPreferences.newsletter': { $ne: false }
    });
    const promotionalSubscribers = await User.countDocuments({ 
      emailVerified: true,
      'emailPreferences.promotional': { $ne: false }
    });

    // Inactive users (no booking in 60 days)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await User.countDocuments({
      emailVerified: true,
      lastBookingDate: { $lt: sixtyDaysAgo }
    });

    // New users (registered in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({
      emailVerified: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        newsletterSubscribers,
        promotionalSubscribers,
        inactiveUsers,
        newUsers,
        unsubscribedUsers: totalUsers - promotionalSubscribers
      }
    });

  } catch (error) {
    console.error('Failed to get email stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get email statistics' 
    });
  }
};
