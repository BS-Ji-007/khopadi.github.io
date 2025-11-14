import React, { useState } from 'react';
import { register, verifyRegister } from '../utils/auth';

const Register = () => {
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
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">Failed to edit, 0 occurrences found for old_string (import React, { useState } from 'react';
import { hash, getUsers, setUsers, generateOTP } from '../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return alert('Fill all fields');
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');

    const users = getUsers();
    if (.find(u => u.email === formData.email)) return alert('User already exists');

    const code = generateOTP();
    setOtpCode(code);
    setOtpSent(true);
    alert(`Demo OTP (no email sent): ${code}`);
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (otpInput !== otpCode) return alert('Invalid OTP');

    const users = getUsers();
    const passwordHash = await hash(formData.password);
    users.push({ id: Date.now(), name: formData.name, email: formData.email, passwordHash, createdAt: new Date().toISOString() });
    setUsers(users);

    alert('Registered successfully (demo)');
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Register</h2>
        <form onSubmit={otpSent ? verifyAndRegister : sendOtp}>
          {!otpSent ? (
            <>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={onChange} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white">Send OTP</button>
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-700 rounded text-white">
                <p className="text-sm text-gray-300">Demo OTP shown via alert.</p>
                <p className="text-xs text-gray-400">Enter the 6-digit code to verify.</p>
              </div>
              <input type="text" placeholder="Enter 6-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={6} className="w-full p-3 mb-4 bg-gray-700 rounded text-white text-center tracking-widest" />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold text-white">Verify & Register</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
). Original old_string was (import React, { useState } from 'react';
import { hash, getUsers, setUsers, generateOTP } from '../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return alert('Fill all fields');
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');

    const users = getUsers();
    if (.find(u => u.email === formData.email)) return alert('User already exists');

    const code = generateOTP();
    setOtpCode(code);
    setOtpSent(true);
    alert(`Demo OTP (no email sent): ${code}`);
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (otpInput !== otpCode) return alert('Invalid OTP');

    const users = getUsers();
    const passwordHash = await hash(formData.password);
    users.push({ id: Date.now(), name: formData.name, email: formData.email, passwordHash, createdAt: new Date().toISOString() });
    setUsers(users);

    alert('Registered successfully (demo)');
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Register</h2>
        <form onSubmit={otpSent ? verifyAndRegister : sendOtp}>
          {!otpSent ? (
            <>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={onChange} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white">Send OTP</button>
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-700 rounded text-white">
                <p className="text-sm text-gray-300">Demo OTP shown via alert.</p>
                <p className="text-xs text-gray-400">Enter the 6-digit code to verify.</p>
              </div>
              <input type="text" placeholder="Enter 6-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={6} className="w-full p-3 mb-4 bg-gray-700 rounded text-white text-center tracking-widest" />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold text-white">Verify & Register</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
)" />}
        <form onSubmit={otpSent ? handleVerifyAndRegister : handleSendOtp}>
          {!otpSent ? (
            <>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={onChange} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold text-white disabled:opacity-50">
                {loading ? 'Loading...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-700 rounded text-white">
                <p className="text-sm text-gray-300">An OTP has been sent to your email.</p>
                <p className="text-xs text-gray-400">Enter the 6-digit code to verify.</p>
              </div>
              <input type="text" placeholder="Enter 6-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={6} className="w-full p-3 mb-4 bg-gray-700 rounded text-white text-center tracking-widest" />
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold text-white disabled:opacity-50">
                {loading ? 'Loading...' : 'Verify & Register'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
