import { Request, Response } from "express";
import { processPdfBuffer } from "../services/pdf.service";

console.log("📑 Initializing PDF Controller...");

export const uploadPdfHandler = async (req: Request, res: Response) => {
  console.log("\n📤 PDF Upload Request Received");
  console.log(
    "   Headers:",
    JSON.stringify(
      {
        "content-type": req.headers["content-type"],
        "content-length": req.headers["content-length"],
      },
      null,
      2,
    ),
  );

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
    const result = await processPdfBuffer(req.file.buffer);

    console.log("\n✅ PDF Processing Complete");
    console.log("   - Chunks created:", result.chunks);

    console.log("\n📤 Sending success response");
    return res.json({
      message: "PDF processed",
      chunks: result.chunks,
    });
  } catch (error) {
    console.error("\n❌ Error in PDF upload handler:");
    if (error instanceof Error) {
      console.error("   Type:", error.constructor.name);
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    } else {
      console.error("   Unknown error:", error);
    }

    console.log("\n📤 Sending error response");
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process PDF",
    });
  }
};
