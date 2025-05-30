import dotenv from "dotenv";
console.log("⚙️ Loading environment variables...");
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes/index";

console.log("🚀 Initializing Express application...");
const app = express();

console.log("🔒 Setting up CORS middleware...");
app.use(cors());
console.log("✅ CORS configured");

console.log("📦 Setting up JSON parser middleware...");
app.use(express.json());
console.log("✅ JSON parser configured");

console.log("🛣️ Mounting API routes...");
app.use("/api", routes);
console.log("✅ API routes mounted");

console.log("🏥 Setting up health check endpoint...");
app.get("/api/health", (_req, res) => {
  console.log("💓 Health check requested");
  res.json({ status: "OK" });
  console.log("✅ Health check response sent");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("🌈 Environment configuration:");
  console.log("   - NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "   - HF_API_TOKEN:",
    process.env.HF_API_TOKEN ? "✅ Set" : "❌ Not set",
  );
  console.log(`\n🚀 Server is ready and listening on port ${PORT}`);
  console.log(`   - Health check: http://localhost:${PORT}/api/health`);
  console.log(`   - API base URL: http://localhost:${PORT}/api`);
});
