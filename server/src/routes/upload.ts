import { Router } from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle bulk resume uploads and Job Description
router.post('/', upload.array('resumes'), handleUpload);

export default router;
