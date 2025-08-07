# Hugging Face API Setup Guide

This guide shows how to set up the Hugging Face API with the Google Gemma model for generating personalized career roadmaps.

## 🎯 Overview

The roadmap feature now uses **Hugging Face API** with the **Google Gemma 2B IT model** to generate personalized career development plans. This provides high-quality, contextual responses for job seekers.

## 🚀 Quick Setup

### Step 1: Get Hugging Face API Key

1. **Go to Hugging Face:**
   - Visit [Hugging Face](https://huggingface.co/)
   - Sign up or login to your account

2. **Create API Token:**
   - Go to Settings → Access Tokens
   - Click "New token"
   - Give it a name (e.g., "Roadmap API")
   - Select "Read" permissions
   - Copy the generated token

### Step 2: Configure Environment

Add your Hugging Face API key to `backend/.env`:

```env
MONGO_URI=mongodb+srv://your-mongo-connection-string
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
HUGGINGFACE_API_KEY=hf_your_token_here
```

### Step 3: Test the Integration

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test in the frontend:**
   - Open `http://localhost:3000`
   - Click "Login" (creates demo user)
   - Click "🗺️ Get Roadmap" on any job
   - View your AI-generated roadmap!

## 🔧 Technical Details

### API Configuration

The system uses the Hugging Face Router API with the following configuration:

```javascript
// Model: google/gemma-2-2b-it:nebius
// Endpoint: https://router.huggingface.co/v1/chat/completions
// Format: OpenAI-compatible chat completions
```

### Request Structure

```javascript
const response = await axios.post('https://router.huggingface.co/v1/chat/completions', {
  model: 'google/gemma-2-2b-it:nebius',
  messages: [
    {
      role: 'system',
      content: 'You are a career development expert...'
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
```

## 💰 Cost Information

### Hugging Face Pricing:
- **Free Tier**: Limited requests per month
- **Pro Plan**: $9/month for increased limits
- **Enterprise**: Custom pricing

### Model-Specific Costs:
- **Gemma 2B IT**: ~$0.0001 per 1K tokens
- **Typical roadmap**: ~500-800 tokens
- **Cost per roadmap**: ~$0.00005-0.00008

## 🎯 Features

### What the AI Generates:

1. **Skills Gap Analysis**
   - Compares user's current skills with job requirements
   - Identifies specific areas for improvement

2. **Learning Path**
   - Phase-by-phase learning recommendations
   - Course and certification suggestions
   - Project-based learning opportunities

3. **Timeline Recommendations**
   - Realistic timeframes for skill development
   - Milestone-based progression

4. **Action Items**
   - Specific, actionable steps
   - Priority-based recommendations

5. **Resources & Tools**
   - Learning platforms and courses
   - Practice websites and communities
   - Development tools and environments

6. **Expected Outcomes**
   - Career progression expectations
   - Salary and role advancement potential

## 🛠 Troubleshooting

### Common Issues:

1. **"API key not found"**
   ```bash
   # Check your .env file
   cat backend/.env
   # Ensure HUGGINGFACE_API_KEY is set
   ```

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading to Pro plan

3. **"Model not available"**
   - The Gemma model should be available via Hugging Face Router
   - Check Hugging Face status page

4. **"Network error"**
   - Check your internet connection
   - Verify API endpoints are accessible

### Debug Mode:

Add logging to see what's happening:

```javascript
// In roadmapRoutes.js
console.log('Hugging Face API Key present:', !!process.env.HUGGINGFACE_API_KEY);
console.log('Making API call to Hugging Face...');
```

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables**
3. **Rotate API keys regularly**
4. **Monitor API usage**
5. **Implement rate limiting**

## 📊 Monitoring Usage

Track your API usage:

```javascript
// Add to roadmapRoutes.js
console.log('Hugging Face API call made:', {
  provider: 'Hugging Face',
  model: 'google/gemma-2-2b-it:nebius',
  timestamp: new Date().toISOString(),
  user: req.user.userId
});
```

## 🎯 Example Roadmap Output

Here's what a typical AI-generated roadmap looks like:

```
🎯 PERSONALIZED CAREER ROADMAP

📊 SKILLS GAP ANALYSIS:
• Current Skills: JavaScript, React, Node.js
• Target Skills: Advanced React, TypeScript, AWS, CI/CD
• Gap: TypeScript, AWS, DevOps practices

📚 LEARNING PATH:

Phase 1: Foundation (2-3 months)
• Complete TypeScript course on Udemy/Coursera
• Build 2-3 projects using TypeScript + React
• Practice advanced React patterns

Phase 2: Advanced Skills (3-4 months)
• Learn AWS fundamentals (EC2, S3, Lambda)
• Study CI/CD with GitHub Actions
• Complete a full-stack project with deployment

⏰ TIMELINE:
• Month 1-2: TypeScript mastery
• Month 3-4: Advanced React patterns
• Month 5-6: AWS and DevOps

🎯 ACTION ITEMS:
1. Enroll in TypeScript course this week
2. Start building projects immediately
3. Join relevant Discord/Slack communities

📖 RECOMMENDED RESOURCES:
• Courses: Udemy, Coursera, freeCodeCamp
• Practice: LeetCode, HackerRank, Frontend Mentor
• Communities: React Discord, TypeScript Discord

🚀 EXPECTED OUTCOMES:
• Ready for senior-level positions in 6-8 months
• Increased salary potential by 30-50%
• Strong portfolio with 5+ relevant projects
```

## 🚀 Next Steps

1. **Set up your Hugging Face API key**
2. **Test the integration**
3. **Customize the prompts if needed**
4. **Monitor usage and costs**
5. **Scale as needed**

## 📞 Support

- **Hugging Face Support**: [Hugging Face Docs](https://huggingface.co/docs)
- **Gemma Model Info**: [Google Gemma](https://ai.google.dev/gemma)
- **API Documentation**: [Hugging Face API](https://huggingface.co/docs/api-inference)

---

**Note**: The Hugging Face integration provides high-quality, personalized roadmaps using the latest AI technology. The system automatically falls back to demo responses if the API is unavailable. 