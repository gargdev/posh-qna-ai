export interface Organization {
  id?: string;
  name: string;
  domains: string[];
  organizers: string[];
  createdAt?: string;
}

export interface Subscription {
  email: string;
  createdAt: string;
}

export interface PdfDocument {
  filename: string;
  uploadedAt: string;
  chunks?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface AdminState {
  isAuthenticated: boolean;
  organizations: Organization[];
  subscriptions: Subscription[];
  documents: PdfDocument[];
  loading: {
    auth: boolean;
    organizations: boolean;
    subscriptions: boolean;
    documents: boolean;
    upload: boolean;
  };
  error: string | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}