import { Request, Response, RequestHandler } from "express";
import { answerQuery, submitFeedback } from "../services/chat.service";

console.log("💬 Initializing Chat Controller...");

export const queryHandler: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  console.log("\n📥 Chat Query Request Received");
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

  const { query } = req.body;
  console.log("   Query:", query);

  if (!query) {
    console.error("❌ No query provided in request");
    console.error("   Request body:", req.body);
    res.status(400).json({ error: "Query is required" });
    return;
  }

  try {
    console.log("\n🔄 Processing chat query...");
    console.log("   Query text:", query);

    const answer = await answerQuery(query);

    console.log("\n✅ Query Processing Complete");
    console.log("   Answer length:", answer.length, "characters");
    console.log("   Answer preview:", answer.slice(0, 100));

    console.log("\n📤 Sending success response");
    res.json({ answer });
  } catch (error) {
    console.error("\n❌ Error in chat query handler:");
    if (error instanceof Error) {
      console.error("   Type:", error.constructor.name);
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    } else {
      console.error("   Unknown error:", error);
    }

    console.log("\n📤 Sending error response");
    res.status(500).json({ error: "Failed to generate answer" });
  }
};

export const feedbackHandler: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  console.log("\n📥 Feedback Request Received");
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

  const { query, response, helpful, modelUsed, context } = req.body;

  if (!query || helpful === undefined || !response || !modelUsed) {
    console.error("❌ Invalid feedback data");
    console.error("   Request body:", req.body);
    res.status(400).json({ error: "Invalid feedback data" });
    return;
  }

  try {
    console.log("\n🔄 Processing feedback...");
    console.log("   Query:", query);
    console.log("   Helpful:", helpful);

    await submitFeedback(query, response, helpful, modelUsed, context);

    console.log("\n✅ Feedback Processing Complete");
    console.log("\n📤 Sending success response");
    res.json({ message: "Feedback received" });
  } catch (error) {
    console.error("\n❌ Error in feedback handler:");
    if (error instanceof Error) {
      console.error("   Type:", error.constructor.name);
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    } else {
      console.error("   Unknown error:", error);
    }

    console.log("\n📤 Sending error response");
    res.status(500).json({ error: "Failed to process feedback" });
  }
};