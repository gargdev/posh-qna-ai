"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const pdf_controller_1 = require("../controllers/pdf.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload = (0, multer_1.default)(); // Use memory storage
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post("/upload", auth_middleware_1.ensureAdminAuthenticated, upload.single("file"), asyncHandler(pdf_controller_1.uploadPdfHandler));
router.get("/list", auth_middleware_1.ensureAdminAuthenticated, pdf_controller_1.listPdfMetadataHandler);
exports.default = router;
