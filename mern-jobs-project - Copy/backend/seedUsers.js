import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Developer',
    email: 'john@example.com',
    password: 'password123',
    role:'student',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    experience: '3 years',
    education: 'Bachelor in Computer Science'
  },
  {
    name: 'Sarah Designer',
    email: 'sarah@example.com',
    password: 'password123',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    experience: '2 years',
    education: 'Bachelor in Design'
  },
  {
    name: 'Mike DevOps',
    email: 'mike@example.com',
    password: 'password123',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    experience: '4 years',
    education: 'Bachelor in Information Technology'
  },
  {
    name: 'Emily Frontend',
    email: 'emily@example.com',
    password: 'password123',
    skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    experience: '1 year',
    education: 'Self-taught'
  },
  {
    name: 'David Backend',
    email: 'david@example.com',
    password: 'password123',
    skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Git'],
    experience: '5 years',
    education: 'Master in Software Engineering'
  },
  {
    name: 'Lisa Fullstack',
    email: 'lisa@example.com',
    password: 'password123',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
    experience: '2.5 years',
    education: 'Bootcamp Graduate'
  },
  {
    name: 'Alex Junior',
    email: 'alex@example.com',
    password: 'password123',
    skills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    experience: '6 months',
    education: 'Associate Degree in Web Development'
  },
  {
    name: 'Rachel Senior',
    email: 'rachel@example.com',
    password: 'password123',
    skills: ['React', 'Vue.js', 'Node.js', 'AWS', 'Microservices', 'Docker'],
    experience: '7 years',
    education: 'PhD in Computer Science'
  }
];

const seedUsers = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
    console.log('Connecting to MongoDB...');
    console.log('URI:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const users = await User.insertMany(hashedUsers);
    console.log(`Successfully inserted ${users.length} users`);

    // Display user information
    console.log('\n📋 Created Users:');
    console.log('================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Skills: ${user.skills.join(', ')}`);
      console.log(`   Experience: ${user.experience}`);
      console.log(`   Education: ${user.education}`);
      console.log(`   Password: ${sampleUsers[index].password}`);
      console.log('');
    });

    console.log('✅ User database seeded successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('====================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | Password: ${sampleUsers[index].password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'MongoNetworkError') {
      console.log('\nMongoDB is not running. Please:');
      console.log('1. Install MongoDB if not already installed');
      console.log('2. Start MongoDB service');
      console.log('3. Or use MongoDB Atlas by updating your .env file');
    }
    
    process.exit(1);
  }
};

seedUsers(); 