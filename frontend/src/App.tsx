import { ChatProvider } from './contexts/ChatContext';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col justify-between items-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">POSH Q&A Assistant</h1>
        <div className="w-full max-w-3xl flex flex-col gap-4">
          <ChatWindow />
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;
