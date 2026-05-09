"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AppProvider, useAppContext } from '@/context/AppContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
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