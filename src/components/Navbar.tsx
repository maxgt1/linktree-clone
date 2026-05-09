"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Eye, LogIn, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAppContext();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">LinkClone</span>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              location.pathname === '/' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Eye size={18} />
            <span className="font-medium hidden sm:inline">Vista Previa</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  location.pathname === '/dashboard' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard size={18} />
                <span className="font-medium hidden sm:inline">Admin</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`flex items-center space-x-2 px-5 py-2 rounded-full transition-all ${
                location.pathname === '/login' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-100'
              }`}
            >
              <LogIn size={18} />
              <span className="font-medium">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;