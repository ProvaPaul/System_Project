# Database Seed Scripts Guide

This guide explains the different seed scripts available for populating the database with test data.

## Available Seed Scripts

### 1. `npm run seed` - Jobs Only
Populates the database with sample job listings only.

```bash
npm run seed
```

**What it creates:**
- 5 sample job listings
- No users

### 2. `npm run seed:users` - Users Only
Populates the database with sample users only.

```bash
npm run seed:users
```

**What it creates:**
- 8 sample users with different profiles
- No jobs

### 3. `npm run seed:all` - Complete Database (Recommended)
Populates the database with both users and jobs.

```bash
npm run seed:all
```

**What it creates:**
- 8 sample users with different profiles
- 8 sample job listings
- Complete test environment

## Sample Users Created

| Name | Email | Skills | Experience | Education |
|------|-------|--------|------------|-----------|
| John Developer | john@example.com | JavaScript, React, Node.js, MongoDB | 3 years | Bachelor in CS |
| Sarah Designer | sarah@example.com | UI/UX Design, Figma, Adobe Creative Suite | 2 years | Bachelor in Design |
| Mike DevOps | mike@example.com | AWS, Docker, Kubernetes, CI/CD, Linux | 4 years | Bachelor in IT |
| Emily Frontend | emily@example.com | React, TypeScript, CSS, HTML, JavaScript | 1 year | Self-taught |
| David Backend | david@example.com | Python, Django, PostgreSQL, REST APIs, Git | 5 years | Master in SE |
| Lisa Fullstack | lisa@example.com | React, Node.js, MongoDB, Express, TypeScript | 2.5 years | Bootcamp Graduate |
| Alex Junior | alex@example.com | HTML, CSS, JavaScript, Git | 6 months | Associate Degree |
| Rachel Senior | rachel@example.com | React, Vue.js, Node.js, AWS, Microservices, Docker | 7 years | PhD in CS |

## Sample Jobs Created

| Title | Location | Salary | Requirements |
|-------|----------|--------|--------------|
| Frontend Developer | New York, NY | $80,000 | React, JavaScript, HTML, CSS, Git |
| Backend Developer | San Francisco, CA | $90,000 | Node.js, Express, MongoDB, JavaScript, REST APIs |
| Full Stack Developer | Remote | $95,000 | React, Node.js, MongoDB, Express, JavaScript |
| UI/UX Designer | Austin, TX | $75,000 | Figma, Adobe Creative Suite, User Research, Prototyping |
| DevOps Engineer | Seattle, WA | $100,000 | AWS, Docker, CI/CD, Linux, Shell Scripting |
| Junior Frontend Developer | Chicago, IL | $60,000 | HTML, CSS, JavaScript, Git, Basic React |
| Senior Full Stack Engineer | Boston, MA | $120,000 | React, Node.js, AWS, TypeScript, Microservices, Docker |
| Python Backend Developer | Denver, CO | $85,000 | Python, Django, PostgreSQL, REST APIs, Git |

## Login Credentials

All users use the same password: `password123`

**Quick Login Options:**
- **Frontend Developer:** emily@example.com
- **Backend Developer:** david@example.com
- **Full Stack Developer:** lisa@example.com
- **UI/UX Designer:** sarah@example.com
- **DevOps Engineer:** mike@example.com
- **Junior Developer:** alex@example.com
- **Senior Engineer:** rachel@example.com
- **General Developer:** john@example.com

## Usage Instructions

### For Development/Testing:

1. **Seed the complete database:**
   ```bash
   npm run seed:all
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Start the frontend:**
   ```bash
   cd ../frontend
   npm start
   ```

4. **Test the application:**
   - Open http://localhost:3000
   - Login with any user credentials
   - Browse jobs and test roadmap generation

### For Specific Testing:

- **Test user authentication only:** `npm run seed:users`
- **Test job listings only:** `npm run seed`
- **Test complete functionality:** `npm run seed:all`

## Customization

You can modify the seed data by editing the respective seed files:

- **Users:** `backend/seedUsers.js`
- **Jobs:** `backend/seedData.js`
- **Complete:** `backend/seedAll.js`

## Troubleshooting

### Common Issues:

1. **"MongoDB connection error"**
   - Check if MongoDB is running
   - Verify MONGO_URI in .env file

2. **"Module not found"**
   - Run `npm install` to install dependencies

3. **"Permission denied"**
   - Check file permissions
   - Ensure you're in the correct directory

### Reset Database:

To completely reset the database:

```bash
npm run seed:all
```

This will clear all existing data and populate with fresh test data.

## Notes

- All passwords are hashed using bcrypt
- Users have realistic skill sets and experience levels
- Jobs have varied requirements and salary ranges
- Perfect for testing AI roadmap generation with different user profiles 