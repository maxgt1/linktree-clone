"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { links, profile, updateLink, addLink, deleteLink, updateProfile } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Side */}
        <div className="space-y-8">
          {/* Profile Editor */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all h-24 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Links Editor */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Enlaces</h2>
              <button 
                onClick={addLink}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors font-medium"
              >
                <Plus size={20} />
                <span>Añadir</span>
              </button>
            </div>

            <div className="space-y-4">
              {links.map((link) => (
                <motion.div 
                  key={link.id}
                  layout
                  className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-4"
                >
                  <div className="pt-2 text-gray-300 cursor-grab">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={link.title}
                      onChange={(e) => updateLink(link.id, { title: e.target.value })}
                      placeholder="Título del enlace"
                      className="w-full font-bold text-gray-800 outline-none border-b border-transparent focus:border-purple-200 pb-1"
                    />
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      placeholder="URL"
                      className="w-full text-sm text-gray-500 outline-none border-b border-transparent focus:border-purple-200 pb-1"
                    />
                  </div>
                  <div className="flex flex-col items-end space-y-4">
                    <button 
                      onClick={() => updateLink(link.id, { isActive: !link.isActive })}
                      className={`transition-colors ${link.isActive ? 'text-green-500' : 'text-gray-300'}`}
                    >
                      {link.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                    <button 
                      onClick={() => deleteLink(link.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Preview Side (Desktop only) */}
        <div className="hidden lg:block sticky top-24 h-[calc(100vh-120px)]">
          <div className="relative w-full h-full flex justify-center">
            {/* Phone Frame */}
            <div className="w-[320px] h-[640px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
              <iframe 
                src="/" 
                className="w-full h-full border-none pointer-events-none"
                title="Preview"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;