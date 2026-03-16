import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields'); setLoading(false); return;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters'); setLoading(false); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); setLoading(false); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); setLoading(false); return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.username === formData.username)) {
        setError('Username already taken'); setLoading(false); return;
      }
      const newUser = { username: formData.username, password: formData.password, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ username: newUser.username, loginTime: new Date().toISOString() }));
      navigate('/');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background: 'var(--bg-deep)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(232,16,42,0.07) 0%, transparent 65%)' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e8102a,#ff4d2e)' }}>
              <span className="font-display text-white text-2xl">K</span>
            </div>
            <span className="font-display text-white text-3xl tracking-widest">KHOPADI</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create your account to get started</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username (min 3 chars)' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password (min 6 chars)' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <input
                  type={type} name={name} value={formData[name]} onChange={handleChange}
                  className="input-field" placeholder={placeholder}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50 mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-xl text-center text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            🔒 Stored locally on your device
          </div>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:text-red-400 transition-colors" style={{ color: 'var(--red)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
