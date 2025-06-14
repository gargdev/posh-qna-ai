import { useState, type ChangeEvent } from 'react';

interface AdminFileUploadProps {
  onUploadSuccess: (chunks: number | null) => void; // Callback for successful upload
}

const AdminFileUpload = ({ onUploadSuccess }: AdminFileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chunks, setChunks] = useState<number | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setChunks(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a PDF file.');
      return;
    }
    setUploading(true);
    setStatus(null);
    setChunks(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:4000/api/pdf/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setStatus('Upload successful!');
      if (data.chunks) {
        setChunks(data.chunks);
        onUploadSuccess(data.chunks); // Notify parent
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(err.message || 'Upload failed.');
      } else {
        setStatus('Upload failed.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
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
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
      {status && (
        <p
          className={`mt-4 ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}
        >
          {status}
        </p>
      )}
      {chunks !== null && (
        <p className="mt-2 text-gray-700">
          PDF processed into <b>{chunks}</b> chunks.
        </p>
      )}
    </div>
  );
};

export default AdminFileUpload;