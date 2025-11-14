import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const requestOtp = async (email) => {
  return await axios.post(`${API_URL}/request-otp`, { email });
};

export const login = async (email, password, otp) => {
  const response = await axios.post(`${API_URL}/login`, { email, password, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const register = async (name, email, password) => {
  return await axios.post(`${API_URL}/register`, { name, email, password });
};

export const verifyRegister = async (email, otp) => {
  const response = await axios.post(`${API_URL}/verify-register`, { email, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};
