"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Eye } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">LinkClone</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              location.pathname === '/dashboard' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Admin</span>
          </Link>
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              location.pathname === '/' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Eye size={20} />
            <span className="font-medium">Vista Previa</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;