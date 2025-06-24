// src/components/Navbar.tsx
import React from 'react';
import { useApp } from '../contexts/AppContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, loading, logout } = useApp();
  const [showModal, setShowModal] = React.useState(false);

  if (loading) return null;  // or a spinner, if you prefer

  return (
    <>
      <div className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 flex justify-between items-center shadow-md z-10">
        <h1 className="text-lg font-bold">POSH Q&A</h1>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Hi, {user.displayName}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >Logout</button>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >Login</button>
        )}
      </div>

      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
