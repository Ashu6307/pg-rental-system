const fs = require('fs');
const path = require('path');

// Read the additionalRooms.js file
const filePath = path.join(__dirname, 'additionalRooms.js');
let content = fs.readFileSync(filePath, 'utf8');

// Define the pricing updates
const pricingUpdates = [
  {
    // First property - Premium Studio Room
    old: `    pricing: {
      rent: 22000,
      securityDeposit: 44000,
      maintenanceCharges: 2500,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included",
      parkingCharges: 1200
    },`,
    new: `    pricing: {
      rent: 22000,
      securityDeposit: 44000,
      maintenanceCharges: 2500,
      electricityCharges: "Extra",
      electricityRate: 9, // ₹9 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 1200 // ₹1200 per month
    },`
  },
  {
    // Second property - Female PG Room
    old: `    pricing: {
      rent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1500,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included",
      parkingCharges: 0
    },`,
    new: `    pricing: {
      rent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1500,
      electricityCharges: "Extra",
      electricityRate: 6, // ₹6 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 0 // free parking
    },`
  },
  {
    // Third property - 2BHK Flat
    old: `    pricing: {
      rent: 45000,
      securityDeposit: 90000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Extra",
      parkingCharges: 2000
    },`,
    new: `    pricing: {
      rent: 45000,
      securityDeposit: 90000,
      maintenanceCharges: 4000,
      electricityCharges: "Extra",
      electricityRate: 8, // ₹8 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Extra",
      internetChargesAmount: 800, // ₹800 per month
      parkingCharges: 2000 // ₹2000 per month for car parking
    },`
  },
  {
    // Fourth property - Budget Student Room
    old: `    pricing: {
      rent: 8000,
      securityDeposit: 16000,
      maintenanceCharges: 800,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included",
      parkingCharges: 0
    },`,
    new: `    pricing: {
      rent: 8000,
      securityDeposit: 16000,
      maintenanceCharges: 800,
      electricityCharges: "As per usage",
      electricityRate: 5, // ₹5 per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: 0 // free parking
    },`
  },
  {
    // Fifth property - Luxury 3BHK
    old: `    pricing: {
      rent: 75000,
      securityDeposit: 150000,
      maintenanceCharges: 6000,
      electricityCharges: "Extra",
      waterCharges: "Included",
      internetCharges: "Included",
      parkingCharges: 3000
    },`,
    new: `    pricing: {
      rent: 75000,
      securityDeposit: 150000,
      maintenanceCharges: 6000,
      electricityCharges: "Extra",
      electricityRate: 12, // ₹12 per unit (luxury rate)
      waterCharges: "Extra",
      waterChargesAmount: 1200, // ₹1200 per month
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent (high speed)
      parkingCharges: 3000 // ₹3000 per month for 2 car parking
    },`
  }
];

// Apply all pricing updates
pricingUpdates.forEach(update => {
  content = content.replace(update.old, update.new);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ additionalRooms.js pricing structure updated successfully!');
