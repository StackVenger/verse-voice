import axios from 'axios';
import { toast } from 'sonner';

// Despite the names, these used to be hardcoded string literals — the env var
// was never actually read. It is now.
//
// In production this is set to the relative path `/api/v1`, because nginx serves
// the site and the API from one hostname. That means no cross-origin requests at
// all, and moving to a different domain needs no rebuild. NEXT_PUBLIC_* is
// inlined at build time, so it is passed as a Docker build arg.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
});

// Add request interceptor to attach token dynamically
axiosPrivate.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = JSON.parse(localStorage.getItem('token') || 'null');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
const handleResponseError = (error) => {
  if (typeof window === 'undefined') return Promise.reject(error);

  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 401 || status === 403) {
    const isLoginPage = window.location.pathname === '/login';
    if (isLoginPage) {
      toast.error(message || 'Invalid credentials');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      toast.error(message || 'Session expired. Please log in again.');
      window.location.href = '/login';
    }
  } else if (status === 429) {
    toast.error('Too many requests. Please slow down.');
  } else if (status >= 500) {
    toast.error(message || 'Server error. Please try again later.');
  } else if (status >= 400) {
    toast.error(message || 'Something went wrong.');
  } else {
    toast.error('Network error. Please check your connection.');
  }

  return Promise.reject(error);
};

publicAxios.interceptors.response.use((res) => res, handleResponseError);
axiosPrivate.interceptors.response.use((res) => res, handleResponseError);

export default publicAxios;
