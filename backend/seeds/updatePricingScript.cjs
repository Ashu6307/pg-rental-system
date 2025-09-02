const fs = require('fs');
const path = require('path');

console.log('🔄 Starting pricing structure update script...');

// Function to update pricing structure in seed files
function updatePricingStructure() {
  const seedsDir = path.join(__dirname, '.');
  const filesToUpdate = ['roomSeeder.js', 'additionalRooms.js'];

  filesToUpdate.forEach(fileName => {
    const filePath = path.join(seedsDir, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`📝 Updating ${fileName}...`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update pricing patterns with realistic detailed charges
      const pricingUpdates = [
        // Pattern 1: Basic pricing with Extra electricity
        {
          search: /pricing:\s*{\s*rent:\s*(\d+),\s*securityDeposit:\s*(\d+),\s*maintenanceCharges:\s*(\d+),\s*electricityCharges:\s*"Extra",\s*waterCharges:\s*"Included",\s*internetCharges:\s*"Extra",\s*parkingCharges:\s*(\d+)\s*}/g,
          replace: (match, rent, deposit, maintenance, parking) => {
            const electricityRate = Math.floor(Math.random() * 4) + 6; // 6-10 per unit
            const internetAmount = Math.floor(Math.random() * 300) + 400; // 400-700
            return `pricing: {
      rent: ${rent},
      securityDeposit: ${deposit},
      maintenanceCharges: ${maintenance},
      electricityCharges: "Extra",
      electricityRate: ${electricityRate}, // ₹${electricityRate} per unit
      waterCharges: "Included",
      waterChargesAmount: 0,
      internetCharges: "Extra",
      internetChargesAmount: ${internetAmount}, // ₹${internetAmount} per month
      parkingCharges: ${parking} // ₹${parking} per month
    }`
          }
        },
        
        // Pattern 2: All included pricing
        {
          search: /pricing:\s*{\s*rent:\s*(\d+),\s*securityDeposit:\s*(\d+),\s*maintenanceCharges:\s*(\d+),\s*electricityCharges:\s*"Included",\s*waterCharges:\s*"Included",\s*internetCharges:\s*"Included",\s*parkingCharges:\s*(\d+)\s*}/g,
          replace: (match, rent, deposit, maintenance, parking) => {
            return `pricing: {
      rent: ${rent},
      securityDeposit: ${deposit},
      maintenanceCharges: ${maintenance},
      electricityCharges: "Included",
      electricityRate: 0, // included in rent
      waterCharges: "Included", 
      waterChargesAmount: 0,
      internetCharges: "Included",
      internetChargesAmount: 0, // included in rent
      parkingCharges: ${parking} // ${parking > 0 ? `₹${parking} per month` : 'free parking'}
    }`
          }
        },
        
        // Pattern 3: Mixed charges
        {
          search: /pricing:\s*{\s*rent:\s*(\d+),\s*securityDeposit:\s*(\d+),\s*maintenanceCharges:\s*(\d+),\s*electricityCharges:\s*"([^"]+)",\s*waterCharges:\s*"([^"]+)",\s*internetCharges:\s*"([^"]+)",\s*parkingCharges:\s*(\d+)\s*}/g,
          replace: (match, rent, deposit, maintenance, elec, water, internet, parking) => {
            const electricityRate = elec === "Extra" ? Math.floor(Math.random() * 4) + 6 : 0;
            const waterAmount = water === "Extra" ? Math.floor(Math.random() * 200) + 300 : 0;
            const internetAmount = internet === "Extra" ? Math.floor(Math.random() * 300) + 400 : 0;
            
            return `pricing: {
      rent: ${rent},
      securityDeposit: ${deposit},
      maintenanceCharges: ${maintenance},
      electricityCharges: "${elec}",
      electricityRate: ${electricityRate}, ${elec === "Extra" ? `// ₹${electricityRate} per unit` : '// included in rent'}
      waterCharges: "${water}",
      waterChargesAmount: ${waterAmount}, ${water === "Extra" ? `// ₹${waterAmount} per month` : ''}
      internetCharges: "${internet}",
      internetChargesAmount: ${internetAmount}, ${internet === "Extra" ? `// ₹${internetAmount} per month` : '// included in rent'}
      parkingCharges: ${parking} ${parking > 0 ? `// ₹${parking} per month` : '// free parking'}
    }`
          }
        }
      ];

      // Apply all pricing updates
      pricingUpdates.forEach((update, index) => {
        const beforeLength = content.length;
        content = content.replace(update.search, update.replace);
        const afterLength = content.length;
        
        if (beforeLength !== afterLength) {
          console.log(`  ✅ Applied pricing pattern ${index + 1} to ${fileName}`);
        }
      });

      // Write updated content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  💾 Updated ${fileName} successfully`);
      
    } else {
      console.log(`  ⚠️  File ${fileName} not found`);
    }
  });
}

// Function to update seed runner to handle new pricing fields
function updateSeedRunner() {
  const runnerPath = path.join(__dirname, 'runAllRoomSeeds.js');
  
  if (fs.existsSync(runnerPath)) {
    console.log('📝 Updating runAllRoomSeeds.js...');
    
    let content = fs.readFileSync(runnerPath, 'utf8');
    
    // Add validation for new pricing fields
    const validationCode = `
    // Add default values for new pricing fields if missing
    const roomsWithDefaults = allRoomsData.map(room => ({
      ...room,
      owner: new mongoose.Types.ObjectId(),
      status: 'Active',
      verified: true,
      featured: false,
      viewCount: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure pricing structure has all required fields
      pricing: {
        ...room.pricing,
        electricityRate: room.pricing.electricityRate || (room.pricing.electricityCharges === "Extra" ? 8 : 0),
        waterChargesAmount: room.pricing.waterChargesAmount || (room.pricing.waterCharges === "Extra" ? 300 : 0),
        internetChargesAmount: room.pricing.internetChargesAmount || (room.pricing.internetCharges === "Extra" ? 500 : 0),
        parkingCharges: room.pricing.parkingCharges || 0
      },`;
    
    // Replace the existing roomsWithDefaults mapping
    if (content.includes('const roomsWithDefaults = allRoomsData.map(room => ({')) {
      content = content.replace(
        /const roomsWithDefaults = allRoomsData\.map\(room => \(\{[\s\S]*?\}\)\);/,
        validationCode.trim() + `
      // Ensure tenantPreferences structure
      tenantPreferences: {
        ...room.tenantPreferences,
        occupationType: room.tenantPreferences?.occupationType || ["Working Professional"],
        foodPreference: room.tenantPreferences?.foodPreference === "Any" ? "Both" : (room.tenantPreferences?.foodPreference || "Both")
      },
      // Add area images if not present
      media: {
        ...room.media,
        areaImages: room.media?.areaImages || {
          kitchen: [],
          bedroom: [],
          bathroom: [],
          balcony: [],
          livingRoom: [],
          parking: [],
          entrance: [],
          others: []
        }
      }
    }));`
      );
      
      fs.writeFileSync(runnerPath, content, 'utf8');
      console.log('  ✅ Updated runAllRoomSeeds.js with new pricing validation');
    }
  }
}

// Execute the updates
try {
  updatePricingStructure();
  updateSeedRunner();
  
  console.log('\n🎉 Pricing structure update completed successfully!');
  console.log('\n📋 Changes made:');
  console.log('   ✅ Added electricityRate field (₹6-10 per unit for Extra)');
  console.log('   ✅ Added waterChargesAmount field (₹300-500 per month for Extra)');
  console.log('   ✅ Added internetChargesAmount field (₹400-700 per month for Extra)');
  console.log('   ✅ Enhanced parkingCharges with clear pricing');
  console.log('   ✅ Updated seed runner with validation');
  console.log('\n🔄 Run "node seeds/runAllRoomSeeds.js" to test the updated structure');
  
} catch (error) {
  console.error('❌ Error updating pricing structure:', error.message);
  process.exit(1);
}
