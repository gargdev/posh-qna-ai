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
exports.answerQuery = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const faiss_1 = require("@langchain/community/vectorstores/faiss");
console.log("🤖 Initializing Chat Service...");
const HF_CHAT_MODEL = "meta-llama/Llama-2-7b-chat-hf";
const HF_TOKEN = process.env.HF_API_TOKEN;
const INDEX_PATH = "./vector-db/faiss-index";
console.log("⚙️ Chat Service Configuration:");
console.log("   - Chat Model:", HF_CHAT_MODEL);
console.log("   - Vector Store Path:", INDEX_PATH);
console.log("   - HF Token Status:", HF_TOKEN ? "✅ Set" : "❌ Not set");
const answerQuery = (userQuery) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🔍 Processing user query...");
    console.log("   Query:", userQuery);
    try {
        console.log("\n📚 Loading vector store...");
        const store = yield faiss_1.FaissStore.load(INDEX_PATH, {});
        console.log("✅ Vector store loaded successfully");
        console.log("\n🔎 Performing similarity search...");
        const docs = yield store.similaritySearch(userQuery, 3);
        console.log("✅ Found similar documents:");
        console.log("   - Number of documents:", docs.length);
        const context = docs
            .map((d, i) => `Context ${i + 1}:\n${d.pageContent}`)
            .join("\n\n");
        console.log("\n📝 Preparing chat completion payload...");
        const payload = {
            inputs: [
                {
                    role: "system",
                    content: "You are a POSH Act expert. Answer in concise bullet points using only the context.",
                },
                { role: "user", content: `${context}\n\nQuestion: ${userQuery}` },
            ],
        };
        console.log("   System prompt length:", payload.inputs[0].content.length);
        console.log("   Context length:", context.length);
        console.log("\n🤖 Calling chat model API...");
        const res = yield (0, node_fetch_1.default)(`https://api-inference.huggingface.co/models/${HF_CHAT_MODEL}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = yield res.text();
            console.error("\n❌ Chat API error:");
            console.error("   Status:", res.status);
            console.error("   Error:", err);
            throw new Error(`Chat failed ${res.status}: ${err}`);
        }
        console.log("✅ Received response from chat model");
        const json = (yield res.json());
        const response = Array.isArray(json)
            ? json[0].generated_text
            : json.generated_text;
        console.log("\n📤 Processing response...");
        console.log("   Response length:", response.length, "characters");
        console.log("   Preview:", response.slice(0, 100));
        return response;
    }
    catch (error) {
        console.error("\n❌ Error in answerQuery:");
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
exports.answerQuery = answerQuery;
