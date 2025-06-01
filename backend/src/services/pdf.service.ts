import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import fs from "fs";

console.log("📚 Initializing PDF service...");

const HF_EMBED_MODEL = "mixedbread-ai/mxbai-embed-large-v1";
const HF_TOKEN = process.env.HF_API_TOKEN;
const INDEX_PATH = "./vector-db/faiss-index";
const METADATA_PATH = "./vector-db/pdf-metadata.json";

console.log("⚙️ Configuration:");
console.log("   - Embedding Model:", HF_EMBED_MODEL);
console.log("   - HF Token Status:", HF_TOKEN ? "✅ Set" : "❌ Not set");

if (!process.env.HF_API_TOKEN) {
  console.error("❌ ERROR: HF_API_TOKEN is not defined!");
  throw new Error("HF_API_TOKEN is not defined!");
}

// BEFORE embedding, add a debug log:
console.log("⚙️ Calling HF embedding for model:", HF_EMBED_MODEL);

function savePdfMetadata(filename: string) {
  let metadata: any[] = [];
  if (fs.existsSync(METADATA_PATH)) {
    try {
      metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf-8"));
    } catch (e) {
      metadata = [];
    }
  }
  metadata.push({
    filename,
    uploadedAt: new Date().toISOString(),
  });
  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
}

export function getPdfMetadata() {
  if (fs.existsSync(METADATA_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(METADATA_PATH, "utf-8"));
    } catch (e) {
      return [];
    }
  }
  return [];
}

export const processPdfBuffer = async (buffer: Buffer, filename?: string) => {
  console.log("\n🔄 Starting PDF processing...");
  console.log("   Buffer size:", buffer.length, "bytes");

  try {
    console.log("📄 Parsing PDF content...");
    const { text } = await pdfParse(buffer);
    console.log("✅ PDF parsed successfully");
    console.log("   - Extracted text length:", text.length, "characters");
    console.log(
      "   - First 100 chars:",
      text.slice(0, 100).replace(/\n/g, " "),
    );

    console.log("\n📋 Splitting text into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    console.log("   - Chunk size:", 500);
    console.log("   - Chunk overlap:", 50);

    const docs = await splitter.createDocuments([text]);
    console.log("✅ Text split successfully");
    console.log("   - Number of chunks:", docs.length);
    console.log(
      "   - First chunk sample:",
      docs[0]?.pageContent?.slice(0, 100),
    );

    console.log("\n🧠 Initializing embeddings model...");
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: HF_TOKEN,
      model: HF_EMBED_MODEL,
    });
    console.log("✅ Embeddings model initialized");

    let vectorStore;
    if (fs.existsSync(INDEX_PATH)) {
      console.log("\n📚 Loading existing vector store...");
      vectorStore = await FaissStore.load(INDEX_PATH, embeddings);
      console.log("✅ Existing vector store loaded");
      console.log("\n➕ Adding new documents to vector store...");
      await vectorStore.addDocuments(docs);
      console.log("✅ New documents added");
    } else {
      console.log("\n💾 Creating new vector store...");
      vectorStore = await FaissStore.fromDocuments(docs, embeddings);
      console.log("✅ New vector store created");
    }

    console.log("\n💾 Saving vector store to disk...");
    await vectorStore.save(INDEX_PATH);
    console.log("✅ Vector store saved successfully");

    if (filename) {
      savePdfMetadata(filename);
    }

    console.log("\n✨ PDF processing completed successfully!");
    return { chunks: docs.length };
  } catch (error) {
    console.error("\n❌ Error in processPdfBuffer:");
    if (error instanceof Error) {
      console.error("   Type:", error.constructor.name);
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    } else {
      console.error("   Unknown error:", error);
    }
    throw error;
  }
};
