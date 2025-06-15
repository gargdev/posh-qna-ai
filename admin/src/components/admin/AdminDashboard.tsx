import React, { useEffect } from 'react';
import { LogOut, FileText, Calendar, Shield } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNotification } from '../../contexts/NotificationContext';
import AdminLogin from './AdminLogin';
import AdminFileUpload from './AdminFileUpload';
import AdminCreateOrganization from './AdminCreateOrganization';
import AdminSubscriptions from './AdminSubscriptions';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const { state, actions } = useAdmin();
  const { showSuccess } = useNotification();

  // Fetch data when authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      actions.fetchDocuments();
      actions.fetchSubscriptions();
      actions.fetchOrganizations();
    }
  }, [state.isAuthenticated]);

  const handleLogout = async () => {
    try {
      await actions.logout();
      showSuccess('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      // Error handling is done in context
    }
  };

  // Show loading spinner while checking authentication
  if (state.loading.auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!state.isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your organization and content</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <AdminCreateOrganization />
            <AdminFileUpload />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AdminSubscriptions />

            {/* Documents List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
              </div>

              {state.loading.documents ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Loading documents...</p>
                </div>
              ) : state.documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No documents uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first PDF to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                          <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 truncate block">
                            {doc.filename}
                          </span>
                          {doc.chunks && (
                            <span className="text-xs text-gray-500">
                              {doc.chunks} chunks processed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="sm:hidden">
                          {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;