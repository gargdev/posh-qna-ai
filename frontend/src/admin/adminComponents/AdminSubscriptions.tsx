import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';

const AdminSubscriptions = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscriptions, setSubscriptions] = useState<{ email: string; createdAt: string }[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/subscription/list', {
        withCredentials: true,
      });
      setSubscriptions(res.data);
    } catch {
      // Ignore errors silently
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddEmail = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!emailInput.trim()) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/subscription/add',
        { email: emailInput.trim().toLowerCase() },
        { withCredentials: true },
      );
      setStatus('Email added successfully!');
      setEmailInput('');
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to add email');
      } else {
        setError('Failed to add email');
      }
    }
  };

  const handleRemoveEmail = async (email: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/subscription/remove/${email}`, {
        withCredentials: true,
      });
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to remove email');
      } else {
        setError('Failed to remove email');
      }
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Manage Subscriptions</h2>
      <form onSubmit={handleAddEmail} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Subscriber Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
              placeholder="e.g., user@gmail.com"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
        {status && <p className="text-green-600 mt-2">{status}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Subscribed Emails</h3>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">No subscribed emails yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {subscriptions.map((sub, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center">
                <span>{sub.email}</span>
                <div>
                  <span className="text-sm text-gray-500 mr-4">
                    {new Date(sub.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveEmail(sub.email)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;