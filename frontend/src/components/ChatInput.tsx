import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { sendQuery } from "../services/api";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, removeThinkingMessage } = useChat();

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    try {
      setIsLoading(true);
      addMessage({ role: "user", content: trimmed });
      setInput("");

      addMessage({ role: "ai", content: "Thinking..." });

      const response = await sendQuery(trimmed);

      // Remove the thinking message
      removeThinkingMessage();

      // Add the actual response
      addMessage({ role: "ai", content: response.answer });
    } catch (error) {
      console.error("Error sending query:", error);
      // Remove the thinking message
      removeThinkingMessage();
      addMessage({
        role: "ai",
        content:
          "I apologize, but I encountered an error while processing your question. Please try again.",
      });
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
