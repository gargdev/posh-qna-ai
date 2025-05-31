"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerQuery = void 0;
const { fetch } = require("undici");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const {
  HuggingFaceInferenceEmbeddings,
} = require("@langchain/community/embeddings/hf");
console.log("🤖 Initializing Chat Service...");
// Using Mixtral for reliable inference API access
const HF_CHAT_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_EMBED_MODEL = "BAAI/bge-small-en-v1.5";
const HF_TOKEN = process.env.HF_API_TOKEN;
const INDEX_PATH = "./vector-db/faiss-index";
console.log("⚙️ Chat Service Configuration:");
console.log("   - Chat Model:", HF_CHAT_MODEL);
console.log("   - Embedding Model:", HF_EMBED_MODEL);
console.log("   - Vector Store Path:", INDEX_PATH);
console.log("   - HF Token Status:", HF_TOKEN ? "✅ Set" : "❌ Not set");
if (!HF_TOKEN) {
  console.error("❌ ERROR: HF_API_TOKEN is not defined!");
  throw new Error(
    "HF_API_TOKEN is not defined! Please set the HF_API_TOKEN environment variable with your Hugging Face access token."
  );
}
const answerQuery = async (userQuery) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🔍 Processing user query...");
    console.log("   Query:", userQuery);
    try {
      console.log("\n🧠 Initializing embeddings model...");
      const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: HF_TOKEN,
        model: HF_EMBED_MODEL,
      });
      console.log("✅ Embeddings model initialized");
      console.log("\n📚 Loading vector store...");
      const store = yield FaissStore.load(INDEX_PATH, embeddings);
      console.log("✅ Vector store loaded successfully");
      console.log("\n🔎 Performing similarity search...");
      const docs = yield store.similaritySearch(userQuery, 3);
      console.log("✅ Found similar documents:");
      console.log("   - Number of documents:", docs.length);
      const context = docs
        .map((d, i) => `Context ${i + 1}:\n${d.pageContent}`)
        .join("\n\n");
      console.log("\n📝 Preparing chat completion payload...");
      const prompt = `<s>[INST] You are a POSH (Prevention of Sexual Harassment) Act expert. Use the following context to answer the question. Keep your answer concise and in bullet points. Only use information from the provided context.

Context:
${context}

Question: ${userQuery} [/INST]</s>`;
      const payload = {
        inputs: prompt,
        parameters: {
          max_new_tokens: 512, // Reduced for more concise answers
          temperature: 0.3, // Reduced for more focused answers
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      };
      console.log("   Prompt length:", prompt.length);
      console.log("\n🤖 Calling chat model API...");
      const res = yield fetch(
        `https://api-inference.huggingface.co/models/${HF_CHAT_MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = yield res.text();
        console.error("\n❌ Chat API error:");
        console.error("   Status:", res.status);
        console.error("   Error:", err);
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            "Authentication failed. Please check your HF_API_TOKEN is correct."
          );
        }
        throw new Error(`Chat failed ${res.status}: ${err}`);
      }
      console.log("✅ Received response from chat model");
      const json = yield res.json();
      const response = Array.isArray(json)
        ? json[0].generated_text
        : json.generated_text;
      console.log("\n📤 Processing response...");
      console.log("   Response length:", response.length, "characters");
      console.log("   Preview:", response.slice(0, 100));
      return response;
    } catch (error) {
      console.error("\n❌ Error in answerQuery:");
      if (error instanceof Error) {
        console.error("   Type:", error.constructor.name);
        console.error("   Message:", error.message);
        console.error("   Stack:", error.stack);
      } else {
        console.error("   Unknown error:", error);
      }
      throw error;
    }
  });
exports.answerQuery = answerQuery;
