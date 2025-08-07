import express from 'express';
import { getAllJobs, getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.get('/all', getAllJobs);
router.get('/get/:id', getJobById);

export default router;
