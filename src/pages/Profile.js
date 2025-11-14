import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('You are not logged in.');
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="pt-24 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="pt-24 container mx-auto px-6">
      {user && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <h2 className="text-3xl mb-6 text-center text-white font-bold">Profile</h2>
          <div className="text-white">
            <p className="mb-4">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
