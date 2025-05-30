import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

console.log("📚 Initializing PDF service...");

const HF_EMBED_MODEL = "BAAI/bge-small-en-v1.5";
const HF_TOKEN = process.env.HF_API_TOKEN;

console.log("⚙️ Configuration:");
console.log("   - Embedding Model:", HF_EMBED_MODEL);
console.log("   - HF Token Status:", HF_TOKEN ? "✅ Set" : "❌ Not set");

if (!process.env.HF_API_TOKEN) {
  console.error("❌ ERROR: HF_API_TOKEN is not defined!");
  throw new Error("HF_API_TOKEN is not defined!");
}

// BEFORE embedding, add a debug log:
console.log("⚙️ Calling HF embedding for model:", HF_EMBED_MODEL);

export const processPdfBuffer = async (buffer: Buffer) => {
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

    console.log("\n💾 Creating vector store...");
    const vectorStore = await FaissStore.fromDocuments(docs, embeddings);
    console.log("✅ Vector store created");

    console.log("\n💾 Saving vector store to disk...");
    await vectorStore.save("./vector-db/faiss-index");
    console.log("✅ Vector store saved successfully");

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
