"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Profile from '@/components/Profile';
import LinkButton from '@/components/LinkButton';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

const Index = () => {
  const { links, profile, socials, theme } = useAppContext();
  const location = useLocation();
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  const themes: Record<string, string> = {
    light: 'bg-[#f8f9fa]',
    dark: 'bg-[#121212] text-white',
    sunset: 'bg-gradient-to-br from-orange-50 to-rose-100',
    ocean: 'bg-gradient-to-br from-cyan-50 to-blue-100',
  };

  const containerTheme = themes[theme] || themes.light;

  return (
    <div className={`min-h-screen ${containerTheme} transition-colors duration-500`} data-preview={isPreview}>
      {!isPreview && <Navbar />}
      
      <main className={`max-w-2xl mx-auto px-4 ${isPreview ? 'pt-8 pb-12' : 'pt-32 pb-24'}`}>
        <div className="space-y-10">
          <Profile 
            name={profile.name} 
            bio={profile.bio} 
            avatarUrl={profile.avatarUrl} 
          />

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {socials.filter(s => s.isActive && s.url).map((social) => (
              <a 
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm hover:scale-110 transition-transform"
              >
                <Share2 size={18} className="text-gray-600" />
              </a>
            ))}
          </div>

          {/* Links List */}
          <div className="space-y-4">
            {links.filter(l => l.isActive).map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LinkButton 
                  title={link.title} 
                  url={link.url} 
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>

          {profile.name && (
            <footer className="text-center pt-12">
              <p className="text-sm font-medium opacity-50">© {profile.name} — LinkClone</p>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;