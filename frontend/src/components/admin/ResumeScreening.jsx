import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'react-hot-toast';

const ResumeScreening = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a resume file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axios.post('http://localhost:5000/analyze-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            toast.success('Resume analyzed successfully');
        } catch (error) {
            console.error('Error analyzing resume:', error);
            toast.error('Error analyzing resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Resume Screening</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Analyze Resume'}
                        </Button>
                    </form>

                    {result && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p><strong>Category:</strong> {result.category}</p>
                                <p><strong>Confidence Score:</strong> {result.confidence_score}%</p>
                                <p><strong>Key Skills:</strong> {result.key_skills?.join(', ')}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumeScreening; 