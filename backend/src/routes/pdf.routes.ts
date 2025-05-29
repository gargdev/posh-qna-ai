import express from 'express';
import multer from 'multer';
import { uploadPdfHandler } from '../controllers/pdf.controller';

const upload = multer(); // Use memory storage
const router = express.Router();

router.post('/upload', upload.single('file'), uploadPdfHandler);

export default router;
