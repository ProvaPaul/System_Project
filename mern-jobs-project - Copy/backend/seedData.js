import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from './models/Job.js';

dotenv.config();

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
    }
];

const seedDatabase = async () => {
    try {
        // Use fallback URI if local MongoDB is not available
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://heymarufa:asdfadsfadfga@cluster0.setpj6g.mongodb.net/test?retryWrites=true&w=majority';
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', mongoURI);
        
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB successfully!');

        // Clear existing jobs
        await Job.deleteMany({});
        console.log('Cleared existing jobs');

        // Insert sample jobs
        const jobs = await Job.insertMany(sampleJobs);
        console.log(`Successfully inserted ${jobs.length} sample jobs`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
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

seedDatabase(); 