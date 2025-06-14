// import { useState } from "react";
// import { useChat } from "../contexts/ChatContext";
// import { sendQuery } from "../services/api";

// export default function ChatInput() {
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { addMessage, removeThinkingMessage } = useChat();

//   const handleSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || isLoading) return;

//     try {
//       setIsLoading(true);
//       addMessage({ role: "user", content: trimmed });
//       setInput("");

//       addMessage({ role: "ai", content: "Thinking..." });

//       const response = await sendQuery(trimmed);

//       // Remove the thinking message
//       removeThinkingMessage();

//       // Add the actual response
//       addMessage({ role: "ai", content: response.answer });
//     } catch (error) {
//       console.error("Error sending query:", error);
//       // Remove the thinking message
//       removeThinkingMessage();
//       addMessage({
//         role: "ai",
//         content:
//           "I apologize, but I encountered an error while processing your question. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex gap-2 items-center">
//       <input
//         className="flex-1 rounded-xl border border-gray-300 p-2"
//         type="text"
//         placeholder="Ask your POSH-related question..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
//         disabled={isLoading}
//       />
//       <button
//         className={`px-4 py-2 rounded-xl text-white ${
//           isLoading
//             ? "bg-blue-300 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//         onClick={handleSend}
//         disabled={isLoading}
//       >
//         {isLoading ? "Sending..." : "Send"}
//       </button>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useChat } from '../contexts/ChatContext';
// import { useApp } from '../contexts/AppContext';
// import { sendQuery } from '../services/api';


// export default function ChatInput() {
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { addMessage, removeThinkingMessage } = useChat();
//   const { user } = useApp();

//   const handleSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || isLoading || !user) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       addMessage({ role: 'user', content: trimmed });
//       setInput('');

//       addMessage({ role: 'ai', content: 'Thinking...' });

//       const response = await sendQuery(trimmed);

//       removeThinkingMessage();
//       addMessage({ role: 'ai', content: response.answer });
//     } catch (error: any) {
//       console.error('Error sending query:', error);
//       const errorMessage =
//         error.response?.data?.error || 'Failed to send query. Please try again.';
//       setError(errorMessage);
//       removeThinkingMessage();
//       addMessage({ role: 'ai', content: errorMessage });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex gap-2 items-center">
//         <input
//           className="flex-1 rounded-xl border border-gray-300 p-2"
//           type="text"
//           placeholder="Ask your POSH-related question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
//           disabled={isLoading || !user}
//         />
//         <button
//           className={`px-4 py-2 rounded-xl text-white ${
//             isLoading || !user
//               ? 'bg-blue-300 cursor-not-allowed'
//               : 'bg-blue-500 hover:bg-blue-600'
//           }`}
//           onClick={handleSend}
//           disabled={isLoading || !user}
//         >
//           {isLoading ? 'Sending...' : 'Send'}
//         </button>
//       </div>
//       {error && (
//         <p className="text-red-600 text-center">{error}</p>
//       )}
//     </div>
//   );
// }

import { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useApp } from '../contexts/AppContext';
import { sendQuery } from '../services/api';
import { AxiosError } from 'axios';

interface QueryResponse {
  answer: string;
}

export default function ChatInput() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMessage, removeThinkingMessage } = useChat();
  const { user } = useApp();

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !user) return;

    try {
      setIsLoading(true);
      setError(null);
      addMessage({ role: 'user', content: trimmed });
      setInput('');

      addMessage({ role: 'ai', content: 'Thinking...' });

      const response = await sendQuery(trimmed);

      removeThinkingMessage();
      addMessage({ role: 'ai', content: (response as QueryResponse).answer });
    } catch (error: unknown) {
      console.error('Error sending query:', error);
      let errorMessage = 'Failed to send query. Please try again.';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setError(errorMessage);
      removeThinkingMessage();
      addMessage({ role: 'ai', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 rounded-xl border border-gray-300 p-2"
          type="text"
          placeholder="Ask your POSH-related question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading || !user}
        />
        <button
          className={`px-4 py-2 rounded-xl text-white ${
            isLoading || !user
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleSend}
          disabled={isLoading || !user}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
