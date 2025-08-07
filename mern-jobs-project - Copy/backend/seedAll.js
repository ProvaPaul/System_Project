import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Job } from './models/Job.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Developer',
    email: 'john@example.com',
    password: 'password123',
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

const sampleJobs = [
  {
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-friendly web applications using React, JavaScript, and modern web technologies.",
    requirements: ["React", "JavaScript", "HTML", "CSS", "Git"],
    salary: 80000,
    experienceLevel: 2,
    location: "New York, NY",
    jobType: "Full-time",
    position: 2
  },
  {
    title: "Backend Developer",
    description: "Join our backend team to build scalable APIs and services. Experience with Node.js, Express, and MongoDB is required.",
    requirements: ["Node.js", "Express", "MongoDB", "JavaScript", "REST APIs"],
    salary: 90000,
    experienceLevel: 3,
    location: "San Francisco, CA",
    jobType: "Full-time",
    position: 1
  },
  {
    title: "Full Stack Developer",
    description: "We need a Full Stack Developer who can work on both frontend and backend. Experience with MERN stack is preferred.",
    requirements: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    salary: 95000,
    experienceLevel: 4,
    location: "Remote",
    jobType: "Full-time",
    position: 3
  },
  {
    title: "UI/UX Designer",
    description: "Create beautiful and intuitive user interfaces. Experience with Figma, Adobe Creative Suite, and user research is required.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    salary: 75000,
    experienceLevel: 2,
    location: "Austin, TX",
    jobType: "Full-time",
    position: 1
  },
  {
    title: "DevOps Engineer",
    description: "Help us build and maintain our infrastructure. Experience with AWS, Docker, and CI/CD pipelines is required.",
    requirements: ["AWS", "Docker", "CI/CD", "Linux", "Shell Scripting"],
    salary: 100000,
    experienceLevel: 3,
    location: "Seattle, WA",
    jobType: "Full-time",
    position: 2
  },
  {
    title: "Junior Frontend Developer",
    description: "Perfect opportunity for a junior developer to grow their skills. We provide mentorship and training.",
    requirements: ["HTML", "CSS", "JavaScript", "Git", "Basic React"],
    salary: 60000,
    experienceLevel: 1,
    location: "Chicago, IL",
    jobType: "Full-time",
    position: 2
  },
  {
    title: "Senior Full Stack Engineer",
    description: "Lead development of complex web applications. Must have experience with modern frameworks and cloud platforms.",
    requirements: ["React", "Node.js", "AWS", "TypeScript", "Microservices", "Docker"],
    salary: 120000,
    experienceLevel: 5,
    location: "Boston, MA",
    jobType: "Full-time",
    position: 1
  },
  {
    title: "Python Backend Developer",
    description: "Build robust backend services using Python. Experience with Django or Flask required.",
    requirements: ["Python", "Django", "PostgreSQL", "REST APIs", "Git"],
    salary: 85000,
    experienceLevel: 3,
    location: "Denver, CO",
    jobType: "Full-time",
    position: 2
  }
];

const seedAll = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
    console.log('🚀 Starting complete database seeding...');
    console.log('Connecting to MongoDB...');
    console.log('URI:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('✅ Cleared existing users and jobs');

    // Seed Users
    console.log('\n👥 Seeding users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Successfully inserted ${users.length} users`);

    // Seed Jobs
    console.log('\n💼 Seeding jobs...');
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully inserted ${jobs.length} jobs`);

    // Display summary
    console.log('\n📊 Database Seeding Summary:');
    console.log('============================');
    console.log(`👥 Users created: ${users.length}`);
    console.log(`💼 Jobs created: ${jobs.length}`);
    console.log(`📈 Total records: ${users.length + jobs.length}`);

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

    // Display job information
    console.log('\n💼 Created Jobs:');
    console.log('===============');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Salary: $${job.salary.toLocaleString()}`);
      console.log(`   Requirements: ${job.requirements.join(', ')}`);
      console.log('');
    });

    console.log('🎉 Complete database seeded successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('====================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | Password: ${sampleUsers[index].password}`);
    });

    console.log('\n🌐 Next Steps:');
    console.log('==============');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: cd ../frontend && npm start');
    console.log('3. Open http://localhost:3000');
    console.log('4. Login with any of the credentials above');
    console.log('5. Click "🗺️ Get Roadmap" on any job to test AI features');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
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

seedAll(); 