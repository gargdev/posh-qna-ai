import { Request, Response, RequestHandler } from "express";
import { answerQuery } from "../services/chat.service";

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
