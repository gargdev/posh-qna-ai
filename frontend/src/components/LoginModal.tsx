// src/components/LoginModal.tsx
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AxiosError } from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { loginLocal, loginGoogle } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLocal = async () => {
    setError(null);
    try {
      await loginLocal(email, password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleLocal}
          className="w-full mb-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >Login with Email</button>
        <button
          onClick={loginGoogle}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >Continue with Google</button>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:underline"
        >Cancel</button>
      </div>
    </div>
  );
}
