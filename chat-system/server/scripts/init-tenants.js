require('dotenv').config();
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const crypto = require('crypto');

async function initTenants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_system');
    
    const tenants = [
      { name: 'Fixturerb2b', domain: 'fixturerb2b.top' },
      { name: 'Chinahuib2b', domain: 'chinahuib2b.top' }
    ];

    for (const t of tenants) {
      const existing = await Tenant.findOne({ domain: t.domain });
      if (!existing) {
        const apiKey = crypto.randomBytes(32).toString('hex');
        await Tenant.create({
          ...t,
          apiKey
        });
        console.log(`Created tenant: ${t.name} (API Key: ${apiKey})`);
      } else {
        console.log(`Tenant already exists: ${t.name}`);
      }
    }
    
    console.log('Tenant initialization complete');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

initTenants();
