import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="flex justify-between items-center p-4 bg-black bg-opacity-75 fixed w-full z-10">
    <h1 className="text-2xl font-bold text-red-600">MovieHub</h1>
    <div className="flex space-x-4">
      <Link to="/" className="hover:text-red-600">Home</Link>
      <Link to="/dashboard" className="hover:text-red-600">My List</Link>
      <Link to="/login" className="hover:text-red-600">Login</Link>
    </div>
  </nav>
);

export default Navbar;
