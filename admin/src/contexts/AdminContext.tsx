import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AdminState, Organization, Subscription, PdfDocument } from '../types/admin';
import { authApi, organizationApi, subscriptionApi, documentApi } from '../services/api';

// Initial state
const initialState: AdminState = {
  isAuthenticated: false,
  organizations: [],
  subscriptions: [],
  documents: [],
  loading: {
    auth: true,
    organizations: false,
    subscriptions: false,
    documents: false,
    upload: false,
  },
  error: null,
};

// Action types
type AdminAction =
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'SET_LOADING'; payload: { key: keyof AdminState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORGANIZATIONS'; payload: Organization[] }
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
  | { type: 'SET_DOCUMENTS'; payload: PdfDocument[] }
  | { type: 'ADD_DOCUMENT'; payload: PdfDocument }
  | { type: 'RESET_STATE' };

// Reducer
const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload };
    
    case 'ADD_ORGANIZATION':
      return { ...state, organizations: [...state.organizations, action.payload] };
    
    case 'SET_SUBSCRIPTIONS':
      return { ...state, subscriptions: action.payload };
    
    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };
    
    case 'REMOVE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter(sub => sub.email !== action.payload),
      };
    
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    
    case 'RESET_STATE':
      return { ...initialState, loading: { ...initialState.loading, auth: false } };
    
    default:
      return state;
  }
};

// Context
interface AdminContextType {
  state: AdminState;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => Promise<void>;
    fetchOrganizations: () => Promise<void>;
    addSubscription: (email: string) => Promise<void>;
    removeSubscription: (email: string) => Promise<void>;
    uploadCsvSubscriptions: (file: File, onProgress?: (progress: number) => void) => Promise<void>;
    fetchSubscriptions: () => Promise<void>;
    uploadDocument: (file: File, onProgress?: (progress: number) => void) => Promise<void>;
    fetchDocuments: () => Promise<void>;
    clearError: () => void;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider component
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authApi.checkAuth();
        dispatch({ type: 'SET_AUTH', payload: isAuthenticated });
      } catch (error) {
        dispatch({ type: 'SET_AUTH', payload: false });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      }
    };

    checkAuth();
  }, []);

  // Actions
  const actions = {
    login: async (email: string, password: string): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        await authApi.login(email, password);
        dispatch({ type: 'SET_AUTH', payload: true });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      }
    },

    logout: async (): Promise<void> => {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        dispatch({ type: 'RESET_STATE' });
      }
    },

    createOrganization: async (org: Omit<Organization, 'id' | 'createdAt'>): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'organizations', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const newOrg = await organizationApi.create(org);
        dispatch({ type: 'ADD_ORGANIZATION', payload: newOrg });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create organization' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'organizations', value: false } });
      }
    },

    fetchOrganizations: async (): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'organizations', value: true } });
      
      try {
        const organizations = await organizationApi.list();
        dispatch({ type: 'SET_ORGANIZATIONS', payload: organizations });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch organizations' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'organizations', value: false } });
      }
    },

    addSubscription: async (email: string): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subscriptions', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const subscription = await subscriptionApi.add(email);
        dispatch({ type: 'ADD_SUBSCRIPTION', payload: subscription });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add subscription' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'subscriptions', value: false } });
      }
    },

    removeSubscription: async (email: string): Promise<void> => {
      try {
        await subscriptionApi.remove(email);
        dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: email });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove subscription' });
        throw error;
      }
    },

    uploadCsvSubscriptions: async (file: File, onProgress?: (progress: number) => void): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'upload', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        await subscriptionApi.uploadCsv(file, onProgress);
        // Refresh subscriptions after upload
        await actions.fetchSubscriptions();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to upload CSV' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'upload', value: false } });
      }
    },

    fetchSubscriptions: async (): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subscriptions', value: true } });
      
      try {
        const subscriptions = await subscriptionApi.list();
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: subscriptions });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch subscriptions' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'subscriptions', value: false } });
      }
    },

    uploadDocument: async (file: File, onProgress?: (progress: number) => void): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'upload', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const result = await documentApi.upload(file, onProgress);
        const newDoc: PdfDocument = {
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          chunks: result.chunks,
        };
        dispatch({ type: 'ADD_DOCUMENT', payload: newDoc });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to upload document' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'upload', value: false } });
      }
    },

    fetchDocuments: async (): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'documents', value: true } });
      
      try {
        const documents = await documentApi.list();
        dispatch({ type: 'SET_DOCUMENTS', payload: documents });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch documents' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'documents', value: false } });
      }
    },

    clearError: (): void => {
      dispatch({ type: 'SET_ERROR', payload: null });
    },
  };

  return (
    <AdminContext.Provider value={{ state, actions }}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook to use admin context
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};