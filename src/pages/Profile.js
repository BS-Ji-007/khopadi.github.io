import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const isGuest = user.username === 'Guest';
  const loginDate = new Date(user.loginTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-5xl font-bold text-white mb-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.username}
              </h1>
              {isGuest && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  👤 Guest User
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Login Time</p>
                <p className="text-white font-semibold">🕒 {loginDate}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Account Type</p>
                <p className="text-white font-semibold">
                  {isGuest ? '👤 Guest Account' : '⭐ Registered User'}
                </p>
              </div>
            </div>

            {/* Guest Message */}
            {isGuest && (
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 mb-6">
                <p className="text-yellow-500 text-sm">
                  ⚠️ You're browsing as a guest. Create an account to save your preferences!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {isGuest ? (
                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  ✨ Create Account
                </button>
              ) : (
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">🔒 Account Security</p>
                  <p className="text-white text-sm">
                    Your account is stored locally on this device
                  </p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl mb-2">🎬</p>
              <p className="text-gray-400 text-sm">Movies</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl mb-2">📺</p>
              <p className="text-gray-400 text-sm">TV Shows</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl mb-2">✨</p>
              <p className="text-gray-400 text-sm">Anime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
