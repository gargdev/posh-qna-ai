import { ChatProvider } from "./contexts/ChatContext";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a PDF file.");
      return;
    }
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:4000/api/pdf/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setStatus("Upload successful!");
    } catch (err) {
      setStatus("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin PDF Upload</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ChatProvider>
            <div className="min-h-screen flex flex-col justify-between items-center bg-gray-100 p-4">
              <h1 className="text-2xl font-bold text-center mb-4">
                POSH Q&A Assistant
              </h1>
              <div className="w-full max-w-3xl flex flex-col gap-4">
                <ChatWindow />
                <ChatInput />
              </div>
            </div>
          </ChatProvider>
        }
      />
      <Route path="/admin-upload" element={<AdminUpload />} />
    </Routes>
  );
}

export default App;
