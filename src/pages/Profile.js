import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) { navigate('/login'); return; }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
    </div>
  );

  const isGuest = user.username === 'Guest';
  const loginDate = new Date(user.loginTime).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen pt-24 pb-10" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-2xl mx-auto px-4">

        {/* Avatar + name */}
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 font-display text-4xl text-white"
            style={{ background: 'linear-gradient(135deg,#e8102a,#b30d20)', boxShadow: '0 8px 32px rgba(232,16,42,0.35)' }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide">{user.username}</h1>
          <span className="text-sm mt-1 inline-block" style={{ color: 'var(--text-secondary)' }}>
            {isGuest ? '👤 Guest User' : '⭐ Registered User'}
          </span>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Session started</span>
            <span className="text-sm font-semibold text-white">{loginDate}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Account type</span>
            <span className="text-sm font-semibold text-white">{isGuest ? 'Guest' : 'Registered'}</span>
          </div>
        </div>

        {/* Guest CTA */}
        {isGuest && (
          <div className="px-5 py-4 rounded-xl mb-6 text-sm" style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.25)', color: '#fbbf24' }}>
            ⚠️ You're browsing as guest. Create an account to save your preferences!
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['🎬', 'Movies', '/movies'], ['📺', 'TV Shows', '/tv-shows'], ['✨', 'Anime', '/anime']].map(([icon, label, path]) => (
            <Link key={path} to={path}
              className="flex flex-col items-center py-4 rounded-xl transition-all hover:scale-105"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isGuest && (
            <button onClick={() => navigate('/register')} className="btn-primary w-full text-center">
              ✨ Create Account
            </button>
          )}
          <button onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            🏠 Back to Home
          </button>
          <button onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:bg-red-500/10"
            style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
