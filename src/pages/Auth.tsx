"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Lock, User, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de auth
    setTimeout(() => {
      setLoading(false);
      toast.success(isLogin ? '¡Bienvenido de nuevo!' : '¡Cuenta creada con éxito!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center pt-12 lg:pt-20 px-4">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">LinkFlow</span>
        </div>

        {/* Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              {isLogin ? 'Hola de nuevo' : 'Crea tu cuenta'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Tus enlaces te están esperando' : 'Empieza a compartir hoy mismo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isLogin ? 'Entrar' : 'Registrarse'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-sm font-bold hover:text-primary transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;