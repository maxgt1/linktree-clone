"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('¡Bienvenido de nuevo!', {
        icon: '👋',
        style: { borderRadius: '1rem', background: '#333', color: '#fff' },
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-12 pb-12 px-4 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary/20 mb-4">
            <LinkIcon className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">LinkFlow</h1>
          <p className="text-gray-500 mt-2 font-medium">Inicia sesión para gestionar tus enlaces</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={80} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Contraseña</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">
              ¿No tienes una cuenta? {' '}
              <Link to="/register" className="text-primary font-black hover:underline">Regístrate gratis</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;