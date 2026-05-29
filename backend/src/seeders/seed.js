require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/sequelize');
const { User, Store, Rating } = require('../src/models');

const hash = (pw) => bcrypt.hash(pw, 12);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ force: true });
    console.log('Schema synced (all tables reset)');

    const [adminPw, owner1Pw, owner2Pw, user1Pw, user2Pw, user3Pw] = await Promise.all([
      hash('Admin@1234'),
      hash('Owner@1234'),
      hash('Owner@1234'),
      hash('User@12345'),
      hash('User@12345'),
      hash('User@12345'),
    ]);

    const admin = await User.create({
      name: 'System Administrator Account',
      email: 'admin@storerate.com',
      password: adminPw,
      address: '123 Admin Street, Platform City, PC 00001',
      role: 'admin',
    });

    const owner1 = await User.create({
      name: 'Alexandra Johnson Store Owner',
      email: 'alex.johnson@storerate.com',
      password: owner1Pw,
      address: '456 Commerce Blvd, Business District, BD 10001',
      role: 'owner',
    });

    const owner2 = await User.create({
      name: 'Marcus Williams Retail Entrepreneur',
      email: 'marcus.williams@storerate.com',
      password: owner2Pw,
      address: '789 Market Street, Merchant Quarter, MQ 20002',
      role: 'owner',
    });

    const user1 = await User.create({
      name: 'Priya Sharma Regular Customer Account',
      email: 'priya.sharma@example.com',
      password: user1Pw,
      address: '12 Residential Lane, Suburb Heights, SH 30003',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Daniel Chen Frequent Shopper Profile',
      email: 'daniel.chen@example.com',
      password: user2Pw,
      address: '34 Apartment Complex, Downtown, DT 40004',
      role: 'user',
    });

    const user3 = await User.create({
      name: 'Fatima Al-Hassan Customer Member',
      email: 'fatima.alhassan@example.com',
      password: user3Pw,
      address: '56 Garden Terrace, Eastside, ES 50005',
      role: 'user',
    });

    console.log(' Users created');


    const store1 = await Store.create({
      name: 'Alexandra Fresh Groceries and Organic Produce',
      email: 'fresh.groceries@alexstores.com',
      address: '10 Green Market Lane, Food District, FD 11001',
      ownerId: owner1.id,
    });

    const store2 = await Store.create({
      name: 'Alexandra Premium Electronics and Gadgets Hub',
      email: 'electronics@alexstores.com',
      address: '20 Tech Park Avenue, Silicon Quarter, SQ 11002',
      ownerId: owner1.id,
    });

    const store3 = await Store.create({
      name: 'Marcus Williams Fashion and Lifestyle Boutique',
      email: 'fashion@marcusstores.com',
      address: '30 Style Street, Fashion District, FD 22001',
      ownerId: owner2.id,
    });

    const store4 = await Store.create({
      name: 'Marcus Williams Home and Garden Supplies Store',
      email: 'homeandgarden@marcusstores.com',
      address: '40 Bloom Avenue, Garden City, GC 22002',
      ownerId: owner2.id,
    });

    console.log(' Stores created');

    // ── Ratings ────────────────────────────────────────────
    await Rating.bulkCreate([
      { userId: user1.id, storeId: store1.id, value: 5 },
      { userId: user2.id, storeId: store1.id, value: 4 },
      { userId: user3.id, storeId: store1.id, value: 5 },

      { userId: user1.id, storeId: store2.id, value: 3 },
      { userId: user2.id, storeId: store2.id, value: 4 },

      { userId: user1.id, storeId: store3.id, value: 4 },
      { userId: user3.id, storeId: store3.id, value: 5 },

      { userId: user2.id, storeId: store4.id, value: 2 },
      { userId: user3.id, storeId: store4.id, value: 3 },
    ]);

    console.log(' Ratings created');

    console.log('\nSeed complete!\n');
    console.log('─────────────────────────────────────────────');
    console.log('Login credentials:');
    console.log('  Admin      → admin@storerate.com       / Admin@1234');
    console.log('  Owner 1    → alex.johnson@storerate.com / Owner@1234');
    console.log('  Owner 2    → marcus.williams@storerate.com / Owner@1234');
    console.log('  User 1     → priya.sharma@example.com  / User@12345');
    console.log('  User 2     → daniel.chen@example.com   / User@12345');
    console.log('  User 3     → fatima.alhassan@example.com / User@12345');
    console.log('─────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌Seed failed:', error);
    process.exit(1);
  }
}

seed();
