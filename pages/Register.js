import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isOtpSent) {
        // Validate form
        if (!formData.name || !formData.email || !formData.password) {
          alert('Please fill all fields');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          alert('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Send registration request
        await axios.post('http://localhost:5000/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        setIsOtpSent(true);
        alert('OTP sent to your email! Please check your inbox.');
      } else {
        // Verify OTP
        if (!otp) {
          alert('Please enter OTP');
          setLoading(false);
          return;
        }

        const response = await axios.post('http://localhost:5000/verify-register', {
          email: formData.email,
          otp: otp
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        alert('Registration successful! Welcome to Khopadi Movies!');
        
        // Redirect to home or login page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('OTP resent to your email!');
    } catch (error) {
      alert('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Register</h2>
        
        <form onSubmit={handleRegister}>
          {!isOtpSent ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
                minLength={6}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 mb-6 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-700 rounded text-white">
                <p className="text-sm text-gray-300">OTP sent to:</p>
                <p className="font-semibold">{formData.email}</p>
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={resendOTP}
                className="w-full mb-4 text-red-400 hover:text-red-300 text-sm underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isOtpSent ? 'Verify OTP & Register' : 'Send OTP')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">Already have an account?</p>
          <a href="/login" className="text-red-400 hover:text-red-300 font-semibold">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;