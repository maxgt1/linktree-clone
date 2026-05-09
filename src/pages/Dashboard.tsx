"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Plus, Trash2, GripVertical, ToggleLeft, ToggleRight, 
  User as UserIcon, Link as LinkIcon, Palette, Share2,
  ExternalLink, Sparkles, Save, CheckCircle2, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { links, profile, socials, theme, updateLink, addLink, deleteLink, updateProfile, updateSocial, setTheme, saveData } = useAppContext();
  const [activeTab, setActiveTab] = useState('links');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData();
      setHasUnsavedChanges(false);
      toast.success('¡Sincronizado con PocketBase!', {
        style: { borderRadius: '1rem', background: '#333', color: '#fff' },
      });
    } catch (error) {
      toast.error('Error al guardar en el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdate = (fn: Function) => (...args: any[]) => {
    fn(...args);
    setHasUnsavedChanges(true);
  };

  const themes = [
    { id: 'light', name: 'Original', bg: 'bg-[#f8f9fa]', card: 'bg-white' },
    { id: 'dark', name: 'Noche', bg: 'bg-[#121212]', card: 'bg-[#1e1e1e]' },
    { id: 'sunset', name: 'Atardecer', bg: 'bg-gradient-to-br from-orange-50 to-rose-50', card: 'bg-white' },
    { id: 'ocean', name: 'Océano', bg: 'bg-[#e0f2f1]', card: 'bg-white' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-32 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-6 bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit sticky top-24 z-10">
          <button onClick={() => setActiveTab('links')} className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'links' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}><LinkIcon size={22} /></button>
          <button onClick={() => setActiveTab('profile')} className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}><UserIcon size={22} /></button>
          <button onClick={() => setActiveTab('socials')} className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'socials' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}><Share2 size={22} /></button>
          <button onClick={() => setActiveTab('appearance')} className={`p-4 rounded-3xl transition-all duration-300 ${activeTab === 'appearance' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}><Palette size={22} /></button>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Mis Enlaces</h2>
                    <p className="text-gray-500 mt-1">Configuración guardada en la nube.</p>
                  </div>
                </div>

                <button onClick={onUpdate(addLink)} className="group w-full relative overflow-hidden bg-white hover:bg-primary border-2 border-dashed border-gray-200 hover:border-primary p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Plus size={28} className="text-primary group-hover:text-white" /></div>
                  <span className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors">Añadir nuevo enlace</span>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} className="text-gray-900 group-hover:text-white" /></div>
                </button>

                <div className="space-y-4">
                  {links.map((link) => (
                    <motion.div key={link.id} layout className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group">
                      <div className="text-gray-300 cursor-grab"><GripVertical size={24} /></div>
                      <div className="flex-1 grid gap-3">
                        <input type="text" value={link.title} onChange={(e) => onUpdate(updateLink)(link.id, { title: e.target.value })} className="w-full font-bold text-lg text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-primary/20 pb-1" placeholder="Título del enlace" />
                        <div className="flex items-center space-x-2 text-gray-400">
                          <ExternalLink size={14} />
                          <input type="text" value={link.url} onChange={(e) => onUpdate(updateLink)(link.id, { url: e.target.value })} className="w-full text-sm bg-transparent outline-none focus:text-primary transition-colors" placeholder="URL" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 border-l border-gray-50 pl-6">
                        <button onClick={() => onUpdate(updateLink)(link.id, { isActive: !link.isActive })} className={`transition-all duration-300 ${link.isActive ? 'text-primary' : 'text-gray-200'}`}><ToggleRight size={32} /></button>
                        <button onClick={() => onUpdate(deleteLink)(link.id)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Los demás tabs (perfil, socials, appearance) se mantienen iguales, 
                pero llamando a onUpdate(...) para activar el botón de guardar */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black mb-8">Perfil</h2>
                <div className="space-y-8">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <img src={profile.avatarUrl} className="w-32 h-32 rounded-[2.5rem] object-cover" alt="Avatar" />
                    <div className="flex-1 w-full space-y-6">
                      <input type="text" value={profile.name} onChange={(e) => onUpdate(updateProfile)({ name: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
                      <textarea value={profile.bio} onChange={(e) => onUpdate(updateProfile)({ bio: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl h-32 outline-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Preview */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex flex-col items-center justify-center">
            <div className="w-[280px] h-[580px] bg-white rounded-[3.5rem] p-3 shadow-2xl border-[10px] border-gray-900 relative">
              <iframe src="/" className="w-full h-full rounded-[2.5rem]" title="Preview" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
            <div className="bg-gray-900 text-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-between">
              <div className="ml-4"><p className="font-bold text-sm">Cambios pendientes</p></div>
              <button onClick={handleSave} disabled={isSaving} className="bg-primary px-8 py-3 rounded-2xl font-bold flex items-center space-x-2">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                <span>{isSaving ? 'Guardando...' : 'Guardar en DB'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;