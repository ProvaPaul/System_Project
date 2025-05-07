import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getUser } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.user);
    const [skill, setSkill] = useState('');
    const [interviewLoading, setInterviewLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showSummary, setShowSummary] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    const handleStartInterview = async () => {
        if (!skill.trim()) {
            toast.error('Please enter a skill');
            return;
        }

        setInterviewLoading(true);
        try {
            const response = await axios.post('/api/v1/interview/generate-interview-questions', { skill });
            setQuestions(response.data.questions);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setShowSummary(false);
            setScore(null);
            toast.success('Interview started!');
        } catch (error) {
            console.error('Error generating questions:', error);
            toast.error('Failed to generate questions');
        } finally {
            setInterviewLoading(false);
        }
    };

    const handleAnswerChange = (e) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: e.target.value
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmitInterview();
        }
    };

    const handleSubmitInterview = async () => {
        setInterviewLoading(true);
        try {
            const response = await axios.post('/api/v1/interview/evaluate-answers', {
                skill,
                questions,
                answers
            });
            setScore(response.data.score);
            setShowSummary(true);
            toast.success('Interview completed!');
        } catch (error) {
            console.error('Error evaluating answers:', error);
            toast.error('Failed to evaluate answers');
        } finally {
            setInterviewLoading(false);
        }
    };

    const handleRetry = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowSummary(false);
        setScore(null);
    };

    const handleResumeBuilder = () => {
        window.open('http://localhost:3000', '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">Profile</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-gray-900">{user?.role}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleResumeBuilder}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Create/Edit Resume
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Interview Practice Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">AI Interview Practice</h2>
                    
                    {!questions.length && !showSummary && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter a skill to practice
                                </label>
                                <input
                                    type="text"
                                    id="skill"
                                    value={skill}
                                    onChange={(e) => setSkill(e.target.value)}
                                    placeholder="e.g., React, Laravel, MERN"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleStartInterview}
                                disabled={interviewLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {interviewLoading ? 'Starting Interview...' : 'Start Interview'}
                            </button>
                        </div>
                    )}

                    {questions.length > 0 && !showSummary && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                                <p className="text-gray-800">{questions[currentQuestionIndex]}</p>
                            </div>
                            <div>
                                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Answer
                                </label>
                                <textarea
                                    id="answer"
                                    value={answers[currentQuestionIndex] || ''}
                                    onChange={handleAnswerChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type your answer here..."
                                />
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={interviewLoading || !answers[currentQuestionIndex]}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Interview'}
                            </button>
                        </div>
                    )}

                    {showSummary && (
                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-2">Interview Summary</h3>
                                <p className="text-green-700">Your Score: {score}%</p>
                            </div>
                            
                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Question {index + 1}</h4>
                                        <p className="text-gray-800 mb-2">{question}</p>
                                        <div className="mt-2">
                                            <h5 className="font-medium text-gray-700">Your Answer:</h5>
                                            <p className="text-gray-600 mt-1">{answers[index]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleRetry}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Try Another Interview
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 