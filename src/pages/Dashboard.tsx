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
  Camera,
  Eye
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
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-32 px-4">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-6 bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit sticky top-24 z-10">
          <button onClick={() => setActiveTab('links')} className={`p-4 rounded-3xl transition-all ${activeTab === 'links' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><LinkIcon size={22} /></button>
          <button onClick={() => setActiveTab('profile')} className={`p-4 rounded-3xl transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><UserIcon size={22} /></button>
          <button onClick={() => setActiveTab('socials')} className={`p-4 rounded-3xl transition-all ${activeTab === 'socials' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><Share2 size={22} /></button>
          <button onClick={() => setActiveTab('appearance')} className={`p-4 rounded-3xl transition-all ${activeTab === 'appearance' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}><Palette size={22} /></button>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Mis Enlaces</h2>
                  <p className="text-gray-500 mt-1">Crea y organiza tus accesos directos.</p>
                </div>

                <button onClick={addLink} className="group w-full relative overflow-hidden bg-white hover:bg-primary border-2 border-dashed border-gray-200 hover:border-primary p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Plus size={28} className="text-primary group-hover:text-white" /></div>
                  <span className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors">Añadir nuevo enlace</span>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} className="text-gray-900 group-hover:text-white" /></div>
                </button>

                <div className="space-y-4">
                  {links.map((link) => (
                    <motion.div key={link.id} layout className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
                      <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors"><GripVertical size={24} /></div>
                      <div className="flex-1 grid gap-3">
                        <input type="text" value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} className="w-full font-bold text-lg text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-primary/20 pb-1 transition-all" placeholder="Título" />
                        <div className="flex items-center space-x-2 text-gray-400">
                          <ExternalLink size={14} />
                          <input type="text" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} className="w-full text-sm bg-transparent outline-none focus:text-primary transition-colors" placeholder="URL" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 border-l border-gray-50 pl-6">
                        <button onClick={() => updateLink(link.id, { isActive: !link.isActive })} className={`transition-all ${link.isActive ? 'text-primary scale-110' : 'text-gray-200'}`}>
                          {link.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                        <button onClick={() => deleteLink(link.id)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black mb-8">Perfil</h2>
                <div className="space-y-8">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img src={avatarPreview || profile.avatarUrl} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-gray-50 shadow-md" alt="Avatar" />
                      <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent">
                        <Camera size={28} className="text-white" />
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="flex-1 w-full space-y-6">
                      <div>
                        <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Nombre</label>
                        <input type="text" value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-800" />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Bio</label>
                        <textarea value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 h-32 outline-none resize-none transition-all text-gray-600" />
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
                    <div key={social.platform} className="flex items-center space-x-4 p-5 bg-gray-50 rounded-3xl">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm"><Share2 size={20} /></div>
                      <div className="flex-1">
                        <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{social.platform}</span>
                        <input type="text" value={social.url} onChange={(e) => updateSocial(social.platform, { url: e.target.value })} placeholder="URL" className="w-full bg-transparent outline-none font-bold text-gray-700" />
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
                <div className="grid grid-cols-2 gap-6">
                  {themes.map((t) => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={`relative p-2 rounded-[2rem] border-2 transition-all ${theme === t.id ? 'border-primary' : 'border-transparent'}`}>
                      <div className={`h-32 w-full rounded-[1.5rem] mb-3 ${t.bg} border border-gray-100 flex items-center justify-center`}>
                        <div className={`w-3/4 h-6 ${t.card} rounded-full shadow-sm`}></div>
                      </div>
                      <span className="font-bold text-gray-900 pb-2 block">{t.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mockup Móvil - Perfeccionado */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex flex-col items-center justify-center">
            
            {/* Contenedor del teléfono con bordes reales */}
            <div className="relative w-[310px] h-[630px] p-[10px] bg-[#1a1a1a] rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/10 overflow-hidden">
              
              {/* Reflejos del marco */}
              <div className="absolute inset-0 rounded-[3.5rem] border-[4px] border-[#333] z-50 pointer-events-none"></div>
              
              {/* Pantalla / Máscara con overflow-hidden real */}
              <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-white relative z-0">
                {/* Iframe con escala para ajustar el zoom */}
                <iframe 
                  src="/?preview=true" 
                  className="w-full h-full border-none select-none pointer-events-none no-scrollbar origin-top" 
                  style={{ transform: 'scale(1)', height: '100%', width: '100%' }}
                  title="Live Preview" 
                />
              </div>

              {/* Notch superior - Siempre encima */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#1a1a1a] rounded-b-[2rem] z-[60]">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full"></div>
              </div>
              
              {/* Botones laterales físicos (detalles visuales) */}
              <div className="absolute -left-[2px] top-28 w-[4px] h-12 bg-[#222] rounded-r-md z-50"></div>
              <div className="absolute -right-[2px] top-28 w-[4px] h-20 bg-[#222] rounded-l-md z-50"></div>
            </div>
            
            <p className="mt-8 text-sm font-bold text-gray-400 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Eye size={14} className="text-primary" /> Vista previa en tiempo real
            </p>
          </div>
        </div>

      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 ml-4">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-bold text-gray-500">
              {saving ? 'Guardando...' : 'Cambios listos'}
            </span>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 transition-all active:scale-95">
            {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /><span>Guardar</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;