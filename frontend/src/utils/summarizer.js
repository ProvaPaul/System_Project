import axios from 'axios';

const SUMMARIZER_API_URL = 'http://localhost:8000/summarize';

export const summarizeText = async (text) => {
    try {
        const response = await axios.post(SUMMARIZER_API_URL, {
            dialogue: text
        });
        return response.data.summary;
    } catch (error) {
        console.error('Summarization error:', error);
        throw new Error(error.response?.data?.error || 'Failed to summarize text');
    }
}; 