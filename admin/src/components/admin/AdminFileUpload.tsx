import React, { useState, type ChangeEvent } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNotification } from '../../contexts/NotificationContext';
import { formatFileSize } from '../../services/api';

const AdminFileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { state, actions } = useAdmin();
  const { showSuccess, showError } = useNotification();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        showError('Invalid File Type', 'Please select a PDF file only.');
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        showError('Invalid File Type', 'Please select a PDF file only.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showError('No File Selected', 'Please select a PDF file to upload.');
      return;
    }

    try {
      await actions.uploadDocument(file, setUploadProgress);
      showSuccess('Upload Successful', `${file.name} has been uploaded and processed successfully.`);
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      // Error is already handled in context
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
          <Upload className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <p className="text-sm text-gray-600">Upload PDF files for processing</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-purple-400 bg-purple-50'
            : file
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={state.loading.upload}
        />

        <div className="space-y-4">
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your PDF here, or click to browse
                </p>
                <p className="text-sm text-gray-500">Supports PDF files up to 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {state.loading.upload && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || state.loading.upload}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {state.loading.upload ? (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminFileUpload;