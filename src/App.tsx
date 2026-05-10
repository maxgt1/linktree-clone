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
      <Routes>
        <Route path="/u/:userId" element={<PublicProfile />} />
        {isLoggedIn ? (
          <>
            <Route path="/" element={<><Navbar /><Index /></>} />
            <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
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