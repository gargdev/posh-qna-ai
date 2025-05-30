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
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHandler = void 0;
const chat_service_1 = require("../services/chat.service");
console.log("💬 Initializing Chat Controller...");
const queryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n📥 Chat Query Request Received");
    console.log("   Headers:", JSON.stringify({
        "content-type": req.headers["content-type"],
        "content-length": req.headers["content-length"],
    }, null, 2));
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
        const answer = yield (0, chat_service_1.answerQuery)(query);
        console.log("\n✅ Query Processing Complete");
        console.log("   Answer length:", answer.length, "characters");
        console.log("   Answer preview:", answer.slice(0, 100));
        console.log("\n📤 Sending success response");
        res.json({ answer });
    }
    catch (error) {
        console.error("\n❌ Error in chat query handler:");
        if (error instanceof Error) {
            console.error("   Type:", error.constructor.name);
            console.error("   Message:", error.message);
            console.error("   Stack:", error.stack);
        }
        else {
            console.error("   Unknown error:", error);
        }
        console.log("\n📤 Sending error response");
        res.status(500).json({ error: "Failed to generate answer" });
    }
});
exports.queryHandler = queryHandler;
