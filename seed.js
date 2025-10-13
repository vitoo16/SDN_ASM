require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Member = require('./backend/models/Member');
const Brand = require('./backend/models/Brand');
const Perfume = require('./backend/models/Perfume');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/perfume_db');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Member.deleteMany({});
    await Brand.deleteMany({});
    await Perfume.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Member({
      email: 'admin@myteam.com',
      password: hashedPassword,
      name: 'Do Nam Trung',
      YOB: 1990,
      gender: true,
      isAdmin: true
    });
    await admin.save();

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new Member({
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      YOB: 1995,
      gender: true,
      isAdmin: false
    });
    await user.save();

    // Create brands
    const brands = [
      { brandName: 'Chanel' },
      { brandName: 'Dior' },
      { brandName: 'Tom Ford' },
      { brandName: 'Versace' },
      { brandName: 'Armani' },
      { brandName: 'Calvin Klein' },
    ];

    const createdBrands = await Brand.insertMany(brands);

    // Create perfumes
    const perfumes = [
      {
        perfumeName: 'Bleu de Chanel',
        uri: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400',
        price: 120,
        concentration: 'EDP',
        description: 'A captivating scent that embodies freedom with its fresh and clean aromatic-woody composition.',
        ingredients: 'Citrus, Cedar, Sandalwood, Ginger',
        volume: 100,
        targetAudience: 'male',
        brand: createdBrands[0]._id,
        comments: []
      },
      {
        perfumeName: 'Miss Dior',
        uri: 'https://images.unsplash.com/photo-1594736797933-d0d501ba2fe6?w=400',
        price: 95,
        concentration: 'EDT',
        description: 'A floral fragrance with notes of Italian mandarin and blood orange.',
        ingredients: 'Mandarin, Blood Orange, Rose, Patchouli',
        volume: 50,
        targetAudience: 'female',
        brand: createdBrands[1]._id,
        comments: []
      },
      {
        perfumeName: 'Black Orchid',
        uri: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400',
        price: 180,
        concentration: 'Extrait',
        description: 'A luxurious and sensual fragrance with dark accords and an alluring potion of black orchids.',
        ingredients: 'Black Orchid, Dark Chocolate, Incense, Patchouli, Vanilla',
        volume: 50,
        targetAudience: 'unisex',
        brand: createdBrands[2]._id,
        comments: []
      },
      {
        perfumeName: 'Bright Crystal',
        uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        price: 65,
        concentration: 'EDT',
        description: 'A fresh, vibrant, and flowery fragrance, with a delicious sensuality.',
        ingredients: 'Pomegranate, Yuzu, Peony, Magnolia, Musk',
        volume: 90,
        targetAudience: 'female',
        brand: createdBrands[3]._id,
        comments: []
      },
      {
        perfumeName: 'Acqua di Gio',
        uri: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400',
        price: 85,
        concentration: 'EDT',
        description: 'A fresh aquatic fragrance inspired by the sea, wind, and rock.',
        ingredients: 'Bergamot, Lime, Jasmine, Rock Rose, Cedar',
        volume: 100,
        targetAudience: 'male',
        brand: createdBrands[4]._id,
        comments: []
      },
      {
        perfumeName: 'CK One',
        uri: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
        price: 45,
        concentration: 'EDT',
        description: 'A clean, fresh unisex fragrance with citrus, green tea, and musk.',
        ingredients: 'Lemon, Bergamot, Green Tea, Musk, Amber',
        volume: 100,
        targetAudience: 'unisex',
        brand: createdBrands[5]._id,
        comments: []
      }
    ];

    await Perfume.insertMany(perfumes);

    console.log('Seed data inserted successfully!');
    console.log('Admin credentials: admin@myteam.com / admin123');
    console.log('User credentials: user@example.com / user123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();