"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ToggleLeft, 
  ToggleRight, 
  User as UserIcon, 
  Link as LinkIcon, 
  Palette, 
  Share2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { links, profile, socials, theme, updateLink, addLink, deleteLink, updateProfile, updateSocial, setTheme } = useAppContext();
  const [activeTab, setActiveTab] = useState('links');

  const themes = [
    { id: 'light', name: 'Original', bg: 'bg-[#f8f9fa]', card: 'bg-white' },
    { id: 'dark', name: 'Noche', bg: 'bg-[#121212]', card: 'bg-[#1e1e1e]' },
    { id: 'sunset', name: 'Atardecer', bg: 'bg-gradient-to-br from-orange-50 to-rose-50', card: 'bg-white' },
    { id: 'ocean', name: 'Océano', bg: 'bg-[#e0f2f1]', card: 'bg-white' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar - Minimalist glassmorphism style */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-6 bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit sticky top-24 z-10">
          <button 
            onClick={() => setActiveTab('links')} 
            className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'links' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <LinkIcon size={22} />
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <UserIcon size={22} />
          </button>
          <button 
            onClick={() => setActiveTab('socials')} 
            className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'socials' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Share2 size={22} />
          </button>
          <button 
            onClick={() => setActiveTab('appearance')} 
            className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'appearance' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Palette size={22} />
          </button>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div 
                key="links" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header with improved Add Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Mis Enlaces</h2>
                    <p className="text-gray-500 mt-1">Personaliza cómo te ve el mundo.</p>
                  </div>
                </div>

                {/* New Premium Add Link Card */}
                <button 
                  onClick={addLink}
                  className="group w-full relative overflow-hidden bg-white hover:bg-primary border-2 border-dashed border-gray-200 hover:border-primary p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <Plus size={28} className="text-primary group-hover:text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors">Añadir nuevo enlace</span>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={120} className="text-gray-900 group-hover:text-white" />
                  </div>
                </button>

                {/* Improved Links List */}
                <div className="space-y-4">
                  {links.map((link) => (
                    <motion.div 
                      key={link.id}
                      layout
                      className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow"
                    >
                      <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors">
                        <GripVertical size={24} />
                      </div>
                      
                      <div className="flex-1 grid gap-3">
                        <div className="relative">
                          <input 
                            type="text" 
                            value={link.title} 
                            onChange={(e) => updateLink(link.id, { title: e.target.value })} 
                            className="w-full font-bold text-lg text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-primary/20 pb-1 transition-all"
                            placeholder="Título del enlace"
                          />
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <ExternalLink size={14} />
                          <input 
                            type="text" 
                            value={link.url} 
                            onChange={(e) => updateLink(link.id, { url: e.target.value })} 
                            className="w-full text-sm bg-transparent outline-none focus:text-primary transition-colors"
                            placeholder="url.ejemplo.com/tu-link"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 border-l border-gray-50 pl-6">
                        <button 
                          onClick={() => updateLink(link.id, { isActive: !link.isActive })} 
                          className={`transition-all duration-300 ${link.isActive ? 'text-primary scale-110' : 'text-gray-200'}`}
                        >
                          {link.isActive ? <ToggleRight size={32} strokeWidth={1.5} /> : <ToggleLeft size={32} strokeWidth={1.5} />}
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)} 
                          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Other tabs remain consistent in style */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black mb-8">Perfil</h2>
                <div className="space-y-8">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="relative group">
                      <img src={profile.avatarUrl} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-gray-50 shadow-md group-hover:opacity-80 transition-opacity" alt="Avatar" />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold bg-black/20 rounded-[2.5rem]">Editar</button>
                    </div>
                    <div className="flex-1 w-full space-y-6">
                      <div>
                        <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Nombre Público</label>
                        <input type="text" value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800" />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Sobre ti</label>
                        <textarea value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 h-32 outline-none resize-none transition-all text-gray-600 leading-relaxed" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'socials' && (
              <motion.div key="socials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black mb-8">Redes Sociales</h2>
                <div className="grid gap-4">
                  {socials.map((social) => (
                    <div key={social.platform} className="flex items-center space-x-4 p-5 bg-gray-50 rounded-3xl transition-all hover:bg-gray-100 group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-sm">
                        <Share2 size={20} />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{social.platform}</span>
                        <input type="text" value={social.url} onChange={(e) => updateSocial(social.platform, { url: e.target.value })} placeholder={`Link de ${social.platform}`} className="w-full bg-transparent outline-none font-bold text-gray-700" />
                      </div>
                      <button onClick={() => updateSocial(social.platform, { isActive: !social.isActive })} className={`transition-all ${social.isActive ? 'text-primary scale-110' : 'text-gray-200'}`}>
                        {social.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black mb-8">Apariencia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {themes.map((t) => (
                    <button 
                      key={t.id} 
                      onClick={() => setTheme(t.id)}
                      className={`relative p-2 rounded-[2rem] border-2 transition-all overflow-hidden ${theme === t.id ? 'border-primary' : 'border-transparent'}`}
                    >
                      <div className={`h-32 w-full rounded-[1.5rem] mb-3 ${t.bg} border border-gray-100 flex items-center justify-center overflow-hidden relative`}>
                        <div className={`w-3/4 h-6 ${t.card} rounded-full shadow-sm`}></div>
                        {theme === t.id && (
                          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                            <Plus size={12} className="rotate-45" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 pb-2 block">{t.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Preview - More integrated look */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex flex-col items-center justify-center space-y-6">
            <div className="w-[280px] h-[580px] bg-white rounded-[3.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[10px] border-gray-900 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-100">
                <iframe src="/" className="w-full h-full border-none pointer-events-none" title="Live Preview" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Vista previa en vivo</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;