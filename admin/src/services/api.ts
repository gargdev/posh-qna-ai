import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, Organization, Subscription, PdfDocument } from '../types/admin';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Redirect to login or clear auth state
      window.location.href = '/admin';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.data || response.data;
};

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    throw new Error(message);
  }
  throw new Error('An unexpected error occurred');
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post('/login', { email, password });
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      const response = await apiClient.post('/logout');
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/auth/check');
      return handleApiResponse(response);
    } catch (error) {
      return false;
    }
  },
};

// Organization API
export const organizationApi = {
  create: async (organization: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> => {
    try {
      const response = await apiClient.post('/organization/create', organization);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  list: async (): Promise<Organization[]> => {
    try {
      const response = await apiClient.get('/organization/list');
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/organization/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Subscription API
export const subscriptionApi = {
  add: async (email: string): Promise<Subscription> => {
    try {
      const response = await apiClient.post('/subscription/add', { email });
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  list: async (): Promise<Subscription[]> => {
    try {
      const response = await apiClient.get('/subscription/list');
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  remove: async (email: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/subscription/remove/${email}`);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  uploadCsv: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ message: string; added: number; skipped: number }> => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await apiClient.post('/subscription/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Document API
export const documentApi = {
  upload: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ message: string; chunks: number }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  list: async (): Promise<PdfDocument[]> => {
    try {
      const response = await apiClient.get('/pdf/list');
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (filename: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/pdf/${filename}`);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Utility functions
export const downloadSampleCsv = (): void => {
  const sampleCsv = `name,email\nJohn Doe,john.doe@gmail.com\nJane Smith,jane.smith@company.com\nAlice Johnson,alice@example.org`;
  const blob = new Blob([sampleCsv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-subscribers.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};