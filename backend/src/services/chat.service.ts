import { fetch } from "undici";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import fs from "fs";
import redis from "../utils/redis";
console.log("🤖 Initializing Chat Service...");

interface HFResponse {
  generated_text: string;
}

// Using Mixtral for reliable inference API access
const HF_CHAT_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_EMBED_MODEL = "mixedbread-ai/mxbai-embed-large-v1";
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
    "HF_API_TOKEN is not defined! Please set the HF_API_TOKEN environment variable with your Hugging Face access token.",
  );
}

// Add feedback tracking
interface FeedbackData {
  query: string;
  response: string;
  helpful: boolean;
  timestamp: string;
  modelUsed: string;
  context?: string;
}

const FEEDBACK_PATH = "./vector-db/feedback-data.json";

// Ensure feedback directory exists
const feedbackDir = "./vector-db";
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir, { recursive: true });
}

function saveFeedback(feedback: FeedbackData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      let feedbackHistory: FeedbackData[] = [];
      if (fs.existsSync(FEEDBACK_PATH)) {
        try {
          feedbackHistory = JSON.parse(fs.readFileSync(FEEDBACK_PATH, "utf-8"));
        } catch (e) {
          console.error("Error reading feedback file:", e);
          feedbackHistory = [];
        }
      }
      feedbackHistory.push(feedback);
      fs.writeFileSync(FEEDBACK_PATH, JSON.stringify(feedbackHistory, null, 2));
      console.log("✅ Feedback saved successfully");
      resolve();
    } catch (error) {
      console.error("❌ Error saving feedback:", error);
      reject(error);
    }
  });
}

export const submitFeedback = async (
  query: string,
  response: string,
  helpful: boolean,
  modelUsed: string,
  context?: string,
): Promise<void> => {
  console.log("\n💾 Saving feedback...");
  console.log("   Query:", query);
  console.log("   Helpful:", helpful);
  console.log("   Model:", modelUsed);

  const feedback: FeedbackData = {
    query,
    response,
    helpful,
    timestamp: new Date().toISOString(),
    modelUsed,
    context,
  };
  await saveFeedback(feedback);
  console.log("✅ Feedback submitted successfully");
};

// Enhance answer generation with feedback analysis
const analyzeFeedbackForSimilarQueries = (query: string): string | null => {
  if (!fs.existsSync(FEEDBACK_PATH)) return null;

  try {
    const feedbackHistory: FeedbackData[] = JSON.parse(
      fs.readFileSync(FEEDBACK_PATH, "utf-8"),
    );

    // Find similar queries that received positive feedback
    const similarQueries = feedbackHistory.filter(
      (f) => f.helpful && f.query.toLowerCase().includes(query.toLowerCase()),
    );

    if (similarQueries.length > 0) {
      // Return the context from the most recent successful similar query
      return similarQueries[similarQueries.length - 1].context || null;
    }
  } catch (e) {
    console.error("Error analyzing feedback:", e);
  }

  return null;
};

export const answerQuery = async (userQuery: string) => {
  console.log("\n🔍 Processing user query...");
  console.log("   Query:", userQuery);

  try {
        const previousContext = analyzeFeedbackForSimilarQueries(userQuery);

    const cacheKey = `query:${userQuery.trim().toLowerCase()}`;
    
    console.log("\n🧠 Initializing embeddings model...");
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: HF_TOKEN,
      model: HF_EMBED_MODEL,
    });
    console.log("✅ Embeddings model initialized");

    // 3. Load Vector Store
    console.log("\n📚 Loading vector store...");
    const store = await FaissStore.load(INDEX_PATH, embeddings);
    console.log("✅ Vector store loaded successfully");

     // 4. Similarity Search
    console.log("\n🔎 Performing similarity search...");
    const docs = await store.similaritySearch(userQuery, 3);
    console.log("✅ Found similar documents:");
    console.log("   - Number of documents:", docs.length);

    let context = docs
      .map((d, i) => `Context ${i + 1}:\n${d.pageContent}`)
      .join("\n\n");

       if (previousContext) {
      context = `${context}\n\nPrevious successful context:\n${previousContext}`;
    }
    
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

    // 6. Call HF API
    console.log("\n🤖 Calling chat model API...");
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${HF_CHAT_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("\n❌ Chat API error:");
      console.error("   Status:", res.status);
      console.error("   Error:", err);
      if (res.status === 401 || res.status === 403) {
        throw new Error(
          "Authentication failed. Please check your HF_API_TOKEN is correct.",
        );
      }
      throw new Error(`Chat failed ${res.status}: ${err}`);
    }

    console.log("✅ Received response from chat model");

    const json = (await res.json()) as HFResponse | HFResponse[];
    const response = Array.isArray(json)
      ? json[0].generated_text
      : json.generated_text;

    console.log("\n📤 Processing response...");
    console.log("   Response length:", response.length, "characters");
    console.log("   Preview:", response.slice(0, 100));

    // 7. Cache the answer in Redis
    await redis.set(cacheKey, response, "EX", 3600); // 1 hour cache
    console.log("💾 Answer cached in Redis");

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
};
