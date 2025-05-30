"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPdfMetadataHandler = exports.uploadPdfHandler = void 0;
const pdf_service_1 = require("../services/pdf.service");
console.log("📑 Initializing PDF Controller...");
const uploadPdfHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n📤 PDF Upload Request Received");
    console.log("   Headers:", JSON.stringify({
        "content-type": req.headers["content-type"],
        "content-length": req.headers["content-length"],
    }, null, 2));
    if (!req.file) {
        console.error("❌ No file in request");
        console.error("   Request body:", req.body);
        console.error("   Files object:", req.files);
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        console.log("\n📋 File Details:");
        console.log("   - Original name:", req.file.originalname);
        console.log("   - File size:", req.file.size, "bytes");
        console.log("   - MIME type:", req.file.mimetype);
        console.log("\n🔄 Processing PDF file...");
        const result = yield (0, pdf_service_1.processPdfBuffer)(req.file.buffer, req.file.originalname);
        console.log("\n✅ PDF Processing Complete");
        console.log("   - Chunks created:", result.chunks);
        console.log("\n📤 Sending success response");
        return res.json({
            message: "PDF processed",
            chunks: result.chunks,
        });
    }
    catch (error) {
        console.error("\n❌ Error in PDF upload handler:");
        if (error instanceof Error) {
            console.error("   Type:", error.constructor.name);
            console.error("   Message:", error.message);
            console.error("   Stack:", error.stack);
        }
        else {
            console.error("   Unknown error:", error);
        }
        console.log("\n📤 Sending error response");
        return res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to process PDF",
        });
    }
});
exports.uploadPdfHandler = uploadPdfHandler;
const listPdfMetadataHandler = (_req, res) => {
    const metadata = (0, pdf_service_1.getPdfMetadata)();
    res.json(metadata);
};
exports.listPdfMetadataHandler = listPdfMetadataHandler;
