import express from 'express';
import { queryHandler } from '../controllers/chat.controller';
import pdfRoutes from './pdf.routes';

const router = express.Router();

router.post('/query', queryHandler);
router.use('/pdf', pdfRoutes); // <-- Add this

export default router;
