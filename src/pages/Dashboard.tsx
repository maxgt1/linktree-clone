"use client";

import React, { useState, useRef } from 'react';
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
  Sparkles,
  Save,
  Loader2,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const { links, profile, socials, theme, updateLink, addLink, deleteLink, updateProfile, updateSocial, setTheme, saveLinks, saving, setAvatarFile } = useAppContext();
  const [activeTab, setActiveTab] = useState('links');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const themes = [
    { id: 'light', name: 'Original', bg: 'bg-[#f8f9fa]', card: 'bg-white' },
    { id: 'dark', name: 'Noche', bg: 'bg-[#121212]', card: 'bg-[#1e1e1e]' },
    { id: 'sunset', name: 'Atardecer', bg: 'bg-gradient-to-br from-orange-50 to-rose-50', card: 'bg-white' },
    { id: 'ocean', name: 'Océano', bg: 'bg-[#e0f2f1]', card: 'bg-white' },
  ];

  const handleSave = async () => {
    try {
      await saveLinks();
      toast.success('¡Cambios guardados con éxito!', {
        style: { borderRadius: '1rem', background: '#333', color: '#fff' },
      });
    } catch {
      toast.error('Error al guardar.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-40 px-4 md:px-8">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-2 lg:space-x-0 lg:space-y-6 bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24 z-10">
          <button onClick={() => setActiveTab('links')} className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${activeTab === 'links' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 md:scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><LinkIcon size={20} /></button>
          <button onClick={() => setActiveTab('profile')} className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 md:scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><UserIcon size={20} /></button>
          <button onClick={() => setActiveTab('socials')} className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${activeTab === 'socials' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 md:scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><Share2 size={20} /></button>
          <button onClick={() => setActiveTab('appearance')} className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${activeTab === 'appearance' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 md:scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><Palette size={20} /></button>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Mis Enlaces</h2>
                  <p className="text-gray-500 mt-1">Personaliza tus accesos directos.</p>
                </div>

                <button onClick={addLink} className="group w-full relative overflow-hidden bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary p-6 md:p-8 rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transition-colors"><Plus size={24} className="text-primary" /></div>
                  <span className="text-base font-bold text-gray-700">Añadir nuevo enlace</span>
                </button>

                <div className="space-y-4">
                  {links.map((link) => (
                    <motion.div 
                      key={link.id} 
                      layout 
                      className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 group transition-all hover:shadow-md hover:border-primary/10"
                    >
                      <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <input 
                          type="text" 
                          value={link.title} 
                          onChange={(e) => updateLink(link.id, { title: e.target.value })} 
                          className="w-full font-bold text-base md:text-lg text-gray-800 bg-transparent outline-none focus:text-primary transition-colors truncate" 
                          placeholder="Título del enlace" 
                        />
                        <div className="flex items-center space-x-2 text-gray-400">
                          <LinkIcon size={12} className="shrink-0" />
                          <input 
                            type="text" 
                            value={link.url} 
                            onChange={(e) => updateLink(link.id, { url: e.target.value })} 
                            className="w-full text-xs md:text-sm bg-transparent outline-none hover:text-gray-600 focus:text-primary transition-colors truncate" 
                            placeholder="URL" 
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-4 pl-2 md:pl-4 border-l border-gray-50">
                        <button 
                          onClick={() => updateLink(link.id, { isActive: !link.isActive })} 
                          className={`transition-all ${link.isActive ? 'text-primary scale-105' : 'text-gray-200 hover:text-gray-300'}`}
                        >
                          {link.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)} 
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-black mb-8">Perfil</h2>
                <div className="space-y-8">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img src={avatarPreview || profile.avatarUrl} className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] object-cover border-4 border-gray-50 shadow-md" alt="Avatar" />
                      <div className="absolute inset-0 bg-black/40 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="flex-1 w-full space-y-6">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                        <input type="text" value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Biografía</label>
                        <textarea value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 h-28 md:h-32 outline-none resize-none transition-all text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Socials Tab */}
            {activeTab === 'socials' && (
              <motion.div key="socials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-black mb-8">Redes Sociales</h2>
                <div className="grid gap-3 md:gap-4">
                  {socials.map((social) => (
                    <div key={social.platform} className="flex items-center space-x-3 md:space-x-4 p-4 md:p-5 bg-gray-50 rounded-2xl md:rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 shadow-sm shrink-0"><Share2 size={18} /></div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{social.platform}</span>
                        <input type="text" value={social.url} onChange={(e) => updateSocial(social.platform, { url: e.target.value })} placeholder={`URL de ${social.platform}`} className="w-full bg-transparent outline-none font-bold text-gray-700 text-sm md:text-base truncate" />
                      </div>
                      <button onClick={() => updateSocial(social.platform, { isActive: !social.isActive })} className={`transition-all shrink-0 ${social.isActive ? 'text-primary' : 'text-gray-200 hover:text-gray-300'}`}>
                        {social.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-black mb-8">Apariencia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {themes.map((t) => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={`relative p-2 rounded-[1.8rem] border-2 transition-all ${theme === t.id ? 'border-primary bg-primary/5' : 'border-transparent bg-gray-50/50 hover:bg-gray-50'}`}>
                      <div className={`h-24 md:h-32 w-full rounded-[1.2rem] md:rounded-[1.5rem] mb-3 ${t.bg} border border-gray-100 flex items-center justify-center`}>
                        <div className={`w-3/4 h-5 md:h-6 ${t.card} rounded-full shadow-sm`}></div>
                      </div>
                      <span className="font-bold text-gray-900 pb-2 block text-sm md:text-base">{t.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mockup Móvil */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex flex-col items-center justify-center">
            <div className="relative w-[280px] h-[580px] bg-[#0a0a0a] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden" style={{ isolation: 'isolate' }}>
              <div className="absolute inset-[8px] rounded-[2.8rem] bg-white overflow-hidden" 
                   style={{ 
                     maskImage: '-webkit-radial-gradient(white, black)',
                     WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                   }}>
                <div className="w-full h-full relative overflow-hidden bg-white">
                  <iframe 
                    src="/?preview=true" 
                    className="absolute inset-0 w-[166.6%] h-[166.6%] border-none select-none pointer-events-none" 
                    style={{ 
                      transform: 'scale(0.6)', 
                      transformOrigin: 'top left',
                    }}
                    title="Live Preview" 
                  />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] rounded-[2.8rem]"></div>
                </div>
              </div>
              <div className="absolute inset-0 border-[8px] border-[#0a0a0a] rounded-[3.5rem] pointer-events-none z-20"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a0a] rounded-b-[1.2rem] z-30 flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#1a1a1a]"></div>
                <div className="w-8 h-1 rounded-full bg-[#1a1a1a]"></div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-lg border border-gray-100">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Vista previa activa</span>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Save Bar - REDISEÑADA Y RESPONSIVA */}
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-100 p-2 md:p-3 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center justify-between w-full max-w-sm md:max-w-md gap-4">
          <div className="flex items-center space-x-3 ml-2 md:ml-4 shrink-0">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs md:text-sm font-bold text-gray-500 whitespace-nowrap">
              {saving ? 'Guardando...' : 'Cambios listos'}
            </span>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black flex items-center justify-center space-x-2 transition-all active:scale-95 shrink-0 min-w-[100px]"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} className="hidden md:block" /><span>Guardar</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;