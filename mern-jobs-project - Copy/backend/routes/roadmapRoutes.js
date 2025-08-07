import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Generate personalized roadmap
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { jobId, jobTitle, jobDescription, jobRequirements } = req.body;
    
    // Get user profile
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prepare data for AI API
    const prompt = `
    Create a personalized career roadmap for a job seeker with the following profile:
    
    USER PROFILE:
    - Name: ${user.name}
    - Experience: ${user.experience}
    - Education: ${user.education}
    - Current Skills: ${user.skills.join(', ')}
    
    TARGET JOB:
    - Title: ${jobTitle}
    - Description: ${jobDescription}
    - Requirements: ${jobRequirements.join(', ')}
    
    Please provide a detailed, step-by-step roadmap that includes:
    1. Skills gap analysis
    2. Learning path (courses, certifications, projects)
    3. Timeline recommendations
    4. Action items and milestones
    5. Resources and tools to use
    6. Expected outcomes and career progression
    
    Format the response in a clear, structured manner with headings and bullet points.
    `;

    // Call AI API (Hugging Face with Gemma model)
    const aiResponse = await callAIAPI(prompt);
    
    res.json({
      success: true,
      roadmap: aiResponse,
      jobTitle,
      userProfile: {
        name: user.name,
        experience: user.experience,
        skills: user.skills
      }
    });

  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate roadmap',
      error: error.message 
    });
  }
});

// Function to call AI API
async function callAIAPI(prompt) {
  try {
    // Option 1: Hugging Face API with Gemma model
    if (process.env.HUGGINGFACE_API_KEY) {
      console.log('Using Hugging Face API with Gemma model...');
      
      const response = await axios.post('https://router.huggingface.co/v1/chat/completions', {
        model: 'google/gemma-2-2b-it:nebius',
        messages: [
          {
            role: 'system',
            content: 'You are a career development expert who creates personalized learning roadmaps for job seekers. Provide detailed, actionable advice with clear structure and formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Hugging Face API response received');
      return response.data.choices[0].message.content;
    }
    
    // Option 2: OpenAI API (fallback)
    else if (process.env.OPENAI_API_KEY) {
      console.log('Using OpenAI API...');
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a career development expert who creates personalized learning roadmaps for job seekers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    }
    
    // Option 3: Demo response (fallback)
    else {
      console.log('Using demo roadmap (no API key provided)');
      return generateDemoRoadmap();
    }

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    
    // If Hugging Face fails, try demo response
    if (process.env.HUGGINGFACE_API_KEY) {
      console.log('Hugging Face API failed, falling back to demo response');
      return generateDemoRoadmap();
    }
    
    return generateDemoRoadmap();
  }
}

// Demo roadmap generator (fallback)
function generateDemoRoadmap() {
  return `
🎯 PERSONALIZED CAREER ROADMAP

📊 SKILLS GAP ANALYSIS:
• Current Skills: JavaScript, React, Node.js
• Target Skills: Advanced React, TypeScript, AWS, CI/CD
• Gap: TypeScript, AWS, DevOps practices

📚 LEARNING PATH:

Phase 1: Foundation (2-3 months)
• Complete TypeScript course on Udemy/Coursera
• Build 2-3 projects using TypeScript + React
• Practice advanced React patterns (Hooks, Context, Custom Hooks)

Phase 2: Advanced Skills (3-4 months)
• Learn AWS fundamentals (EC2, S3, Lambda)
• Study CI/CD with GitHub Actions
• Complete a full-stack project with deployment

Phase 3: Specialization (2-3 months)
• Deep dive into specific job requirements
• Contribute to open-source projects
• Build a portfolio showcasing relevant skills

⏰ TIMELINE:
• Month 1-2: TypeScript mastery
• Month 3-4: Advanced React patterns
• Month 5-6: AWS and DevOps
• Month 7-8: Portfolio building and job applications

🎯 ACTION ITEMS:
1. Enroll in TypeScript course this week
2. Start building projects immediately
3. Join relevant Discord/Slack communities
4. Set up GitHub profile with pinned projects
5. Network with professionals in the field

📖 RECOMMENDED RESOURCES:
• Courses: Udemy, Coursera, freeCodeCamp
• Practice: LeetCode, HackerRank, Frontend Mentor
• Communities: React Discord, TypeScript Discord
• Tools: VS Code, GitHub, AWS Free Tier

🚀 EXPECTED OUTCOMES:
• Ready for senior-level positions in 6-8 months
• Increased salary potential by 30-50%
• Strong portfolio with 5+ relevant projects
• Network of industry professionals

Remember: Consistency is key! Dedicate 2-3 hours daily to learning and building.
  `;
}

export default router; 