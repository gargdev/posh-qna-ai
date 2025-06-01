import express, { Request, Response, RequestHandler } from "express";
import { queryHandler, feedbackHandler } from "../controllers/chat.controller";
import pdfRoutes from "./pdf.routes";
import dotenv from "dotenv";
dotenv.config();

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

console.log("🔗 Setting up /feedback route for response feedback");
router.post("/feedback", feedbackHandler);

console.log("📂 Mounting PDF routes at /pdf");
router.use("/pdf", pdfRoutes);

console.log("🔗 Setting up /login route for admin authentication");
const loginHandler: RequestHandler = (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    res.json({ success: true });
    return;
  }
  res.status(401).json({ error: "Invalid credentials" });
};

console.log("🔗 Setting up /logout route to destroy the session");
const logoutHandler: RequestHandler = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};

router.post("/login", loginHandler);
router.post("/logout", logoutHandler);

console.log("✅ Router setup complete");

export default router;
