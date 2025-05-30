import express from "express";
import { queryHandler } from "../controllers/chat.controller";
import pdfRoutes from "./pdf.routes";

console.log("📝 Initializing main router...");
const router = express.Router();

// Log middleware for all routes
router.use((req, _res, next) => {
  console.log(`🔄 ${req.method} request to ${req.originalUrl}`);
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  console.log("🔍 Request query:", JSON.stringify(req.query, null, 2));
  next();
});

console.log("🔗 Setting up /query route for chat endpoints");
router.post("/query", queryHandler);

console.log("📂 Mounting PDF routes at /pdf");
router.use("/pdf", pdfRoutes);

console.log("✅ Router setup complete");

export default router;
