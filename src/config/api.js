// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://khopadi-github-io.onrender.com';

export const API_ENDPOINTS = {
  REGISTER: `${API_URL}/api/register`,
  VERIFY_REGISTER: `${API_URL}/api/verify-register`,
  REQUEST_OTP: `${API_URL}/api/request-otp`,
  LOGIN: `${API_URL}/api/login`,
  PROFILE: `${API_URL}/api/profile`,
  HEALTH: `${API_URL}/health`
};

export default API_URL;
