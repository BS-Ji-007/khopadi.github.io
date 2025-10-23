import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="flex justify-between items-center p-4 bg-black bg-opacity-75 fixed w-full z-10 shadow-lg">
    <h1 className="text-3xl font-bold text-red-600">Khopadi Movies</h1> {/* Customize with your name */}
    <div className="flex space-x-6">
      <Link to="/" className="hover:text-red-600 transition">Home</Link>
      <Link to="/login" className="hover:text-red-600 transition">Login</Link>
      <input type="text" placeholder="Search..." className="bg-gray-800 p-2 rounded" />
    </div>
  </nav>
);

export default Navbar;