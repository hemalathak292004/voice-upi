// API Configuration
// Automatically detects if running in development or production

const getApiBaseUrl = () => {
  // In production (Vercel), use the deployed backend URL
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    return 'https://voice-upi-85xt.onrender.com';
  }
  // In development, use localhost (or proxy)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return response;
};

export default API_BASE_URL;

