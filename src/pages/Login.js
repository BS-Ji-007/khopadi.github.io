import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, requestOtp } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestOtp(email);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, otpInput);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Login</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={otpSent ? handleLogin : handleRequestOtp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            disabled={otpSent}
          />
          {otpSent && (
            <>
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4 text-sm">
                OTP sent to your email. Please check and enter below.
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={6}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white text-center tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : otpSent ? 'Verify & Login' : 'Send OTP'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-red-500 hover:text-red-400">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
