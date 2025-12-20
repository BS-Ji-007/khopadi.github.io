import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyRegister } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyRegister(formData.email, otpInput);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Register</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={otpSent ? handleVerifyAndRegister : handleSendOtp}>
          {!otpSent ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={onChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={onChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                minLength={6}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full p-3 mb-6 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4 text-sm">
                <p className="font-semibold">OTP sent to your email</p>
                <p className="text-xs mt-1">Enter the 6-digit code to complete registration</p>
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={6}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white text-center tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Verify & Register'}
              </button>
            </>
          )}
        </form>
        <div className="mt-6 text-center text-gray-400">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-red-500 hover:text-red-400">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;