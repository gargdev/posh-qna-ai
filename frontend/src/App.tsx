import { ChatProvider } from "./contexts/ChatContext";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chunks, setChunks] = useState<number | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pdfList, setPdfList] = useState<
    { filename: string; uploadedAt: string }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setChunks(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a PDF file.");
      return;
    }
    setUploading(true);
    setStatus(null);
    setChunks(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:4000/api/pdf/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus("Upload successful!");
      if (data.chunks) setChunks(data.chunks);
    } catch (err: any) {
      setStatus(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setLoggedIn(true);
    } catch (err: any) {
      setLoginError(err.message || "Login failed.");
    }
  };

  const fetchPdfList = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pdf/list", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPdfList(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (loggedIn) {
      fetchPdfList();
    }
  }, [loggedIn, status]);

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    setFile(null);
    setStatus(null);
    setChunks(null);
    setPdfList([]);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-gray-300 p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-gray-300 p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Login
          </button>
          {loginError && (
            <p className="text-red-600 text-center">{loginError}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin PDF Upload</h1>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
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
        {status && (
          <p
            className={`mt-4 ${status.includes("successful") ? "text-green-600" : "text-red-600"}`}
          >
            {status}
          </p>
        )}
        {chunks !== null && (
          <p className="mt-2 text-gray-700">
            PDF processed into <b>{chunks}</b> chunks.
          </p>
        )}
        <div className="mt-8 w-full">
          <h2 className="text-lg font-semibold mb-2">Uploaded PDFs</h2>
          {pdfList.length === 0 ? (
            <p className="text-gray-500">No PDFs uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pdfList.map((pdf, idx) => (
                <li
                  key={idx}
                  className="py-2 flex justify-between items-center"
                >
                  <span>{pdf.filename}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(pdf.uploadedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
