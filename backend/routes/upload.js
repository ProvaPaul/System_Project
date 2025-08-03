import express from 'express';
import multer from 'multer';
import { encryptData } from '../utils/encryptUtils.js';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('document'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const encrypted = encryptData(fileContent);

        // Save encrypted data to a file (just for test)
        const encryptedPath = path.join('uploads', `enc_${req.file.originalname}.txt`);
        fs.writeFileSync(encryptedPath, encrypted, 'utf8');

        res.json({ success: true, message: 'File uploaded and encrypted!', encryptedPath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Encryption failed' });
    }
});

export default router;
