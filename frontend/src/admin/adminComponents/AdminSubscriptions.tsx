import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import ProgressBar from '@ramonak/react-progress-bar';

const AdminSubscriptions = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscriptions, setSubscriptions] = useState<{ email: string; createdAt: string }[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // New state
  const [isUploading, setIsUploading] = useState(false);

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


  // Handle CSV upload
  const handleCsvUpload = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    if (!csvFile) {
      setError('Please select a CSV file');
      setIsUploading(false);
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const res = await axios.post('http://localhost:4000/api/subscription/upload-csv', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      setStatus(res.data.message);
      setCsvFile(null);
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to upload CSV');
        if (err.response?.data?.details) {
          setError(`${err.response.data.error}: ${err.response.data.details.join(', ')}`);
        }
      } else {
        setError('Failed to upload CSV');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Download sample CSV
  const downloadSampleCsv = () => {
    const sampleCsv = `name,email\nJohn Doe,john.doe@gmail.com\nJane Smith,jane.smith@gopratle.com`;
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // State for CSV file
  const [csvFile, setCsvFile] = useState<File | null>(null);

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
      {/* CSV Upload */}
      <form onSubmit={handleCsvUpload} className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Subscriber CSV (Format: "name,email" columns)
          </label>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 w-fit"
            >
              Download Sample CSV
            </button>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
                disabled={isUploading}
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                disabled={isUploading}
              >
                Upload CSV
              </button>
            </div>
            {isUploading && (
              <ProgressBar
                completed={uploadProgress}
                bgColor="#10B981"
                height="20px"
                labelColor="#ffffff"
                className="mt-2"
              />
            )}
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