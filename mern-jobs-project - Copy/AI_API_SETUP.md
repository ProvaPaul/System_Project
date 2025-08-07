# AI API Setup Guide for Roadmap Feature

This guide will help you set up AI API integration for generating personalized career roadmaps.

## 🎯 Overview

The roadmap feature uses AI to analyze a user's profile and job requirements to generate personalized learning paths. It supports multiple AI providers:

1. **OpenAI GPT-3.5/4** (Recommended)
2. **Hugging Face** (Alternative)
3. **Demo Mode** (Fallback - no API key needed)

## 🚀 Quick Setup

### Option 1: OpenAI API (Recommended)

1. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up/Login
   - Navigate to "API Keys"
   - Create a new API key
   - Copy the key

2. **Add to Environment:**
   ```bash
   # In backend/.env file
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Usage:**
   - Cost: ~$0.002 per 1K tokens
   - Quality: High-quality, contextual responses
   - Rate Limits: 3 requests per minute (free tier)

### Option 2: Hugging Face API

1. **Get Hugging Face API Key:**
   - Go to [Hugging Face](https://huggingface.co/)
   - Sign up/Login
   - Go to Settings → Access Tokens
   - Create a new token
   - Copy the token

2. **Add to Environment:**
   ```bash
   # In backend/.env file
   HUGGINGFACE_API_KEY=your-huggingface-token-here
   ```

3. **Usage:**
   - Cost: Free tier available
   - Quality: Good for text generation
   - Rate Limits: Varies by model

### Option 3: Demo Mode (No API Key)

If no API keys are provided, the system will use a pre-generated demo roadmap.

## 📋 Detailed Setup Steps

### Step 1: Choose Your AI Provider

**For Production (OpenAI):**
```bash
# Get API key from OpenAI
# Add to .env file
OPENAI_API_KEY=sk-your-key-here
```

**For Development/Testing (Demo):**
```bash
# No API key needed
# System will use demo responses
```

### Step 2: Update Environment Variables

Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://your-mongo-connection-string
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-key-here
HUGGINGFACE_API_KEY=your-huggingface-key-here
```

### Step 3: Test the Integration

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test with curl:**
   ```bash
   # First, create a user (if needed)
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "skills": ["JavaScript", "React"],
       "experience": "2 years",
       "education": "Bachelor in CS"
     }'

   # Then test roadmap generation
   curl -X POST http://localhost:5000/api/roadmap/generate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "jobTitle": "Frontend Developer",
       "jobDescription": "React developer needed",
       "jobRequirements": ["React", "JavaScript", "TypeScript"]
     }'
   ```

## 🔧 Configuration Options

### OpenAI Configuration

In `backend/routes/roadmapRoutes.js`, you can customize:

```javascript
const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-3.5-turbo',  // or 'gpt-4' for better quality
  messages: [...],
  max_tokens: 1000,        // Adjust response length
  temperature: 0.7         // Adjust creativity (0-1)
});
```

### Prompt Customization

Modify the prompt in `roadmapRoutes.js`:

```javascript
const prompt = `
Create a personalized career roadmap for a job seeker with the following profile:
// ... customize this prompt for your needs
`;
```

## 💰 Cost Estimation

### OpenAI Costs:
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens
- **Typical roadmap**: ~500-800 tokens
- **Monthly cost (100 roadmaps)**: $1-3

### Hugging Face Costs:
- **Free tier**: Limited requests
- **Paid plans**: Varies by model

## 🛠 Troubleshooting

### Common Issues:

1. **"API key not found"**
   - Check your .env file
   - Restart the server after adding keys

2. **"Rate limit exceeded"**
   - Wait before making more requests
   - Consider upgrading your plan

3. **"Invalid API key"**
   - Verify your API key is correct
   - Check if your account has credits

4. **"Network error"**
   - Check your internet connection
   - Verify API endpoints are accessible

### Debug Mode:

Add logging to see what's happening:

```javascript
// In roadmapRoutes.js
console.log('API Key present:', !!process.env.OPENAI_API_KEY);
console.log('Making API call to:', 'OpenAI');
```

## 🔒 Security Considerations

1. **Never commit API keys to version control**
2. **Use environment variables**
3. **Rotate API keys regularly**
4. **Monitor API usage**
5. **Implement rate limiting**

## 📊 Monitoring

Track your API usage:

```javascript
// Add to roadmapRoutes.js
console.log('API call made:', {
  provider: 'OpenAI',
  timestamp: new Date().toISOString(),
  user: req.user.userId
});
```

## 🎯 Next Steps

1. **Set up your preferred AI provider**
2. **Test the integration**
3. **Customize the prompts**
4. **Monitor usage and costs**
5. **Scale as needed**

## 📞 Support

- **OpenAI Support**: [OpenAI Help Center](https://help.openai.com/)
- **Hugging Face Support**: [Hugging Face Docs](https://huggingface.co/docs)
- **Project Issues**: Check the project repository

---

**Note**: Start with the demo mode to test the feature, then upgrade to a real AI provider for production use. 