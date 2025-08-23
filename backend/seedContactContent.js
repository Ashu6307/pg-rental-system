// Seed script for Contact page content based on unified Content schema
import mongoose from 'mongoose';
import Content from './models/Content.js';

const contactContent = {
  type: 'contact',
  hero: {
    title: 'Contact Us',
    subtitle: 'Get in Touch',
    description: [
      'Reach out to us for any queries, support, or partnership opportunities.',
      'We are here to help you with PG accommodation and bike rental services.'
    ]
  },
  contactInfo: {
    address: {
      street: '456 City Center',
      city: 'Metro City',
      state: 'StateName',
      pincode: '654321'
    },
    phone: {
      primary: '+91-9876543210',
      whatsapp: '+91-9876543211'
    },
    email: 'contact@pgbikerental.com',
    whatsapp: '+91-9876543211',
    workingHours: {
      start: '9:00 AM',
      end: '7:00 PM'
    },
    additional: 'You can also reach us via WhatsApp or email for faster response.'
  },
  offices: [
    {
      name: 'Metro City Office',
      address: {
        street: '456 City Center',
        city: 'Metro City',
        state: 'StateName',
        pincode: '654321'
      },
      contact: {
        phone: '+91-9876543210'
      },
      services: {
        pgRentals: true,
        bikeRentals: true,
        maintenance: true,
        insurance: false
      },
      workingHours: {
        start: '9:00 AM',
        end: '7:00 PM'
      }
    }
  ],
  faq: [
    {
      question: 'How can I book a PG or bike?',
      answer: 'You can book directly from our website or contact us using the form.'
    },
    {
      question: 'What documents are required?',
      answer: 'A valid ID proof and address proof are required for booking.'
    },
    {
      question: 'Is there customer support?',
      answer: 'Yes, our support team is available during working hours.'
    }
  ],
  team: [],
  for: 'public',
  updatedAt: new Date()
};

async function seedContactContent() {
  await mongoose.connect('mongodb://localhost:27017/yourdbname');
  await Content.deleteOne({ type: 'contact' });
  await Content.create(contactContent);
  console.log('Contact page content seeded successfully!');
  mongoose.disconnect();
}

seedContactContent();
