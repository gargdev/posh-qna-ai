import { useChat } from '../contexts/ChatContext';

export default function ChatWindow() {
  const { messages } = useChat();

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-[400px] overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500 italic">Start by asking a POSH-related question...</p>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 p-3 rounded-xl ${
              msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
