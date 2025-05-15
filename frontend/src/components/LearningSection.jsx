import { Button } from './ui/button';
import { ArrowLeft, MessageSquare, Mic, Users, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningSection = () => {
    const navigate = useNavigate();

    const handleQuizGenerator = () => {
        window.open('http://localhost:5174', '_blank'); // Assuming quiz app runs on port 3001
    };
     const handleVoiceGenerator = () => {
        window.open('http://localhost:5000', '_blank'); // Assuming quiz app runs on port 3001
    };
    const handleChatbot = () => {
        window.open('http://localhost:8001', '_blank'); // Assuming quiz app runs on port 3001
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header with back button */}
                <div className="flex items-center mb-8">
                    <Button
                        onClick={() => navigate('/profile')}
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Profile
                    </Button>
                </div>

                {/* Main content */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Hub</h1>
                    <p className="text-lg text-gray-600">Enhance your skills with our AI-powered learning tools</p>
                </div>

                {/* Feature cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Chatbot Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <MessageSquare className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
                            <p className="text-gray-600 mb-4">Get instant answers to your questions</p>
                            <Button
                                onClick={handleChatbot}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </div>

                    {/* Voice Assistant Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-purple-100 p-4 rounded-full mb-4">
                                <Mic className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
                            <p className="text-gray-600 mb-4">Practice speaking with AI</p>
                            <Button
                                onClick={handleVoiceGenerator}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </div>

                    {/* AI Interview Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 p-4 rounded-full mb-4">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Interview</h3>
                            <p className="text-gray-600 mb-4">Practice mock interviews</p>
                            <Button
                                variant="outline"
                                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                disabled
                            >
                                Coming Soon
                            </Button>
                        </div>
                    </div>

                    {/* AI Quiz Generator Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-orange-100 p-4 rounded-full mb-4">
                                <Brain className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Quiz Generator</h3>
                            <p className="text-gray-600 mb-4">Test your knowledge with AI-generated quizzes</p>
                            <Button
                                onClick={handleQuizGenerator}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningSection;