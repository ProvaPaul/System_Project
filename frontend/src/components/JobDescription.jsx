import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const summarizeText = (text) => {
        // Split text into sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Calculate word frequency
        const wordFreq = {};
        const words = text.toLowerCase().split(/\W+/);
        words.forEach(word => {
            if (word.length > 3) { // Ignore short words
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Score sentences based on word frequency and position
        const sentenceScores = sentences.map((sentence, index) => {
            const sentenceWords = sentence.toLowerCase().split(/\W+/);
            let score = 0;
            sentenceWords.forEach(word => {
                if (wordFreq[word]) {
                    score += wordFreq[word];
                }
            });
            // Give higher weight to sentences at the beginning
            const positionWeight = 1 - (index / sentences.length);
            return { 
                sentence, 
                score: (score / sentenceWords.length) * (1 + positionWeight) 
            };
        });

        // Sort sentences by score and take top 3
        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.sentence.trim());

        // Join sentences and return summary
        return topSentences.join('. ') + '.';
    };

    const handleSummarize = () => {
        if (!singleJob?.description) {
            toast.error('No job description available to summarize');
            return;
        }

        setIsSummarizing(true);
        try {
            const summary = summarizeText(singleJob.description);
            setSummary(summary);
            toast.success('Description summarized successfully!');
        } catch (error) {
            console.error('Error summarizing:', error);
            toast.error('Failed to summarize description');
        } finally {
            setIsSummarizing(false);
        }
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>

            {/* Summarizer Section */}
            <div className='mt-6'>
                <Button
                    onClick={handleSummarize}
                    disabled={isSummarizing || !singleJob?.description}
                    className={`rounded-lg ${isSummarizing ? 'bg-gray-600' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {isSummarizing ? 'Summarizing...' : 'Summarize Description'}
                </Button>

                {summary && (
                    <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                        <h2 className='font-bold mb-2'>Summary:</h2>
                        <p className='text-gray-800'>{summary}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobDescription