import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MoreHorizontal, FileText } from 'lucide-react';
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
    const [selectedResume, setSelectedResume] = useState(null);

    const analyzeResume = async (resumeUrl) => {
        try {
            setLoading(true);
            setSelectedResume(resumeUrl);
            setIsModalOpen(true);
            
            const formData = new FormData();
            formData.append('resume_url', resumeUrl);

            const response = await axios.post('http://localhost:5000/pred', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    {loading && selectedResume === item?.applicant?.profile?.resume ? 'Analyzing...' : 'Analyze Resume'}
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Resume Analysis</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <p>Analyzing resume...</p>
                            </div>
                        ) : resumeAnalysis ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Predicted Category:</h3>
                                        <p className="bg-gray-100 p-2 rounded">{resumeAnalysis.predicted_category}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Recommended Job:</h3>
                                        <p className="bg-gray-100 p-2 rounded">{resumeAnalysis.recommended_job}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Extracted Information:</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        {resumeAnalysis.phone && (
                                            <p><span className="font-medium">Phone:</span> {resumeAnalysis.phone}</p>
                                        )}
                                        {resumeAnalysis.email && (
                                            <p><span className="font-medium">Email:</span> {resumeAnalysis.email}</p>
                                        )}
                                        {resumeAnalysis.name && (
                                            <p><span className="font-medium">Name:</span> {resumeAnalysis.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Skills:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeAnalysis.skills?.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Education:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeAnalysis.education?.map((edu, index) => (
                                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                {edu}
                                            </span>
                                        ))}
                                    </div>
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