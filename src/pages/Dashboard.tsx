"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Trash2, GripVertical, ToggleLeft, ToggleRight, User as UserIcon, Link as LinkIcon, Palette, Share2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-6 lg:space-x-0 lg:space-y-8 bg-white p-4 rounded-3xl shadow-soft h-fit">
          <button onClick={() => setActiveTab('links')} className={`p-3 rounded-2xl transition-all ${activeTab === 'links' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}><LinkIcon size={24} /></button>
          <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}><UserIcon size={24} /></button>
          <button onClick={() => setActiveTab('socials')} className={`p-3 rounded-2xl transition-all ${activeTab === 'socials' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}><Share2 size={24} /></button>
          <button onClick={() => setActiveTab('appearance')} className={`p-3 rounded-2xl transition-all ${activeTab === 'appearance' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}><Palette size={24} /></button>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div key="links" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mis Enlaces</h2>
                  <button onClick={addLink} className="bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center space-x-2 transition-all">
                    <Plus size={20} /> <span>Añadir enlace</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {links.map((link) => (
                    <div key={link.id} className="bg-white p-5 rounded-[2rem] shadow-soft border border-gray-100 flex items-center space-x-4">
                      <div className="text-gray-300"><GripVertical size={20} /></div>
                      <div className="flex-1 space-y-2">
                        <input type="text" value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} className="w-full font-bold outline-none border-b border-transparent focus:border-primary/20" />
                        <input type="text" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} className="w-full text-sm text-gray-500 outline-none" />
                      </div>
                      <div className="flex flex-col items-center space-y-3">
                        <button onClick={() => updateLink(link.id, { isActive: !link.isActive })} className={`transition-colors ${link.isActive ? 'text-green-500' : 'text-gray-300'}`}>
                          {link.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                        <button onClick={() => deleteLink(link.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="bg-white p-8 rounded-[2.5rem] shadow-soft">
                <h2 className="text-2xl font-bold mb-6">Perfil</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <img src={profile.avatarUrl} className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-md" alt="Avatar" />
                    <button className="text-primary font-bold hover:underline">Cambiar foto</button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                      <input type="text" value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Biografía</label>
                      <textarea value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 h-32 outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'socials' && (
              <motion.div key="socials" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="bg-white p-8 rounded-[2.5rem] shadow-soft">
                <h2 className="text-2xl font-bold mb-6">Redes Sociales</h2>
                <div className="space-y-4">
                  {socials.map((social) => (
                    <div key={social.platform} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                      <span className="w-24 font-bold text-gray-600">{social.platform}</span>
                      <input type="text" value={social.url} onChange={(e) => updateSocial(social.platform, { url: e.target.value })} placeholder={`URL de ${social.platform}`} className="flex-1 bg-transparent outline-none text-sm" />
                      <button onClick={() => updateSocial(social.platform, { isActive: !social.isActive })} className={`transition-colors ${social.isActive ? 'text-primary' : 'text-gray-300'}`}>
                        {social.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="bg-white p-8 rounded-[2.5rem] shadow-soft">
                <h2 className="text-2xl font-bold mb-6">Temas</h2>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((t) => (
                    <button 
                      key={t.id} 
                      onClick={() => setTheme(t.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${theme === t.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className={`h-24 w-full rounded-xl mb-3 ${t.bg} border border-gray-200 flex items-center justify-center`}>
                        <div className={`w-1/2 h-4 ${t.card} rounded shadow-sm`}></div>
                      </div>
                      <span className="font-bold">{t.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Preview */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex justify-center">
            <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20"></div>
              <iframe src="/" className="w-full h-full border-none" title="Live Preview" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;