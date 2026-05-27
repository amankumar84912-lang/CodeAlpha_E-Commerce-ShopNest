/**
 * seeder.js — populates (or destroys) the products collection.
 *
 * Usage:
 *   npm run seed          → import 20 demo products
 *   npm run seed:destroy  → wipe all products
 */
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  /* ──── SMARTPHONES ──── */
  {
    title:       "Apple iPhone 15 Pro",
    description: "The most powerful iPhone ever. Featuring the A17 Pro chip, a pro-grade camera system with 48MP main, a titanium design, and the Action button — built for those who demand the best.",
    price:       134900,
    category:    "smartphones",
    image:       "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop",
    stock:       42,
    rating:      4.8,
    numReviews:  2341,
  },
  {
    title:       "Samsung Galaxy S24 Ultra",
    description: "Galaxy AI is here. The Galaxy S24 Ultra features a built-in S Pen, 200MP camera, 6.8-inch Dynamic AMOLED display, and Snapdragon 8 Gen 3 for an unmatched Android experience.",
    price:       129999,
    category:    "smartphones",
    image:       "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop",
    stock:       35,
    rating:      4.7,
    numReviews:  1876,
  },
  {
    title:       "OnePlus 12R 5G",
    description: "Powerful. Affordable. The OnePlus 12R packs a Snapdragon 8 Gen 1, 50MP Sony triple camera, 5500mAh battery with 100W SuperVOOC charging, and a smooth 120Hz AMOLED display.",
    price:       39999,
    category:    "smartphones",
    image:       "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop",
    stock:       68,
    rating:      4.5,
    numReviews:  943,
  },

  /* ──── LAPTOPS ──── */
  {
    title:       "Apple MacBook Air M3",
    description: "Supercharged by M3. Up to 18 hours of battery life, a stunning 13.6-inch Liquid Retina display, 8GB unified memory, and fanless silent performance — the world's best thin-and-light laptop.",
    price:       114900,
    category:    "laptops",
    image:       "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    stock:       24,
    rating:      4.9,
    numReviews:  3102,
  },
  {
    title:       "Dell XPS 15 OLED",
    description: "Crafted for creators. The XPS 15 features a stunning 15.6-inch 3.5K OLED display, Intel Core i7-13700H, NVIDIA RTX 4060, 32GB DDR5 RAM, and a premium CNC aluminium chassis.",
    price:       159990,
    category:    "laptops",
    image:       "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop",
    stock:       18,
    rating:      4.6,
    numReviews:  728,
  },
  {
    title:       "Lenovo ThinkPad X1 Carbon Gen 11",
    description: "The legendary business ultrabook. Military-grade durability, Intel vPro, 14-inch 2.8K IPS display, 1.12 kg — engineered for professionals who travel light and work hard.",
    price:       149990,
    category:    "laptops",
    image:       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop",
    stock:       15,
    rating:      4.7,
    numReviews:  514,
  },

  /* ──── ELECTRONICS ──── */
  {
    title:       "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation meets exceptional sound quality. 30 hours of battery, multipoint connection, speak-to-chat, and a redesigned ultra-comfortable headband for all-day wear.",
    price:       26990,
    category:    "electronics",
    image:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    stock:       89,
    rating:      4.8,
    numReviews:  4201,
  },
  {
    title:       "Apple AirPods Pro (2nd Gen)",
    description: "Adaptive Audio. Personalized Spatial Audio. The H2 chip delivers 2× more Active Noise Cancellation, Transparency mode, and up to 30 hours battery with the MagSafe Charging Case.",
    price:       24900,
    category:    "electronics",
    image:       "https://images.unsplash.com/photo-1606741965509-717b8f0d754c?w=600&auto=format&fit=crop",
    stock:       120,
    rating:      4.7,
    numReviews:  5832,
  },
  {
    title:       "Samsung 55\" QLED 4K Smart TV",
    description: "Quantum Dot technology delivers a billion shades of brilliant colour. Neo QLED, Object Tracking Sound, built-in Alexa, and a sleek Infinity One design that merges seamlessly with your home.",
    price:       79990,
    category:    "electronics",
    image:       "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop",
    stock:       12,
    rating:      4.5,
    numReviews:  892,
  },
  {
    title:       "GoPro HERO12 Black",
    description: "5.3K60 + 4K120 video. HyperSmooth 6.0 stabilisation, HDR video, waterproof to 10m, night effects, and 13-metre wide angle for epic action footage — wherever adventure takes you.",
    price:       39990,
    category:    "electronics",
    image:       "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop",
    stock:       47,
    rating:      4.6,
    numReviews:  1243,
  },

  /* ──── WATCHES ──── */
  {
    title:       "Apple Watch Series 9",
    description: "Smarter. Brighter. The new double tap gesture, a brighter Always-On Retina display, on-device Siri, carbon-neutral, and the most advanced health sensors Apple has ever put in a watch.",
    price:       41900,
    category:    "watches",
    image:       "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop",
    stock:       56,
    rating:      4.8,
    numReviews:  2198,
  },
  {
    title:       "Fossil Gen 6 Smartwatch",
    description: "Wear OS by Google. Wear OS by Google. Snapdragon 4100+, rapid charging, multiple health sensors, 1.28-inch AMOLED display, and classic Fossil styling — premium at an accessible price.",
    price:       19995,
    category:    "watches",
    image:       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    stock:       73,
    rating:      4.2,
    numReviews:  687,
  },
  {
    title:       "Casio G-Shock GA-2100",
    description: "The original Carbon Core Guard structure. Shock resistant, 200M water resistance, multi-function display, LED light, world time in 31 zones — the toughest watch on earth, now slimmer.",
    price:       8995,
    category:    "watches",
    image:       "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop",
    stock:       104,
    rating:      4.7,
    numReviews:  3421,
  },

  /* ──── FASHION ──── */
  {
    title:       "Levi's 511 Slim Fit Jeans",
    description: "The iconic slim. Sits below the waist, slim through the hip and thigh with a narrow leg opening. Made from stretch denim for all-day comfort — the go-to jean for every wardrobe.",
    price:       3499,
    category:    "fashion",
    image:       "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop",
    stock:       145,
    rating:      4.4,
    numReviews:  2876,
  },
  {
    title:       "Nike Dri-FIT Training T-Shirt",
    description: "Move freely in sweat-wicking fabric that keeps you cool and comfortable. Lightweight, breathable Dri-FIT technology with a standard fit — perfect for training, running, or casual wear.",
    price:       2295,
    category:    "fashion",
    image:       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
    stock:       210,
    rating:      4.5,
    numReviews:  1534,
  },
  {
    title:       "Allen Solly Formal Shirt",
    description: "Crafted from 100% premium cotton, this slim-fit formal shirt features a spread collar, single patch pocket, and subtle texture weave. Machine washable, wrinkle-resistant, office-ready.",
    price:       1799,
    category:    "fashion",
    image:       "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop",
    stock:       188,
    rating:      4.3,
    numReviews:  912,
  },

  /* ──── SHOES ──── */
  {
    title:       "Nike Air Max 270",
    description: "Nike's tallest Air unit yet delivers unrivalled, all-day cushioning. The lightweight knit upper wraps your foot for a sock-like fit. Bold design meets maximum comfort for lifestyle wear.",
    price:       12995,
    category:    "shoes",
    image:       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    stock:       92,
    rating:      4.6,
    numReviews:  4102,
  },
  {
    title:       "Adidas Ultraboost 22",
    description: "Every step unleashes energy. Primeknit upper adapts to your foot's shape. BOOST midsole returns energy with every stride. Continental rubber outsole for exceptional grip — run free.",
    price:       15999,
    category:    "shoes",
    image:       "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop",
    stock:       67,
    rating:      4.7,
    numReviews:  2891,
  },

  /* ──── ACCESSORIES ──── */
  {
    title:       "Anker 65W USB-C GaN Charger",
    description: "Charge a MacBook Air, iPhone, and AirPods simultaneously from a single compact adapter. GaN II technology delivers 65W fast charging in a plug that's 50% smaller than standard chargers.",
    price:       2799,
    category:    "accessories",
    image:       "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop",
    stock:       234,
    rating:      4.6,
    numReviews:  1678,
  },
  {
    title:       "Peak Design Everyday Backpack 20L",
    description: "Thoughtfully engineered for photographers, commuters, and travellers. FlexFold dividers, MagLatch closure, weatherproof 400D nylon canvas, hidden pockets, and lifetime warranty.",
    price:       19990,
    category:    "accessories",
    image:       "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
    stock:       39,
    rating:      4.8,
    numReviews:  743,
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany();
    console.log("🗑️  Existing products cleared");

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany();
    console.log("🗑️  All products destroyed");

    process.exit(0);
  } catch (err) {
    console.error("❌ Destroy error:", err.message);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
