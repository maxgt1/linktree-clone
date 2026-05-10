"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Github, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login exitoso
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center px-6 pt-12 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 transform rotate-3">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">LinkFlow</h1>
          <p className="text-gray-500 mt-2 font-medium">Gestiona tu presencia digital</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
            <p className="text-gray-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg shadow-primary/10 mt-4"
            >
              <span>Entrar</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">O continúa con</span>
            </div>
          </div>

          <button className="w-full bg-white border border-gray-100 hover:border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-sm">
            <Github size={20} />
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500 font-medium">
          ¿No tienes una cuenta? {' '}
          <Link to="/" className="text-primary font-black hover:underline underline-offset-4">Regístrate gratis</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;