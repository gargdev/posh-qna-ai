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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPdfBuffer = void 0;
exports.getPdfMetadata = getPdfMetadata;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const text_splitter_1 = require("langchain/text_splitter");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const hf_1 = require("@langchain/community/embeddings/hf");
const fs_1 = __importDefault(require("fs"));
console.log("📚 Initializing PDF service...");
const HF_EMBED_MODEL = "BAAI/bge-small-en-v1.5";
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
function savePdfMetadata(filename) {
    let metadata = [];
    if (fs_1.default.existsSync(METADATA_PATH)) {
        try {
            metadata = JSON.parse(fs_1.default.readFileSync(METADATA_PATH, "utf-8"));
        }
        catch (e) {
            metadata = [];
        }
    }
    metadata.push({
        filename,
        uploadedAt: new Date().toISOString(),
    });
    fs_1.default.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
}
function getPdfMetadata() {
    if (fs_1.default.existsSync(METADATA_PATH)) {
        try {
            return JSON.parse(fs_1.default.readFileSync(METADATA_PATH, "utf-8"));
        }
        catch (e) {
            return [];
        }
    }
    return [];
}
const processPdfBuffer = (buffer, filename) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("\n🔄 Starting PDF processing...");
    console.log("   Buffer size:", buffer.length, "bytes");
    try {
        console.log("📄 Parsing PDF content...");
        const { text } = yield (0, pdf_parse_1.default)(buffer);
        console.log("✅ PDF parsed successfully");
        console.log("   - Extracted text length:", text.length, "characters");
        console.log("   - First 100 chars:", text.slice(0, 100).replace(/\n/g, " "));
        console.log("\n📋 Splitting text into chunks...");
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });
        console.log("   - Chunk size:", 500);
        console.log("   - Chunk overlap:", 50);
        const docs = yield splitter.createDocuments([text]);
        console.log("✅ Text split successfully");
        console.log("   - Number of chunks:", docs.length);
        console.log("   - First chunk sample:", (_b = (_a = docs[0]) === null || _a === void 0 ? void 0 : _a.pageContent) === null || _b === void 0 ? void 0 : _b.slice(0, 100));
        console.log("\n🧠 Initializing embeddings model...");
        const embeddings = new hf_1.HuggingFaceInferenceEmbeddings({
            apiKey: HF_TOKEN,
            model: HF_EMBED_MODEL,
        });
        console.log("✅ Embeddings model initialized");
        let vectorStore;
        if (fs_1.default.existsSync(INDEX_PATH)) {
            console.log("\n📚 Loading existing vector store...");
            vectorStore = yield faiss_1.FaissStore.load(INDEX_PATH, embeddings);
            console.log("✅ Existing vector store loaded");
            console.log("\n➕ Adding new documents to vector store...");
            yield vectorStore.addDocuments(docs);
            console.log("✅ New documents added");
        }
        else {
            console.log("\n💾 Creating new vector store...");
            vectorStore = yield faiss_1.FaissStore.fromDocuments(docs, embeddings);
            console.log("✅ New vector store created");
        }
        console.log("\n💾 Saving vector store to disk...");
        yield vectorStore.save(INDEX_PATH);
        console.log("✅ Vector store saved successfully");
        if (filename) {
            savePdfMetadata(filename);
        }
        console.log("\n✨ PDF processing completed successfully!");
        return { chunks: docs.length };
    }
    catch (error) {
        console.error("\n❌ Error in processPdfBuffer:");
        if (error instanceof Error) {
            console.error("   Type:", error.constructor.name);
            console.error("   Message:", error.message);
            console.error("   Stack:", error.stack);
        }
        else {
            console.error("   Unknown error:", error);
        }
        throw error;
    }
});
exports.processPdfBuffer = processPdfBuffer;
