import { ChatProvider } from "./contexts/ChatContext";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import ChatSidebar from "./components/ChatSidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
import {  useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

function GoogleCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios.get('http://localhost:4000/api/auth/user', {
          withCredentials: true,
        });
        navigate('/');
      } catch (error) {
        console.error('Error in callback:', error);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);
  return <div>Loading...</div>;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ChatProvider>
            <Navbar />
            <div className="min-h-screen flex bg-gray-100 pt-16">
             <ChatSidebar />
              <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full">
                  <ChatWindow />
                  <ChatInput />
                </div>
              </div>
            </div>
          </ChatProvider>
        }
      />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
    </Routes>
  );
}

export default App;