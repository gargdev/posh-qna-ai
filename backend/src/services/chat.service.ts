import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from "fs";

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
    "policy",
    "procedure",
    "rights",
    "responsibilities",
    "consequences",
  ];
  return complexityIndicators.some((indicator) =>
    query.toLowerCase().includes(indicator),
  );
};

// Function to detect if query is a general conversation
const isGeneralConversation = (query: string): boolean => {
  const conversationalPhrases = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "how are you",
    "thanks",
    "thank you",
    "bye",
    "goodbye",
  ];
  return conversationalPhrases.some((phrase) =>
    query.toLowerCase().includes(phrase),
  );
};

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
    // Check feedback history for similar successful queries
    const previousContext = analyzeFeedbackForSimilarQueries(userQuery);

    if (isGeneralConversation(userQuery)) {
      const conversationPrompt = PromptTemplate.fromTemplate(
        [
          "You are a professional and friendly POSH (Prevention of Sexual Harassment) Act expert.",
          "Respond to this general conversation in a warm and professional manner.",
          "If appropriate, remind the user that you're here to help with POSH-related questions.",
          "",
          "User message: {question}",
          "",
          "Response:",
        ].join("\n"),
      );

      const model = new ChatOpenAI({
        modelName: GPT35_MODEL,
        openAIApiKey: OPENAI_API_KEY,
        temperature: 0.7,
      });

      const chain = conversationPrompt
        .pipe(model)
        .pipe(new StringOutputParser());
      return await chain.invoke({ question: userQuery });
    }

    // For POSH-related queries, proceed with context search
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
    const docs = await store.similaritySearch(userQuery, 4); // Increased from 3 to 4 for better context
    console.log("✅ Found similar documents:");
    console.log("   - Number of documents:", docs.length);

    let context = docs
      .map((d, i) => `Context ${i + 1}:\n${d.pageContent}`)
      .join("\n\n");

    // If we have relevant previous context, add it
    if (previousContext) {
      context = `${context}\n\nPrevious successful context:\n${previousContext}`;
    }

    const modelName = isComplexQuery(userQuery) ? GPT4_MODEL : GPT35_MODEL;
    console.log(`\n🤖 Using model: ${modelName}`);

    const prompt = PromptTemplate.fromTemplate(
      [
        "You are a knowledgeable and empathetic POSH (Prevention of Sexual Harassment) Act expert.",
        "Your role is to provide accurate, clear, and sensitive guidance about POSH-related matters.",
        "",
        "Guidelines for your response:",
        "1. Be professional, respectful, and empathetic in your tone",
        "2. Provide accurate information based solely on the given context",
        "3. If the query is about reporting or handling harassment:",
        "   - Emphasize the importance of following proper channels",
        "   - Maintain confidentiality",
        "   - Encourage seeking support from appropriate authorities",
        "4. If the query is about prevention or best practices:",
        "   - Focus on creating a safe and respectful workplace",
        "   - Promote positive behavioral changes",
        "5. If the query is outside POSH scope:",
        "   - Politely redirect to POSH-related topics",
        "   - Suggest consulting appropriate authorities for non-POSH matters",
        "6. Format your response in clear, readable bullet points or numbered lists",
        "7. Avoid any language that could create fear or anxiety",
        "8. Do not provide legal advice - suggest consulting legal experts when appropriate",
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

    // Save initial feedback entry (without user feedback yet)
    submitFeedback(userQuery, response, true, modelName, context);

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
