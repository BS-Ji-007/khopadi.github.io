import React, { useState } from 'react';
import { hash, getUsers, setSession, generateOTP } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const requestOtp = async (e) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return alert('User not found');

    const pwdHash = await hash(password);
    if (pwdHash !== user.passwordHash) return alert('Invalid password');

    const code = generateOTP();
    setOtpCode(code);
    setOtpSent(true);
    alert(`Demo OTP (no email sent): ${code}`);
  };

  const verifyAndLogin = (e) => {
    e.preventDefault();
    if (otpInput !== otpCode) return alert('Invalid OTP');

    setSession({ email, loginAt: new Date().toISOString() });
    alert('Logged in (demo)');
    window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={otpSent ? verifyAndLogin : requestOtp} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
        {!otpSent && (
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
        )}
        {otpSent && (
          <input type="text" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
        )}
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white">
          {otpSent ? 'Verify OTP' : 'Request OTP'}
        </button>
      </form>
    </div>
  );
};

export default Login;
