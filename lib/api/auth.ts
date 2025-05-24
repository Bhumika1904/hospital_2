import api from './axios';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  message?: string;
}

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/'
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Store auth data in cookies
        Cookies.set('token', response.data.token, cookieOptions);
        Cookies.set('user', JSON.stringify(response.data.user), cookieOptions);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial auth data on error
      authApi.logout();
      throw error;
    }
  },
  
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Also clear localStorage for good measure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_timestamp');
    }
  },
  
  getCurrentUser: () => {
    try {
      const userStr = Cookies.get('user');
      if (userStr) return JSON.parse(userStr);
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  isAuthenticated: () => {
    try {
      const token = Cookies.get('token');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }
};