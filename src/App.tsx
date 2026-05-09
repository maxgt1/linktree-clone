"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import Navbar from './components/Navbar';
import { AppProvider, useAppContext } from '@/context/AppContext';

function AppContent() {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/u/:userId" element={<PublicProfile />} />
        <Route path="/" element={isLoggedIn ? <Index /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;