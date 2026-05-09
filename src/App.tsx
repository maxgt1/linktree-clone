"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AppProvider } from '@/context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;