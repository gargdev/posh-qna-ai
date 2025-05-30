"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const pdf_routes_1 = __importDefault(require("./pdf.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("📝 Initializing main router...");
const router = express_1.default.Router();
// Log middleware for all routes
router.use((req, _res, next) => {
    console.log(`🔄 ${req.method} request to ${req.originalUrl}`);
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    console.log("🔍 Request query:", JSON.stringify(req.query, null, 2));
    next();
});
console.log("🔗 Setting up /query route for chat endpoints");
router.post("/query", chat_controller_1.queryHandler);
console.log("📂 Mounting PDF routes at /pdf");
router.use("/pdf", pdf_routes_1.default);
console.log("🔗 Setting up /login route for admin authentication");
const loginHandler = (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.json({ success: true });
        return;
    }
    res.status(401).json({ error: "Invalid credentials" });
};
console.log("🔗 Setting up /logout route to destroy the session");
const logoutHandler = (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
};
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
console.log("✅ Router setup complete");
exports.default = router;
