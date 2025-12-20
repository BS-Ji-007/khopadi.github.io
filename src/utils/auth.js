import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export const requestOtp = async (email) => {
  return await axios.post(API_ENDPOINTS.REQUEST_OTP, { email });
};

export const login = async (email, otp) => {
  const response = await axios.post(API_ENDPOINTS.LOGIN, { email, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const register = async (name, email, password) => {
  return await axios.post(API_ENDPOINTS.REGISTER, { name, email, password });
};

export const verifyRegister = async (email, otp) => {
  const response = await axios.post(API_ENDPOINTS.VERIFY_REGISTER, { email, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
