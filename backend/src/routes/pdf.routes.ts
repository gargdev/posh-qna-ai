import express from "express";
import multer from "multer";
import {
  uploadPdfHandler,
  listPdfMetadataHandler,
} from "../controllers/pdf.controller";
import { ensureAdminAuthenticated } from "../middleware/auth.middleware";

const upload = multer(); // Use memory storage
const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/upload",
  ensureAdminAuthenticated,
  upload.single("file"),
  asyncHandler(uploadPdfHandler),
);

router.get("/list", ensureAdminAuthenticated, listPdfMetadataHandler);

export default router;
