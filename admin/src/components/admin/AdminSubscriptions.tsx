import React, { useState, useEffect, type FormEvent } from 'react';
import { Mail, Plus, X, Download, Upload, Users, Loader } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNotification } from '../../contexts/NotificationContext';
import { downloadSampleCsv } from '../../services/api';

const AdminSubscriptions: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { state, actions } = useAdmin();
  const { showSuccess, showError } = useNotification();

  // Fetch subscriptions on mount
  useEffect(() => {
    actions.fetchSubscriptions();
  }, []);

  const handleAddEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!emailInput.trim()) {
      showError('Validation Error', 'Email is required');
      return;
    }

    try {
      await actions.addSubscription(emailInput.trim().toLowerCase());
      showSuccess('Success', 'Email added successfully!');
      setEmailInput('');
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleRemoveEmail = async (email: string) => {
    try {
      await actions.removeSubscription(email);
      showSuccess('Success', 'Email removed successfully!');
    } catch (error) {
      // Error is already handled in context
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
      if (droppedFile.name.toLowerCase().endsWith('.csv')) {
        setCsvFile(droppedFile);
      } else {
        showError('Invalid File Type', 'Please select a CSV file only.');
      }
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      showError('No File Selected', 'Please select a CSV file to upload.');
      return;
    }

    try {
      await actions.uploadCsvSubscriptions(csvFile, setUploadProgress);
      showSuccess('Upload Successful', 'CSV file has been processed successfully!');
      setCsvFile(null);
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
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Subscriptions</h2>
          <p className="text-sm text-gray-600">Add and manage subscriber emails</p>
        </div>
      </div>

      {/* Add Single Email */}
      <form onSubmit={handleAddEmail} className="space-y-4 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Add Subscriber Email
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., user@gmail.com"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail(e)}
                disabled={state.loading.subscriptions}
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={state.loading.subscriptions}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* CSV Upload Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Bulk Upload CSV</label>
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample</span>
          </button>
        </div>

        {/* CSV Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-green-400 bg-green-50'
              : csvFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={state.loading.upload}
          />

          <div className="space-y-3">
            {csvFile ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{csvFile.name}</p>
                  <p className="text-sm text-gray-500">Ready to upload</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Drop CSV file here</p>
                  <p className="text-sm text-gray-500">Format: name,email columns</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {state.loading.upload && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleCsvUpload}
          disabled={!csvFile || state.loading.upload}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {state.loading.upload ? (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Uploading CSV...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV
            </div>
          )}
        </button>
      </div>

      {/* Subscribers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Subscribers ({state.subscriptions.length})
          </h3>
        </div>

        {state.loading.subscriptions ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading subscribers...</p>
          </div>
        ) : state.subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No subscribers yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first subscriber to get started</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {state.subscriptions.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 truncate">{sub.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleRemoveEmail(sub.email)}
                    className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;