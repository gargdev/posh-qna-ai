import fetch from "node-fetch";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

console.log("🤖 Initializing Chat Service...");

interface HFResponse {
  generated_text: string;
}

const HF_CHAT_MODEL = "meta-llama/Llama-2-7b-chat-hf";
const HF_TOKEN = process.env.HF_API_TOKEN;
const INDEX_PATH = "./vector-db/faiss-index";

console.log("⚙️ Chat Service Configuration:");
console.log("   - Chat Model:", HF_CHAT_MODEL);
console.log("   - Vector Store Path:", INDEX_PATH);
console.log("   - HF Token Status:", HF_TOKEN ? "✅ Set" : "❌ Not set");

export const answerQuery = async (userQuery: string) => {
  console.log("\n🔍 Processing user query...");
  console.log("   Query:", userQuery);

  try {
    console.log("\n📚 Loading vector store...");
    const store = await FaissStore.load(
      INDEX_PATH,
      {} as any, // embeddings interface isn't needed for similaritySearch
    );
    console.log("✅ Vector store loaded successfully");

    console.log("\n🔎 Performing similarity search...");
    const docs = await store.similaritySearch(userQuery, 3);
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
          content:
            "You are a POSH Act expert. Answer in concise bullet points using only the context.",
        },
        { role: "user", content: `${context}\n\nQuestion: ${userQuery}` },
      ],
    };
    console.log("   System prompt length:", payload.inputs[0].content.length);
    console.log("   Context length:", context.length);

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
