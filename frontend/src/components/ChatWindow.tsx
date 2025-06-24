import {  useState } from 'react';
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

  // 1️⃣ Loading guard
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 2️⃣ Not logged in guard
  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex items-center justify-center">
        <p>Please log in to start chatting.</p>
      </div>
    );
  }

  // 3️⃣ Trial-exhausted guard
  if (!user.isSubscribed && user.chatCredits <= 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex items-center justify-center">
        <p>Your free trial is over. Please subscribe to continue.</p>
      </div>
    );
  }

  // Feedback handler
  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    try {
      setLoadingFeedback(messageId);
      setFeedbackError(null);

      const idx = messages.findIndex((m) => m.id === messageId);
      const userQuery = idx > 0 ? messages[idx - 1].content : '';

      await sendFeedback(
        userQuery,
        messages[idx].content,
        isHelpful,
        'gpt-4-turbo-preview',
        undefined
      );

      updateMessageFeedback(messageId, isHelpful ? 'helpful' : 'not_helpful');
    } catch (err: unknown) {
      console.error('Error sending feedback:', err);
      let msg = 'Failed to send feedback. Please try again.';
      if (err instanceof AxiosError && err.response?.data?.error) {
        msg = err.response.data.error;
      }
      setFeedbackError(msg);
    } finally {
      setLoadingFeedback(null);
    }
  };

  // 4️⃣ Normal chat UI
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-[calc(100vh-12rem)] flex flex-col">
      {feedbackError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleFeedback(msg.id, true)}
                    disabled={loadingFeedback === msg.id}
                    className={`p-1 rounded ${
                      loadingFeedback === msg.id
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
                    disabled={loadingFeedback === msg.id}
                    className={`p-1 rounded ${
                      loadingFeedback === msg.id
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
