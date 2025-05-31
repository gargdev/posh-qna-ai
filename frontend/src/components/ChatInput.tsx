import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import type { Message } from "../contexts/ChatContext";
import { sendQuery } from "../services/api";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage } = useChat();

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: "user", content: trimmed };
      addMessage(userMessage);
      setInput("");

      const thinkingMessage: Message = { role: "ai", content: "Thinking..." };
      addMessage(thinkingMessage);

      const response = await sendQuery(trimmed);

      // Remove the thinking message and add the actual response
      const aiMessage: Message = { role: "ai", content: response.answer };
      addMessage(aiMessage);
    } catch (error) {
      console.error("Error sending query:", error);
      const errorMessage: Message = {
        role: "ai",
        content:
          "I apologize, but I encountered an error while processing your question. Please try again.",
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="flex-1 rounded-xl border border-gray-300 p-2"
        type="text"
        placeholder="Ask your POSH-related question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        disabled={isLoading}
      />
      <button
        className={`px-4 py-2 rounded-xl text-white ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={handleSend}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
