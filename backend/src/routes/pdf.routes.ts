import express from "express";
import multer from "multer";
import { uploadPdfHandler } from "../controllers/pdf.controller";

const upload = multer(); // Use memory storage
const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/upload", upload.single("file"), asyncHandler(uploadPdfHandler));

export default router;
