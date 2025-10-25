import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!isOtpSent) {
        // Request OTP
        await axios.post('http://localhost:5000/request-otp', { email });
        setIsOtpSent(true);
        alert('OTP sent to your email!');
      } else {
        // Verify OTP and login
        const res = await axios.post('http://localhost:5000/login', { email, password, otp });
        localStorage.setItem('token', res.data.token);
        alert('Logged in!');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
        />
        {!isOtpSent && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
          />
        )}
        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
          />
        )}
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white">
          {isOtpSent ? 'Verify OTP' : 'Request OTP'}
        </button>
      </form>
    </div>
  );
};

export default Login;