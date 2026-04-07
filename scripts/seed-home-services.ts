import { Service } from '../models/Service';
import mongoose from 'mongoose';

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/serviceflow';

const homeServicesData = [
  // Plumbing Services
  {
    title: "Pipe Repair",
    description: "Leak detection and pipe repair",
    category: "Home",
    subcategory: "Plumbing",
    price: 1000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-2 hours",
    rating: 4.8,
    reviews: 156,
    features: ["Free inspection", "Warranty", "Emergency available"],
    image: "/services/plumbing.jpg"
  },
  {
    title: "Tap Installation",
    description: "Install new taps and faucets",
    category: "Home",
    subcategory: "Plumbing",
    price: 500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "30-45 mins",
    rating: 4.7,
    reviews: 89,
    features: ["Professional install", "Quality guarantee"],
    image: "/services/tap.jpg"
  },
  {
    title: "Drainage Cleaning",
    description: "Clear blocked drains",
    category: "Home",
    subcategory: "Plumbing",
    price: 800,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "1 hour",
    rating: 4.9,
    reviews: 312,
    features: ["Quick service", "24/7 available", "Eco-friendly"],
    image: "/services/drainage.jpg"
  },
  {
    title: "Water Heater Service",
    description: "Water heater installation and repair",
    category: "Home",
    subcategory: "Plumbing",
    price: 1500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-2 hours",
    rating: 4.6,
    reviews: 134,
    features: ["Expert technicians", "Performance check"],
    image: "/services/water-heater.jpg"
  },
  {
    title: "Bathroom Fitting",
    description: "Tub, shower, and fixture installation",
    category: "Home",
    subcategory: "Plumbing",
    price: 2000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "2-3 hours",
    rating: 4.8,
    reviews: 223,
    features: ["Professional design", "Quality materials", "Warranty"],
    image: "/services/bathroom.jpg"
  },
  {
    title: "Toilet Repair",
    description: "Fix leaking and damaged toilets",
    category: "Home",
    subcategory: "Plumbing",
    price: 600,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "45 mins",
    rating: 4.7,
    reviews: 178,
    features: ["Quick fix", "Parts included"],
    image: "/services/toilet.jpg"
  },

  // Electrical Services
  {
    title: "Light Installation",
    description: "Ceiling and wall light fitting",
    category: "Home",
    subcategory: "Electrical",
    price: 500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "30-60 mins",
    rating: 4.8,
    reviews: 267,
    features: ["Wide selection", "Energy-efficient", "Professional install"],
    image: "/services/lighting.jpg"
  },
  {
    title: "Switch & Socket Repair",
    description: "Fix faulty switches and outlets",
    category: "Home",
    subcategory: "Electrical",
    price: 400,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "30 mins",
    rating: 4.7,
    reviews: 145,
    features: ["Safety check", "Quick service"],
    image: "/services/switches.jpg"
  },
  {
    title: "Fan Installation",
    description: "Install ceiling and table fans",
    category: "Home",
    subcategory: "Electrical",
    price: 800,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "45-60 mins",
    rating: 4.9,
    reviews: 198,
    features: ["Latest models", "Warranty", "Professional installation"],
    image: "/services/fan.jpg"
  },
  {
    title: "Wiring Extension",
    description: "New wiring and circuit extension",
    category: "Home",
    subcategory: "Electrical",
    price: 1500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-2 hours",
    rating: 4.6,
    reviews: 110,
    features: ["Code compliant", "Safety assured"],
    image: "/services/wiring.jpg"
  },
  {
    title: "Electrical Maintenance",
    description: "Check wiring and electrical safety",
    category: "Home",
    subcategory: "Electrical",
    price: 1000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1 hour",
    rating: 4.8,
    reviews: 256,
    features: ["Safety audit", "Preventive care"],
    image: "/services/maintenance.jpg"
  },
  {
    title: "Appliance Connection",
    description: "Connect electrical appliances",
    category: "Home",
    subcategory: "Electrical",
    price: 700,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "45 mins",
    rating: 4.7,
    reviews: 167,
    features: ["Expert handling", "Safe connection"],
    image: "/services/appliances.jpg"
  },

  // Carpentry Services
  {
    title: "Shelf Installation",
    description: "Install wooden and metal shelves",
    category: "Home",
    subcategory: "Carpentry",
    price: 700,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "1 hour",
    rating: 4.8,
    reviews: 189,
    features: ["Precision mounting", "Level guarantee"],
    image: "/services/shelf.jpg"
  },
  {
    title: "Door Repair",
    description: "Fix doors and hinges",
    category: "Home",
    subcategory: "Carpentry",
    price: 1000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-2 hours",
    rating: 4.7,
    reviews: 213,
    features: ["All door types", "Smooth operation"],
    image: "/services/door.jpg"
  },
  {
    title: "Furniture Assembly",
    description: "Assemble flat-pack furniture",
    category: "Home",
    subcategory: "Carpentry",
    price: 1200,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "1-2 hours",
    rating: 4.9,
    reviews: 334,
    features: ["Expert assembly", "Fast service"],
    image: "/services/furniture-assembly.jpg"
  },
  {
    title: "Cabinet Installation",
    description: "Install kitchen and bedroom cabinets",
    category: "Home",
    subcategory: "Carpentry",
    price: 2000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "2-3 hours",
    rating: 4.8,
    reviews: 267,
    features: ["Professional finish", "Custom options"],
    image: "/services/cabinet.jpg"
  },
  {
    title: "Wardrobe Repair",
    description: "Repair closets and wardrobes",
    category: "Home",
    subcategory: "Carpentry",
    price: 1500,
    areasCcovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "1-2 hours",
    rating: 4.7,
    reviews: 145,
    features: ["Damage repair", "Restoration"],
    image: "/services/wardrobe.jpg"
  },
  {
    title: "Table/Bed Repair",
    description: "Repair furniture and fixtures",
    category: "Home",
    subcategory: "Carpentry",
    price: 1200,
    areasCcovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-3 hours",
    rating: 4.8,
    reviews: 178,
    features: ["All furniture types", "Quality repair"],
    image: "/services/furniture-repair.jpg"
  },

  // Cleaning Services
  {
    title: "Regular Cleaning",
    description: "Daily/weekly home cleaning",
    category: "Home",
    subcategory: "Cleaning",
    price: 1000,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "2-3 hours",
    rating: 4.8,
    reviews: 412,
    features: ["Eco-friendly", "Flexible scheduling"],
    image: "/services/cleaning.jpg"
  },
  {
    title: "Deep Cleaning",
    description: "Comprehensive deep cleaning service",
    category: "Home",
    subcategory: "Cleaning",
    price: 3500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "4-6 hours",
    rating: 4.9,
    reviews: 523,
    features: ["Professional team", "Detailed service"],
    image: "/services/deep-clean.jpg"
  },
  {
    title: "Carpet Cleaning",
    description: "Professional carpet and rug cleaning",
    category: "Home",
    subcategory: "Cleaning",
    price: 2000,
    areasCcovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "2-4 hours",
    rating: 4.8,
    reviews: 289,
    features: ["Stain removal", "Fresh scent"],
    image: "/services/carpet.jpg"
  },
  {
    title: "Window Cleaning",
    description: "Clean windows and glass surfaces",
    category: "Home",
    subcategory: "Cleaning",
    price: 700,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
    duration: "1-2 hours",
    rating: 4.7,
    reviews: 234,
    features: ["Streak-free", "Interior & exterior"],
    image: "/services/windows.jpg"
  },
  {
    title: "Bathroom Cleaning",
    description: "Specialized bathroom sanitation",
    category: "Home",
    subcategory: "Cleaning",
    price: 1200,
    areasCovered: ["Brooklyn", "Manhattan", "Queens", "Bronx", "Staten Island"],
    duration: "1-2 hours",
    rating: 4.8,
    reviews: 345,
    features: ["Disinfection", "Sparkle finish"],
    image: "/services/bathroom-clean.jpg"
  },
  {
    title: "Kitchen Cleaning",
    description: "Deep kitchen cleaning service",
    category: "Home",
    subcategory: "Cleaning",
    price: 1500,
    areasCovered: ["Brooklyn", "Manhattan", "Queens"],
    duration: "1-3 hours",
    rating: 4.9,
    reviews: 267,
    features: ["Degreasing", "Appliance cleaning"],
    image: "/services/kitchen-clean.jpg"
  }
];

async function seedHomeServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if home services already exist
    const existingCount = await Service.countDocuments({ category: 'Home' });
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing home services. Skipping seed.`);
      return;
    }

    // Insert home services
    const result = await Service.insertMany(homeServicesData);
    console.log(`✓ Successfully seeded ${result.length} home services`);

    // Display summary by subcategory
    const categories = await Service.aggregate([
      { $match: { category: 'Home' } },
      { $group: { _id: '$subcategory', count: { $sum: 1 } } }
    ]);

    console.log('\nSeeded services by subcategory:');
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} services`);
    });

  } catch (error) {
    console.error('Error seeding home services:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedHomeServices();
