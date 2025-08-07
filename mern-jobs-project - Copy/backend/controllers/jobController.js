import { Job } from '../models/Job.js';

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company');
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company applications');
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
