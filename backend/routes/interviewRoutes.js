const express = require('express');
const router = express.Router();
const { generateInterviewQuestions, evaluateAnswers } = require('../controllers/interviewController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/generate-interview-questions', isAuthenticated, generateInterviewQuestions);
router.post('/evaluate-answers', isAuthenticated, evaluateAnswers);

module.exports = router; 