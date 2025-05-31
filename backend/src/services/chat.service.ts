import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

console.log("🤖 Initializing Chat Service...");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const INDEX_PATH = "./vector-db/faiss-index";

// Model configuration
const GPT4_MODEL = "gpt-4-turbo-preview";
const GPT35_MODEL = "gpt-3.5-turbo";
const EMBEDDING_MODEL = "text-embedding-3-small";

console.log("⚙️ Chat Service Configuration:");
console.log("   - GPT-4 Model:", GPT4_MODEL);
console.log("   - GPT-3.5 Model:", GPT35_MODEL);
console.log("   - Embedding Model:", EMBEDDING_MODEL);
console.log("   - Vector Store Path:", INDEX_PATH);
console.log(
  "   - OpenAI API Key Status:",
  OPENAI_API_KEY ? "✅ Set" : "❌ Not set",
);

if (!OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is not defined!");
  throw new Error(
    "OPENAI_API_KEY is not defined! Please set the OPENAI_API_KEY environment variable.",
  );
}

// Function to determine if a query is complex
const isComplexQuery = (query: string): boolean => {
  const complexityIndicators = [
    "compare",
    "explain",
    "analyze",
    "difference",
    "why",
    "how",
    "what if",
    "should",
    "could",
    "would",
  ];
  return complexityIndicators.some((indicator) =>
    query.toLowerCase().includes(indicator),
  );
};

export const answerQuery = async (userQuery: string) => {
  console.log("\n🔍 Processing user query...");
  console.log("   Query:", userQuery);

  try {
    console.log("\n🧠 Initializing embeddings model...");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: EMBEDDING_MODEL,
    });
    console.log("✅ Embeddings model initialized");

    console.log("\n📚 Loading vector store...");
    const store = await FaissStore.load(INDEX_PATH, embeddings);
    console.log("✅ Vector store loaded successfully");

    console.log("\n🔎 Performing similarity search...");
    const docs = await store.similaritySearch(userQuery, 3);
    console.log("✅ Found similar documents:");
    console.log("   - Number of documents:", docs.length);

    const context = docs
      .map((d, i) => `Context ${i + 1}:\n${d.pageContent}`)
      .join("\n\n");

    // Select model based on query complexity
    const modelName = isComplexQuery(userQuery) ? GPT4_MODEL : GPT35_MODEL;
    console.log(`\n🤖 Using model: ${modelName}`);

    const prompt = PromptTemplate.fromTemplate(
      [
        "You are a POSH (Prevention of Sexual Harassment) Act expert.",
        "Use the following context to answer the question. Keep your answer concise and in bullet points.",
        "Only use information from the provided context.",
        "",
        "Context:",
        "{context}",
        "",
        "Question: {question}",
        "",
        "Answer:",
      ].join("\n"),
    );

    const model = new ChatOpenAI({
      modelName: modelName,
      openAIApiKey: OPENAI_API_KEY,
      temperature: 0.3,
    });

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    console.log("\n🤖 Generating response...");
    const response = await chain.invoke({
      context: context,
      question: userQuery,
    });

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
