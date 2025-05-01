import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeResume = async (resumeUrl) => {
        try {
            setLoading(true);
            setIsModalOpen(true);
            
            const response = await axios.post('http://localhost:5000/analyze-resume', {
                resume_url: resumeUrl
            });
            
            setResumeAnalysis(response.data);
            toast.success('Resume analyzed successfully');
        } catch (error) {
            console.error('Error analyzing resume:', error);
            toast.error('Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell className="space-x-2">
                                    {
                                        item.applicant?.profile?.resume ? (
                                            <>
                                                <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => analyzeResume(item?.applicant?.profile?.resume)}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Analyzing...' : 'Resume Summary'}
                                                </Button>
                                            </>
                                        ) : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resume Analysis</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {loading ? (
                            <p>Analyzing resume...</p>
                        ) : resumeAnalysis ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Category:</h3>
                                    <p>{resumeAnalysis.category}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Confidence Score:</h3>
                                    <p>{resumeAnalysis.confidence_score}%</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Key Skills:</h3>
                                    <p>{resumeAnalysis.key_skills?.join(', ')}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No analysis available</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable