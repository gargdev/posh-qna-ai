// import { useState } from "react";
// import { useChat } from "../contexts/ChatContext";
// import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
// import { sendFeedback } from "../services/api";

// export default function ChatWindow() {
//   const { messages, updateMessageFeedback } = useChat();
//   const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
//   const [feedbackError, setFeedbackError] = useState<string | null>(null);

//   const handleFeedback = async (messageId: string, isHelpful: boolean) => {
//     try {
//       setLoadingFeedback(messageId);
//       setFeedbackError(null);

//       const message = messages.find((msg) => msg.id === messageId);
//       if (!message) return;

//       // Find the user's query that preceded this message
//       const messageIndex = messages.findIndex((msg) => msg.id === messageId);
//       const userQuery =
//         messageIndex > 0 ? messages[messageIndex - 1].content : "";

//       // Send feedback to backend
//       await sendFeedback(
//         userQuery,
//         message.content,
//         isHelpful,
//         "gpt-4-turbo-preview", // This should ideally come from the response
//         undefined, // We can add context if needed
//       );

//       // Update local state
//       updateMessageFeedback(messageId, isHelpful ? "helpful" : "not_helpful");
//     } catch (error) {
//       console.error("Error sending feedback:", error);
//       setFeedbackError("Failed to send feedback. Please try again.");
//     } finally {
//       setLoadingFeedback(null);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] overflow-y-auto">
//       {feedbackError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {feedbackError}
//         </div>
//       )}

//       {messages.length === 0 ? (
//         <p className="text-gray-500 italic">
//           Start by asking a POSH-related question...
//         </p>
//       ) : (
//         messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`mb-3 p-3 rounded-xl ${
//               msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200"
//             }`}
//           >
//             <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

//             {/* Show feedback buttons only for AI messages that are not "Thinking..." */}
//             {msg.role === "ai" && msg.content !== "Thinking..." && (
//               <div className="mt-2 flex items-center gap-2 justify-end">
//                 <button
//                   onClick={() => handleFeedback(msg.id, true)}
//                   disabled={loadingFeedback === msg.id}
//                   className={`p-1 rounded ${
//                     loadingFeedback === msg.id
//                       ? "opacity-50 cursor-not-allowed"
//                       : msg.feedback === "helpful"
//                         ? "text-green-600 bg-green-100"
//                         : "text-gray-400 hover:text-green-600"
//                   }`}
//                   title="Helpful"
//                 >
//                   <HandThumbUpIcon className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleFeedback(msg.id, false)}
//                   disabled={loadingFeedback === msg.id}
//                   className={`p-1 rounded ${
//                     loadingFeedback === msg.id
//                       ? "opacity-50 cursor-not-allowed"
//                       : msg.feedback === "not_helpful"
//                         ? "text-red-600 bg-red-100"
//                         : "text-gray-400 hover:text-red-600"
//                   }`}
//                   title="Not Helpful"
//                 >
//                   <HandThumbDownIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { useChat } from '../contexts/ChatContext';
// import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
// import { sendFeedback } from '../services/api';
// import axios from 'axios';



// export default function ChatWindow() {
//   const { messages, updateMessageFeedback } = useChat();
//   const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
//   const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
//   // Removed unused user state
//   const [accessError, setAccessError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/auth/user', {
//           withCredentials: true,
//         });
//         // setUser(response.data.user); // Removed unused user state
//         if (!response.data.user) {
//           setAccessError('Please log in with Google to access the chat.');
//         }
//       } catch (error: unknown) {
//         console.error('Error fetching user:', error);
//         if (
//           typeof error === 'object' &&
//           error !== null &&
//           'response' in error &&
//           typeof (error as { response?: { data?: { error?: string } } }).response === 'object'
//         ) {
//           setAccessError(
//             (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
//               'Failed to verify access. Please try again.',
//           );
//         } else {
//           setAccessError('Failed to verify access. Please try again.');
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleFeedback = async (messageId: string, isHelpful: boolean) => {
//     try {
//       setLoadingFeedback(messageId);
//       setFeedbackError(null);

//       const message = messages.find((msg) => msg.id === messageId);
//       if (!message) return;

//       const messageIndex = messages.findIndex((msg) => msg.id === messageId);
//       const userQuery = messageIndex > 0 ? messages[messageIndex - 1].content : '';

//       await sendFeedback(
//         userQuery,
//         message.content,
//         isHelpful,
//         'gpt-4-turbo-preview',
//         undefined,
//       );

//       updateMessageFeedback(messageId, isHelpful ? 'helpful' : 'not_helpful');
//     } catch (error: unknown) {
//       console.error('Error sending feedback:', error);
//       type ErrorWithResponse = {
//         response?: {
//           data?: {
//             error?: string;
//           };
//         };
//       };

//       if (
//         typeof error === 'object' &&
//         error !== null &&
//         'response' in error &&
//         typeof (error as ErrorWithResponse).response === 'object'
//       ) {
//         setFeedbackError(
//           (error as ErrorWithResponse).response?.data?.error ||
//             'Failed to send feedback. Please try again.',
//         );
//       } else {
//         setFeedbackError('Failed to send feedback. Please try again.');
//       }
//     } finally {
//       setLoadingFeedback(null);
//     }
//   };

//   if (accessError) {
//     return (
//       <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {accessError}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
//       {feedbackError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {feedbackError}
//         </div>
//       )}
//       <div className="flex-1 overflow-y-auto">
//         {messages.length === 0 ? (
//           <p className="text-gray-500 italic">
//             Start by asking a POSH-related question...
//           </p>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`mb-3 p-3 rounded-xl ${
//                 msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'
//               }`}
//             >
//               <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
//               {msg.role === 'ai' && msg.content !== 'Thinking...' && (
//                 <div className="mt-2 flex items-center gap-2 justify-end">
//                   <button
//                     onClick={() => handleFeedback(msg.id, true)}
//                     disabled={loadingFeedback === msg.id}
//                     className={`p-1 rounded ${
//                       loadingFeedback === msg.id
//                         ? 'opacity-50 cursor-not-allowed'
//                         : msg.feedback === 'helpful'
//                           ? 'text-green-600 bg-green-100'
//                           : 'text-gray-400 hover:text-green-600'
//                     }`}
//                     title="Helpful"
//                   >
//                     <HandThumbUpIcon className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleFeedback(msg.id, false)}
//                     disabled={loadingFeedback === msg.id}
//                     className={`p-1 rounded ${
//                       loadingFeedback === msg.id
//                         ? 'opacity-50 cursor-not-allowed'
//                         : msg.feedback === 'not_helpful'
//                           ? 'text-red-600 bg-red-100'
//                           : 'text-gray-400 hover:text-red-600'
//                     }`}
//                     title="Not Helpful"
//                   >
//                     <HandThumbDownIcon className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useApp } from '../contexts/AppContext';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { sendFeedback } from '../services/api';
import { AxiosError } from 'axios';

export default function ChatWindow() {
  const { messages, updateMessageFeedback } = useChat();
  const { user, loading } = useApp();
  const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    if (!user || accessError) return;
    try {
      setLoadingFeedback(messageId);
      setFeedbackError(null);

      const message = messages.find((msg) => msg.id === messageId);
      if (!message) return;

      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      const userQuery = messageIndex > 0 ? messages[messageIndex - 1].content : '';

      await sendFeedback(
        userQuery,
        message.content,
        isHelpful,
        'gpt-4-turbo-preview',
        undefined,
      );

      updateMessageFeedback(messageId, isHelpful ? 'helpful' : 'not_helpful');
    } catch (error: unknown) {
      console.error('Error sending feedback:', error);
      let errorMessage = 'Failed to send feedback. Please try again.';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.status === 403) {
          setAccessError('Email domain not authorized for chat');
        }
      }
      setFeedbackError(errorMessage);
    } finally {
      setLoadingFeedback(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user && !accessError) {
    // If user is not logged in and no access error is set, prompt for login
    setAccessError('Please log in with Google to access the chat.');
  }

  if (accessError) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {accessError}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
      {feedbackError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {feedbackError}
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">
            Start by asking a POSH-related question...
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 p-3 rounded-xl ${
                msg.role === 'user' ? 'bg-blue-200 text-right' : 'bg-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'ai' && msg.content !== 'Thinking...' && (
                <div className="mt-2 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleFeedback(msg.id, true)}
                    disabled={loadingFeedback === msg.id || !user}
                    className={`p-1 rounded ${
                      loadingFeedback === msg.id || !user
                        ? 'opacity-50 cursor-not-allowed'
                        : msg.feedback === 'helpful'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-500 hover:text-green-600'
                    }`}
                    title="Helpful"
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, false)}
                    disabled={loadingFeedback === msg.id || !user}
                    className={`p-1 rounded ${
                      loadingFeedback === msg.id || !user
                        ? 'opacity-50 cursor-not-allowed'
                        : msg.feedback === 'not_helpful'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-500 hover:text-red-600'
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
    </div>
  );
}