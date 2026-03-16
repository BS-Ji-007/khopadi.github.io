import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
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
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ username: user.username, loginTime: new Date().toISOString() }));
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'Guest', loginTime: new Date().toISOString() }));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background: 'var(--bg-deep)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,16,42,0.08) 0%, transparent 65%)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e8102a,#ff4d2e)' }}>
              <span className="font-display text-white text-2xl">K</span>
            </div>
            <span className="font-display text-white text-3xl tracking-widest">KHOPADI</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Welcome back — sign in to continue</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
              <input
                type="text" name="username" value={formData.username} onChange={handleChange}
                className="input-field" placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange}
                className="input-field" placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50 mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>OR</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            👤 Continue as Guest
          </button>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link to="/register" className="font-semibold hover:text-red-400 transition-colors" style={{ color: 'var(--red)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
