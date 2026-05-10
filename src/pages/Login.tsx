"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { LogIn, UserPlus, Link as LinkIcon, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, authLoading } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('¡Bienvenido de nuevo!');
      } else {
        await register(email, password, name || email.split('@')[0]);
        toast.success('¡Cuenta creada con éxito!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error en la autenticación. Revisa tus datos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center px-4 pt-12 pb-20">
      <Toaster position="top-center" />
      
      {/* Logo Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center space-x-3 mb-10"
      >
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <LinkIcon size={26} />
        </div>
        <span className="text-2xl font-black tracking-tight text-gray-900">LinkFlow</span>
      </motion.div>

      {/* Auth Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isLogin ? '¡Hola de nuevo!' : 'Únete a nosotros'}
          </h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Nos alegra verte otra vez por aquí.' : 'Empieza a crear tu perfil hoy mismo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={authLoading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-4"
          >
            {authLoading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                {isLogin ? <LogIn size={22} /> : <UserPlus size={22} />}
                <span>{isLogin ? 'Entrar' : 'Registrarse'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 font-bold hover:text-primary transition-colors text-sm"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </motion.div>

      <div className="mt-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
        &copy; 2024 LinkFlow App
      </div>
    </div>
  );
};

export default Login;