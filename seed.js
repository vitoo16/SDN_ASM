require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Member = require("./backend/models/Member");
const Brand = require("./backend/models/Brand");
const Perfume = require("./backend/models/Perfume");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/perfume_db"
    );
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("Database connection error:", error);
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
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Member({
      email: "admin@myteam.com",
      password: hashedPassword,
      name: "Do Nam Trung",
      YOB: 1990,
      gender: true,
      isAdmin: true,
    });
    await admin.save();

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const user = new Member({
      email: "user@example.com",
      password: userPassword,
      name: "John Doe",
      YOB: 1995,
      gender: true,
      isAdmin: false,
    });
    await user.save();

    // Create brands
    const brands = [
      { brandName: "Chanel" },
      { brandName: "Dior" },
      { brandName: "Tom Ford" },
      { brandName: "Versace" },
      { brandName: "Armani" },
      { brandName: "Calvin Klein" },
    ];

    const createdBrands = await Brand.insertMany(brands);

    // Create perfumes
    const perfumes = [
      // Your existing perfumes
      {
        perfumeName: "Bleu de Chanel",
        uri: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
        price: 120,
        concentration: "EDP",
        description:
          "A captivating scent that embodies freedom with its fresh and clean aromatic-woody composition.",
        ingredients: "Citrus, Cedar, Sandalwood, Ginger",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[0]._id,
        comments: [],
      },
      {
        perfumeName: "Miss Dior",
        uri: "https://images.unsplash.com/photo-1594736797933-d0d501ba2fe6?w=400",
        price: 95,
        concentration: "EDT",
        description:
          "A floral fragrance with notes of Italian mandarin and blood orange.",
        ingredients: "Mandarin, Blood Orange, Rose, Patchouli",
        volume: 50,
        targetAudience: "female",
        brand: createdBrands[1]._id,
        comments: [],
      },
      {
        perfumeName: "Black Orchid",
        uri: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400",
        price: 180,
        concentration: "Extrait",
        description:
          "A luxurious and sensual fragrance with dark accords and an alluring potion of black orchids.",
        ingredients:
          "Black Orchid, Dark Chocolate, Incense, Patchouli, Vanilla",
        volume: 50,
        targetAudience: "unisex",
        brand: createdBrands[2]._id,
        comments: [],
      },
      {
        perfumeName: "Bright Crystal",
        uri: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        price: 65,
        concentration: "EDT",
        description:
          "A fresh, vibrant, and flowery fragrance, with a delicious sensuality.",
        ingredients: "Pomegranate, Yuzu, Peony, Magnolia, Musk",
        volume: 90,
        targetAudience: "female",
        brand: createdBrands[3]._id,
        comments: [],
      },
      {
        perfumeName: "Acqua di Gio",
        uri: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400",
        price: 85,
        concentration: "EDT",
        description:
          "A fresh aquatic fragrance inspired by the sea, wind, and rock.",
        ingredients: "Bergamot, Lime, Jasmine, Rock Rose, Cedar",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[4]._id,
        comments: [],
      },
      {
        perfumeName: "CK One",
        uri: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
        price: 45,
        concentration: "EDT",
        description:
          "A clean, fresh unisex fragrance with citrus, green tea, and musk.",
        ingredients: "Lemon, Bergamot, Green Tea, Musk, Amber",
        volume: 100,
        targetAudience: "unisex",
        brand: createdBrands[5]._id,
        comments: [],
      },
      // Additional perfumes
      {
        perfumeName: "Sauvage",
        uri: "https://images.unsplash.com/photo-1588405748880-12d1d2a59bd9?w=400",
        price: 110,
        concentration: "EDP",
        description:
          "A wild, raw and noble fragrance inspired by wide-open spaces and the blue hour twilight.",
        ingredients: "Bergamot, Pepper, Lavender, Ambroxan, Vanilla",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[1]._id,
        comments: [],
      },
      {
        perfumeName: "La Vie Est Belle",
        uri: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400",
        price: 98,
        concentration: "EDP",
        description:
          "A sweet and floral gourmand fragrance celebrating freedom, happiness, and elegance.",
        ingredients: "Iris, Patchouli, Praline, Vanilla, Blackcurrant",
        volume: 75,
        targetAudience: "female",
        brand: createdBrands[0]._id,
        comments: [],
      },
      {
        perfumeName: "Aventus",
        uri: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
        price: 350,
        concentration: "EDP",
        description:
          "A sophisticated blend celebrating strength, power and success, inspired by Napoleon.",
        ingredients: "Pineapple, Bergamot, Birch, Musk, Oakmoss",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[2]._id,
        comments: [],
      },
      {
        perfumeName: "Good Girl",
        uri: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400",
        price: 105,
        concentration: "EDP",
        description:
          "A bold fragrance celebrating the duality of modern women, both good and bad.",
        ingredients: "Almond, Coffee, Tuberose, Tonka Bean, Cacao",
        volume: 80,
        targetAudience: "female",
        brand: createdBrands[3]._id,
        comments: [],
      },
      {
        perfumeName: "Eros",
        uri: "https://images.unsplash.com/photo-1541108564107-b0e38a9f6719?w=400",
        price: 88,
        concentration: "EDT",
        description:
          "A passionate fragrance that fuses woody, oriental and fresh notes for a powerful masculine scent.",
        ingredients: "Mint, Green Apple, Tonka Bean, Vanilla, Vetiver",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[3]._id,
        comments: [],
      },
      {
        perfumeName: "Light Blue",
        uri: "https://images.unsplash.com/photo-1592342913546-17c36170e26f?w=400",
        price: 78,
        concentration: "EDT",
        description:
          "A fresh, fruity and floral fragrance reminiscent of the sunny sensuality of Mediterranean summer.",
        ingredients: "Sicilian Lemon, Apple, Bamboo, Jasmine, Cedar",
        volume: 100,
        targetAudience: "female",
        brand: createdBrands[4]._id,
        comments: [],
      },
      {
        perfumeName: "Aventus for Her",
        uri: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400",
        price: 340,
        concentration: "EDP",
        description:
          "A sophisticated fruity chypre fragrance created for the dynamic modern woman.",
        ingredients: "Green Apple, Pink Pepper, Rose, Musk, Sandalwood",
        volume: 75,
        targetAudience: "female",
        brand: createdBrands[2]._id,
        comments: [],
      },
      {
        perfumeName: "Invictus",
        uri: "https://images.unsplash.com/photo-1600428853743-5c30b2c6d8c7?w=400",
        price: 92,
        concentration: "EDT",
        description:
          "A powerful fragrance of victory embodying strength, dynamism and energy.",
        ingredients: "Grapefruit, Sea Notes, Guaiac Wood, Patchouli, Ambergris",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[5]._id,
        comments: [],
      },
      {
        perfumeName: "Flowerbomb",
        uri: "https://images.unsplash.com/photo-1528993185703-6d39d3c9b443?w=400",
        price: 115,
        concentration: "EDP",
        description:
          "An explosive bouquet of sensations with a profusion of flowers in a powerful floral.",
        ingredients: "Tea, Bergamot, Freesia, Orchid, Patchouli",
        volume: 100,
        targetAudience: "female",
        brand: createdBrands[3]._id,
        comments: [],
      },
      {
        perfumeName: "The One",
        uri: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
        price: 82,
        concentration: "EDP",
        description:
          "A warm, spicy oriental fragrance that exudes confidence and masculinity.",
        ingredients: "Grapefruit, Coriander, Cardamom, Tobacco, Cedar",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[4]._id,
        comments: [],
      },
      {
        perfumeName: "Coco Mademoiselle",
        uri: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400",
        price: 125,
        concentration: "EDP",
        description:
          "A fresh, modern oriental fragrance that embodies boldness and elegance.",
        ingredients: "Orange, Bergamot, Rose, Jasmine, Patchouli, Vanilla",
        volume: 100,
        targetAudience: "female",
        brand: createdBrands[0]._id,
        comments: [],
      },
      {
        perfumeName: "Tobacco Vanille",
        uri: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
        price: 250,
        concentration: "EDP",
        description:
          "A luxurious opulent oriental with creamy tonka bean, vanilla, and tobacco flower.",
        ingredients: "Tobacco Leaf, Vanilla, Cocoa, Tonka Bean, Dried Fruits",
        volume: 50,
        targetAudience: "unisex",
        brand: createdBrands[2]._id,
        comments: [],
      },
      {
        perfumeName: "Si",
        uri: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
        price: 98,
        concentration: "EDP",
        description:
          "A sophisticated chypre fragrance for the modern woman who dares to say yes.",
        ingredients: "Blackcurrant, Freesia, Rose, Vanilla, Patchouli",
        volume: 100,
        targetAudience: "female",
        brand: createdBrands[4]._id,
        comments: [],
      },
      {
        perfumeName: "1 Million",
        uri: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=400",
        price: 89,
        concentration: "EDT",
        description:
          "A spicy oriental fragrance that radiates sensuality, freshness and seduction.",
        ingredients: "Blood Mandarin, Grapefruit, Cinnamon, Rose, Leather",
        volume: 100,
        targetAudience: "male",
        brand: createdBrands[5]._id,
        comments: [],
      },
    ];

    await Perfume.insertMany(perfumes);

    console.log("Seed data inserted successfully!");
    console.log("Admin credentials: admin@myteam.com / admin123");
    console.log("User credentials: user@example.com / user123");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
