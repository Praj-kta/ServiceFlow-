import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../server/models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/serviceflow';

const seedUsers = [
  {
    name: 'John Doe',
    email: 'user@test.com',
    password: 'password123',
    role: 'user',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra 400001'
  },
  {
    name: 'Jane Smith',
    email: 'provider@test.com',
    password: 'password123',
    role: 'provider',
    phone: '+91 9876543211',
    address: '456 Service Lane, Pune, Maharashtra 411001',
    providerProfile: {
      companyName: 'Elite Home Services',
      category: 'Home Cleaning',
      experience: '5 years',
      skills: ['Deep Cleaning', 'Carpet Cleaning', 'Kitchen Cleaning', 'Bathroom Sanitization'],
      rating: 4.8,
      verified: true,
      bio: 'Professional home cleaning service with 5+ years of experience. We provide top-quality cleaning services with eco-friendly products.'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9876543212',
    address: 'ServiceFlow HQ, Delhi, India'
  },
  {
    name: 'Mike Johnson',
    email: 'plumber@test.com',
    password: 'password123',
    role: 'provider',
    phone: '+91 9876543213',
    address: '789 Plumber Street, Bangalore, Karnataka 560001',
    providerProfile: {
      companyName: 'Quick Fix Plumbing',
      category: 'Plumbing',
      experience: '8 years',
      skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Water Heater Installation'],
      rating: 4.9,
      verified: true,
      bio: 'Expert plumber with 8 years of experience. Available for emergency repairs 24/7.'
    }
  },
  {
    name: 'Sarah Williams',
    email: 'electrician@test.com',
    password: 'password123',
    role: 'provider',
    phone: '+91 9876543214',
    address: '321 Electric Avenue, Chennai, Tamil Nadu 600001',
    providerProfile: {
      companyName: 'Bright Spark Electrical',
      category: 'Electrical',
      experience: '6 years',
      skills: ['Wiring', 'Circuit Repair', 'Lighting Installation', 'Electrical Safety Inspection'],
      rating: 4.7,
      verified: true,
      bio: 'Licensed electrician specializing in residential and commercial electrical work.'
    }
  },
  {
    name: 'Test User 2',
    email: 'user2@test.com',
    password: 'password123',
    role: 'user',
    phone: '+91 9876543215',
    address: '555 Customer Road, Hyderabad, Telangana 500001'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    const usersToInsert = await Promise.all(
      seedUsers.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Display login credentials
    console.log('\n📋 Test User Credentials:');
    console.log('═══════════════════════════════════════════════════════');
    seedUsers.forEach((user) => {
      console.log(`\n${user.role.toUpperCase()}: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      if (user.providerProfile) {
        console.log(`  Company: ${user.providerProfile.companyName}`);
        console.log(`  Category: ${user.providerProfile.category}`);
      }
    });
    console.log('\n═══════════════════════════════════════════════════════');

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
