import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { sendFeedback } from "../services/api";

export default function ChatWindow() {
  const { messages, updateMessageFeedback } = useChat();
  const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    try {
      setLoadingFeedback(messageId);
      setFeedbackError(null);

      const message = messages.find((msg) => msg.id === messageId);
      if (!message) return;

      // Find the user's query that preceded this message
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      const userQuery =
        messageIndex > 0 ? messages[messageIndex - 1].content : "";

      // Send feedback to backend
      await sendFeedback(
        userQuery,
        message.content,
        isHelpful,
        "gpt-4-turbo-preview", // This should ideally come from the response
        undefined, // We can add context if needed
      );

      // Update local state
      updateMessageFeedback(messageId, isHelpful ? "helpful" : "not_helpful");
    } catch (error) {
      console.error("Error sending feedback:", error);
      setFeedbackError("Failed to send feedback. Please try again.");
    } finally {
      setLoadingFeedback(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] overflow-y-auto">
      {feedbackError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {feedbackError}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-500 italic">
          Start by asking a POSH-related question...
        </p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-3 rounded-xl ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

            {/* Show feedback buttons only for AI messages that are not "Thinking..." */}
            {msg.role === "ai" && msg.content !== "Thinking..." && (
              <div className="mt-2 flex items-center gap-2 justify-end">
                <button
                  onClick={() => handleFeedback(msg.id, true)}
                  disabled={loadingFeedback === msg.id}
                  className={`p-1 rounded ${
                    loadingFeedback === msg.id
                      ? "opacity-50 cursor-not-allowed"
                      : msg.feedback === "helpful"
                        ? "text-green-600 bg-green-100"
                        : "text-gray-400 hover:text-green-600"
                  }`}
                  title="Helpful"
                >
                  <HandThumbUpIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(msg.id, false)}
                  disabled={loadingFeedback === msg.id}
                  className={`p-1 rounded ${
                    loadingFeedback === msg.id
                      ? "opacity-50 cursor-not-allowed"
                      : msg.feedback === "not_helpful"
                        ? "text-red-600 bg-red-100"
                        : "text-gray-400 hover:text-red-600"
                  }`}
                  title="Not Helpful"
                >
                  <HandThumbDownIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
