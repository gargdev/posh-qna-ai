import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Message {
  role: "user" | "ai";
  content: string;
  id: string;
  timestamp: string;
  feedback?: "helpful" | "not_helpful";
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  startNewConversation: () => void;
  switchConversation: (id: string) => void;
  updateMessageFeedback: (
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ) => void;
  deleteConversation: (id: string) => void;
  removeThinkingMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = "posh_chat_history";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(() => {
    const stored = localStorage.getItem("posh_current_conversation");
    return stored || null;
  });

  // Get current conversation messages
  const messages = currentConversationId
    ? conversations.find((c) => c.id === currentConversationId)?.messages || []
    : [];

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Save current conversation ID
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem("posh_current_conversation", currentConversationId);
    }
  }, [currentConversationId]);

  const startNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('📝 Starting new conversation:', newId); // Debug log
    setConversations((prev) => [...prev, newConversation]);
    setCurrentConversationId(newId);
  };

  const switchConversation = (id: string) => {
    console.log('🔄 Switching to conversation:', id); // Debug log
    setCurrentConversationId(id);
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    console.log('📩 Adding message:', newMessage); // Debug log

    setConversations((prev) => {
      if (!currentConversationId) {
        // Start a new conversation if none exists
        const newId = Date.now().toString();
        console.log('📝 Creating new conversation for message:', newId); // Debug log
        setCurrentConversationId(newId);
        return [
          {
            id: newId,
            title: message.content.slice(0, 30) + "...",
            messages: [newMessage],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      return prev.map((conv) => {
        if (conv.id === currentConversationId) {
          // Update conversation title if it's the first message
          const title =
            conv.messages.length === 0
              ? message.content.slice(0, 30) + "..."
              : conv.title;

          return {
            ...conv,
            title,
            messages: [...conv.messages, newMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return conv;
      });
    });
  };

  const updateMessageFeedback = (
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ) => {
    console.log('📤 Updating feedback for message:', messageId, feedback); // Debug log
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) =>
          msg.id === messageId ? { ...msg, feedback } : msg,
        ),
      })),
    );
  };

  const clearMessages = () => {
    if (currentConversationId) {
      console.log('🗑️ Clearing messages for conversation:', currentConversationId); // Debug log
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== currentConversationId),
      );
    }
    startNewConversation();
  };

  // Start a new conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation();
    }
  }, [conversations.length]);

  const deleteConversation = (id: string) => {
    console.log('🗑️ Deleting conversation:', id); // Debug log
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (currentConversationId === id) {
      // If we're deleting the current conversation, switch to another one or create new
      const remaining = conversations.filter((conv) => conv.id !== id);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      } else {
        startNewConversation();
      }
    }
  };

  const removeThinkingMessage = () => {
    console.log('🧠 Removing "Thinking..." message'); // Debug log
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: conv.messages.filter(
              (msg) => msg.content !== "Thinking...",
            ),
          };
        }
        return conv;
      }),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        currentConversationId,
        addMessage,
        clearMessages,
        startNewConversation,
        switchConversation,
        updateMessageFeedback,
        deleteConversation,
        removeThinkingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
