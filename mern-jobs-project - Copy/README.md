# MERN Jobs Project

A full-stack job listing application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with AI-powered personalized career roadmaps.

## Features

- View job listings with detailed information
- User authentication (register/login)
- AI-powered personalized career roadmaps
- Responsive design with Bootstrap
- RESTful API backend
- MongoDB database integration
- Hugging Face AI integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn
- Hugging Face API key (optional, for AI roadmaps)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd mern-jobs-project
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGO_URI=mongodb://localhost:27017/test
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
HUGGINGFACE_API_KEY=your-huggingface-token-here
```

4. Start MongoDB (if using local installation):
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Usage

### Authentication

1. **Register a new account:**
   - Click "Register" button
   - Fill in your details (name, email, password, skills, experience, education)
   - Submit the form

2. **Login with existing account:**
   - Click "Login" button
   - Enter your email and password
   - Submit the form

### Getting Personalized Roadmaps

1. **Login to your account**
2. **Browse job listings**
3. **Click "🗺️ Get Roadmap" on any job**
4. **View your personalized AI-generated career roadmap**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile

### Jobs
- `GET /api/job/all` - Get all jobs
- `GET /api/job/get/:id` - Get job by ID

### Roadmaps
- `POST /api/roadmap/generate` - Generate personalized roadmap

## Project Structure

```
mern-jobs-project/
├── backend/
│   ├── controllers/
│   │   └── jobController.js
│   ├── models/
│   │   ├── Job.js
│   │   ├── Company.js
│   │   └── User.js
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   ├── authRoutes.js
│   │   └── roadmapRoutes.js
│   ├── server.js
│   ├── seedData.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── README.md
├── AI_API_SETUP.md
└── HUGGINGFACE_SETUP.md
```

## AI Integration

The application uses Hugging Face API with Google Gemma model to generate personalized career roadmaps. See `HUGGINGFACE_SETUP.md` for detailed setup instructions.

### Features of AI Roadmaps:
- Skills gap analysis
- Learning path recommendations
- Timeline suggestions
- Action items and milestones
- Resources and tools
- Expected outcomes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check if the MONGO_URI in .env is correct
   - If using MongoDB Atlas, ensure your IP is whitelisted

2. **Frontend can't connect to backend**
   - Ensure the backend server is running on port 5000
   - Check if CORS is properly configured
   - Verify the API endpoint URLs in the frontend

3. **Authentication issues**
   - Check if JWT_SECRET is set in .env
   - Verify user credentials
   - Check browser console for errors

4. **AI roadmap generation fails**
   - Check Hugging Face API key in .env
   - Verify internet connection
   - Check API rate limits

5. **No jobs displayed**
   - Run the seed script: `npm run seed` in the backend directory
   - Check the browser console for any errors
   - Verify the API response in the Network tab

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: React.js, Axios, Bootstrap
- **Database**: MongoDB
- **AI**: Hugging Face API, Google Gemma model
- **Authentication**: JWT tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 