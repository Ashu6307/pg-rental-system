import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import AuditLog from './models/AuditLog.js';
import Bike from './models/Bike.js';
import Booking from './models/Booking.js';
import Consent from './models/Consent.js';
import Favorite from './models/Favorite.js';
import GDPRConsent from './models/GDPRConsent.js';
import Invoice from './models/Invoice.js';
import Loyalty from './models/Loyalty.js';
import NotificationPreference from './models/NotificationPreference.js';
import Notification from './models/Notification.js';
import OtpAudit from './models/OtpAudit.js';
import Otp from './models/Otp.js';
import OwnerDocument from './models/OwnerDocument.js';
import OwnerProfile from './models/OwnerProfile.js';
import PG from './models/PG.js';
import RateLimitFeedback from './models/RateLimitFeedback.js';
import Review from './models/Review.js';
import Setting from './models/Settings.js';
import Tenant from './models/Tenant.js';
import User from './models/User.js';
import VersionedSetting from './models/VersionedSetting.js';
import WebhookLog from './models/WebhookLog.js';

const MONGO_URI = 'mongodb+srv://ashu6307:Rita1602@cluster0.hf2iy.mongodb.net/pg_bike_rental';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Purana data delete karo
  await Admin.deleteMany({});
  await AuditLog.deleteMany({});
  await Bike.deleteMany({});
  await Booking.deleteMany({});
  await Consent.deleteMany({});
  await Favorite.deleteMany({});
  await GDPRConsent.deleteMany({});
  await Invoice.deleteMany({});
  await Loyalty.deleteMany({});
  await NotificationPreference.deleteMany({});
  await Notification.deleteMany({});
  await OtpAudit.deleteMany({});
  await Otp.deleteMany({});
  await OwnerDocument.deleteMany({});
  await OwnerProfile.deleteMany({});
  await PG.deleteMany({});
  await RateLimitFeedback.deleteMany({});
  await Review.deleteMany({});
  await Setting.deleteMany({});
  await Tenant.deleteMany({});
  await User.deleteMany({});
  await VersionedSetting.deleteMany({});
  await WebhookLog.deleteMany({});
  // Create Users
  const users = await User.create([
    { name: 'Test User', email: 'user1@example.com', password_hash: 'hashed1', role: 'user', status: 'active' },
    { name: 'Owner User', email: 'owner1@example.com', password_hash: 'hashed2', role: 'owner', status: 'active' },
    { name: 'Admin User', email: 'admin1@example.com', password_hash: 'hashed3', role: 'admin', status: 'active' }
  ]);

  // Create Admins
  const admins = await Admin.create([
    { name: 'Main Admin', email: 'admin@example.com', password: 'hashed', settingsVersion: 1 },
    { name: 'Sub Admin', email: 'subadmin@example.com', password: 'hashed', settingsVersion: 1 }
  ]);

  // Create OwnerProfiles
  const owners = await OwnerProfile.create([
    { owner_id: users[1]._id, business_type: 'Both', name: 'Owner One', email: 'owner1@example.com', phone: '9999999999', address: 'City', approval_status: 'approved', consent: true },
    { owner_id: users[2]._id, business_type: 'Bike', name: 'Owner Two', email: 'owner2@example.com', phone: '8888888888', address: 'Metro', approval_status: 'pending', consent: false }
  ]);

  // Create Bikes
  const bikes = await Bike.create([
    {
      owner_id: owners[0]._id,
      brand: 'Hero',
      model: 'Splendor',
      type: 'Standard',
      year: 2022,
      color: 'Black',
      mileage: 60,
      fuelType: 'Petrol',
      transmission: 'Manual',
      number_plate: 'DL01AB1234',
      registrationNumber: 'REG2025001',
      price_per_day: 200,
      price_per_week: 1200,
      price_per_month: 4000,
      available: true,
      status: 'approved',
      verificationStatus: 'verified',
      description: 'Hero Splendor, best for city rides.',
      images: [],
      features: ['Self Start', 'Disc Brake'],
    },
    {
      owner_id: owners[1]._id,
      brand: 'Honda',
      model: 'Activa',
      type: 'Scooter',
      year: 2023,
      color: 'White',
      mileage: 50,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      number_plate: 'DL02CD5678',
      registrationNumber: 'REG2025002',
      price_per_day: 250,
      price_per_week: 1400,
      price_per_month: 4500,
      available: true,
      status: 'pending',
      verificationStatus: 'pending',
      description: 'Honda Activa, perfect for daily commute.',
      images: [],
      features: ['Mobile Charger', 'LED Headlamp'],
    }
  ]);

  // Create PGs
  const pgs = await PG.create([
    {
      name: 'PG Residency',
      address: 'Main Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      owner: owners[0]._id,
      contactNumber: '9999999999',
      email: 'pg1@example.com',
      rooms: 20,
      availableRooms: 5,
      price: 5000,
      priceType: 'monthly',
      pgType: 'Single',
      deposit: 10000,
      status: 'active',
      amenities: ['WiFi', 'Laundry'],
      rules: ['No Smoking'],
      furnished: true,
      foodIncluded: true,
      genderAllowed: 'both',
      allowedVisitors: true,
      parkingAvailable: true,
      wifiAvailable: true,
      acAvailable: true,
      laundryAvailable: true,
      security: '24x7 Guard',
      cctv: true,
      fireSafety: true,
      petsAllowed: false,
      description: 'Best PG in Delhi',
      nearby: ['Metro', 'Mall'],
      documents: [],
      verificationStatus: 'verified',
    }
  ]);

  // Create Bookings
  await Booking.create([
    {
      user_id: users[0]._id,
      item_type: 'Bike',
      item_id: bikes[0]._id,
      from_date: new Date(),
      to_date: new Date(Date.now() + 86400000),
      amount: 200,
      status: 'confirmed',
    },
    {
      user_id: users[0]._id,
      item_type: 'PG',
      item_id: pgs[0]._id,
      from_date: new Date(),
      to_date: new Date(Date.now() + 2592000000),
      amount: 5000,
      status: 'confirmed',
    }
  ]);

  // Create Reviews
  await Review.create([
    {
      user_id: users[0]._id,
      item_type: 'Bike',
      item_id: bikes[0]._id,
      rating: 5,
      comment: 'Bahut badiya bike hai!'
    },
    {
      user_id: users[0]._id,
      item_type: 'PG',
      item_id: pgs[0]._id,
      rating: 4,
      comment: 'PG location mast hai.'
    }
  ]);

  // Create Favorites
  await Favorite.create([
    { user_id: users[0]._id, item_type: 'Bike', item_id: bikes[0]._id },
    { user_id: users[0]._id, item_type: 'PG', item_id: pgs[0]._id }
  ]);

  // Create AuditLogs
  await AuditLog.create([
    { action: 'login', performed_by: users[2]._id, target_id: users[2]._id, target_type: 'Admin', details: { info: 'Admin login' } },
    { action: 'booking', performed_by: users[0]._id, target_id: bikes[0]._id, target_type: 'Bike', details: { info: 'Bike booked' } }
  ]);

  // Create Consent
  await Consent.create([
    { email: users[0].email, consentType: 'marketing', details: 'Accepted', tenantId: 'tenant1' },
    { email: users[1].email, consentType: 'terms', details: 'Accepted', tenantId: 'tenant1' }
  ]);

  // Create GDPRConsent
  await GDPRConsent.create([
    { user: users[0]._id, consentGiven: true, consentDate: new Date(), consentType: 'terms' },
    { user: users[1]._id, consentGiven: false, consentDate: new Date(), consentType: 'marketing' }
  ]);

  // Create Invoice
  await Invoice.create([
    { invoiceId: 'INV2025001', bookingId: 'BK001', user: users[0]._id, itemType: 'Bike', itemName: 'Hero Splendor', amount: 200, paymentStatus: 'paid' },
    { invoiceId: 'INV2025002', bookingId: 'BK002', user: users[0]._id, itemType: 'PG', itemName: 'PG Residency', amount: 5000, paymentStatus: 'paid' }
  ]);

  // Create Loyalty
  await Loyalty.create([
    { userId: users[0]._id, points: 100, rewards: [{ type: 'discount', value: '10%' }] },
    { userId: users[1]._id, points: 50, rewards: [{ type: 'cashback', value: '₹100' }] }
  ]);

  // Create NotificationPreference
  await NotificationPreference.create([
    { ownerId: owners[0]._id, email: true, sms: false, push: true, frequency: 'instant', channels: ['email', 'push'] },
    { ownerId: owners[1]._id, email: false, sms: true, push: false, frequency: 'daily', channels: ['sms'] }
  ]);

  // Create Notification
  await Notification.create([
    { user_id: users[0]._id, type: 'email', message: 'Welcome!', channel: 'email', status: 'sent' },
    { user_id: users[1]._id, type: 'sms', message: 'Booking confirmed!', channel: 'sms', status: 'sent' }
  ]);

  // Create OtpAudit
  await OtpAudit.create([
    { email: users[0].email, action: 'send', status: 'success', message: 'OTP sent', ip: '127.0.0.1' },
    { email: users[1].email, action: 'verify', status: 'success', message: 'OTP verified', ip: '127.0.0.1' }
  ]);

  // Create Otp
  await Otp.create([
    { email: users[0].email, otp: '123456', expiresAt: new Date(Date.now() + 600000), verified: false },
    { email: users[1].email, otp: '654321', expiresAt: new Date(Date.now() + 600000), verified: true }
  ]);

  // Create OwnerDocument
  await OwnerDocument.create([
    { owner: owners[0]._id, type: 'Aadhaar', fileUrl: 'url1', expiryDate: new Date(Date.now() + 31536000000), consent: true },
    { owner: owners[1]._id, type: 'PAN', fileUrl: 'url2', expiryDate: new Date(Date.now() + 31536000000), consent: false }
  ]);

  // Create RateLimitFeedback
  await RateLimitFeedback.create([
    { ownerId: owners[0]._id, endpoint: '/api/bookings', feedback: 'Too many requests', status: 'pending' },
    { ownerId: owners[1]._id, endpoint: '/api/bikes', feedback: 'Rate limit hit', status: 'reviewed' }
  ]);

  // Create Setting
  await Setting.create([
    { key: 'site_name', value: 'PG & Bike Rental', version: 1, updatedBy: admins[0]._id },
    { key: 'theme', value: 'dark', version: 2, updatedBy: admins[1]._id }
  ]);

  // Create Tenant
  await Tenant.create([
    { name: 'Tenant One', domain: 'tenant1.com', owner: owners[0]._id, settings: {} },
    { name: 'Tenant Two', domain: 'tenant2.com', owner: owners[1]._id, settings: {} }
  ]);

  // Create VersionedSetting
  await VersionedSetting.create([
    { ownerId: owners[0]._id, key: 'theme', value: 'dark', version: 1, history: [] },
    { ownerId: owners[1]._id, key: 'notifications', value: 'enabled', version: 2, history: [] }
  ]);

  // Create WebhookLog
  await WebhookLog.create([
    { ownerId: owners[0]._id, event: 'booking_created', payload: { bookingId: 'BK001' }, status: 'success' },
    { ownerId: owners[1]._id, event: 'bike_added', payload: { bikeId: bikes[1]._id }, status: 'pending' }
  ]);

  await mongoose.disconnect();
  console.log('Sample data inserted in all collections.');
}

seed();
