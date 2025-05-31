import { useChat } from "../contexts/ChatContext";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ChatSidebar() {
  const {
    conversations,
    currentConversationId,
    switchConversation,
    startNewConversation,
    deleteConversation,
  } = useChat();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 h-screen flex flex-col">
      <button
        onClick={startNewConversation}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 mb-4"
      >
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center gap-2 mb-2 ${
              conv.id === currentConversationId
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            } rounded-lg transition-colors`}
          >
            <button
              onClick={() => switchConversation(conv.id)}
              className="flex-1 p-3 text-left"
            >
              <p className="text-sm font-medium truncate">{conv.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </p>
            </button>
            <button
              onClick={() => deleteConversation(conv.id)}
              className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete conversation"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
