const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateInterviewQuestions = async (req, res) => {
    try {
        const { skill } = req.body;

        if (!skill) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a skill'
            });
        }

        const prompt = `Generate 5 technical interview questions for ${skill}. The questions should be challenging but fair, and should test both theoretical knowledge and practical understanding. Format the response as a JSON array of strings.`;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a technical interviewer. Generate relevant technical interview questions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });

        const questions = JSON.parse(completion.data.choices[0].message.content);

        res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating interview questions'
        });
    }
};

exports.evaluateAnswers = async (req, res) => {
    try {
        const { skill, questions, answers } = req.body;

        if (!skill || !questions || !answers) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const prompt = `Evaluate the following interview answers for ${skill} position. Questions and answers are provided in JSON format. Rate each answer on a scale of 0-100 based on technical accuracy, completeness, and clarity. Provide a final average score. Format the response as a JSON object with a 'score' field.

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}`;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a technical interviewer evaluating candidate responses."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });

        const evaluation = JSON.parse(completion.data.choices[0].message.content);

        res.status(200).json({
            success: true,
            score: evaluation.score
        });
    } catch (error) {
        console.error('Error evaluating answers:', error);
        res.status(500).json({
            success: false,
            message: 'Error evaluating answers'
        });
    }
}; 