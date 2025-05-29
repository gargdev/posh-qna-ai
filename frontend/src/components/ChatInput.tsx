import { useState } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage } = useChat();

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addMessage({ role: 'user', content: trimmed });
    setInput('');

    // TODO: Call backend API
    addMessage({ role: 'ai', content: "Thinking..." });
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="flex-1 rounded-xl border border-gray-300 p-2"
        type="text"
        placeholder="Ask your POSH-related question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
