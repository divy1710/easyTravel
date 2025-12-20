import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Send cookies with every request
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if NOT on login/signup pages and NOT checking auth
    const isAuthCheck = error.config?.url?.includes('/auth/me');
    const isOnAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
    
    if (error.response?.status === 401 && !isAuthCheck && !isOnAuthPage) {
      // Redirect to login if unauthorized on protected routes
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
