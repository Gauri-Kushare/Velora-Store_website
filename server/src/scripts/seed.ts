import { SEED_PRODUCTS, SEED_PROMOTIONS } from '../data/seedData.js';
import { db } from '../data/store.js';

async function seed() {
  console.log('----------------------------------------------------');
  console.log('✨ VELORA Atelier Backend - Seed Status');
  console.log('----------------------------------------------------');
  console.log(`📦 Loaded ${SEED_PRODUCTS.length} curated products in INR currency.`);
  console.log(`👤 Seeded demo user: eleanor.vance@atelier-velora.com (Password: Velora2026!)`);
  console.log(`🏷️  Seeded promo codes: ${SEED_PROMOTIONS.map((p) => p.code).join(', ')}`);
  console.log('----------------------------------------------------');
  console.log('✅ Catalog and store initialized successfully.');
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
