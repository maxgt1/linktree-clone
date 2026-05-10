"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pb from '@/lib/pocketbase';
import { 
  Instagram, Twitter, Github, Linkedin, Youtube, Globe, ExternalLink, Share2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface PublicLink {
  id: string;
  title: string;
  url: string;
}

interface PublicProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  theme: string;
  socials: Array<{ platform: string; url: string; isActive: boolean }>;
}

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [links, setLinks] = useState<PublicLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) { setNotFound(true); setLoading(false); return; }
    const load = async () => {
      try {
        const user = await pb.collection('users').getOne(userId);
        const avatarUrl = user.avatar
          ? pb.files.getURL(user, user.avatar, { thumb: '200x200' })
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200';
        const socials = user.socials
          ? (typeof user.socials === 'string' ? JSON.parse(user.socials) : user.socials)
          : [];
        setProfile({
          name: user.name || 'Sin nombre',
          bio: user.bio || '',
          avatarUrl,
          theme: user.theme || 'light',
          socials,
        });
        const records = await pb.collection('links').getFullList({
          filter: `is_active=true && user="${userId}"`,
        });
        setLinks(records.map(r => ({
          id: r.id,
          title: r.title,
          url: r.url,
        })));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const getThemeStyles = () => {
    switch (profile?.theme) {
      case 'dark':
        return { bg: 'bg-[#121212]', text: 'text-white', card: 'bg-[#1e1e1e] border-white/10 hover:bg-[#2a2a2a]', accent: 'text-gray-400' };
      case 'sunset':
        return { bg: 'bg-gradient-to-br from-orange-50 to-rose-50', text: 'text-gray-900', card: 'bg-white/80 backdrop-blur-sm border-orange-100 hover:bg-white', accent: 'text-orange-500' };
      case 'ocean':
        return { bg: 'bg-[#e0f2f1]', text: 'text-teal-900', card: 'bg-white/80 backdrop-blur-sm border-teal-100 hover:bg-white', accent: 'text-teal-500' };
      default:
        return { bg: 'bg-[#f8f9fa]', text: 'text-gray-900', card: 'bg-white border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5', accent: 'text-gray-500' };
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'github': return <Github size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'youtube': return <Youtube size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('¡Enlace copiado!', {
      style: { borderRadius: '1rem', background: '#333', color: '#fff' },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-black text-gray-900">404</h1>
        <p className="text-gray-500">Perfil no encontrado</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all">Ir al inicio</a>
      </div>
    );
  }

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen ${themeStyles.bg} transition-colors duration-500 scrollbar-hide`}>
      <Toaster position="bottom-center" />
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; overflow-y: auto; height: 100vh; }
      `}} />
      
      <div className="max-w-xl mx-auto px-6 pt-24 pb-20">
        
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-purple-500 rounded-[2.5rem] blur opacity-20"></div>
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="relative w-28 h-28 rounded-[2.5rem] object-cover border-4 border-white shadow-xl"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-3xl font-black mb-2 ${themeStyles.text}`}
          >
            {profile.name}
          </motion.h1>
          
          {profile.bio && (
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-lg max-w-sm ${themeStyles.accent}`}
            >
              {profile.bio}
            </motion.p>
          )}
        </div>

        {profile.socials.length > 0 && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-12"
          >
            {profile.socials.filter((s: { isActive: boolean; url: string }) => s.isActive && s.url).map((social: { platform: string; url: string; isActive: boolean }) => (
              <a 
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${themeStyles.card} shadow-sm`}
              >
                <span className={themeStyles.text}>{getSocialIcon(social.platform)}</span>
              </a>
            ))}
          </motion.div>
        )}

        <div className="space-y-4">
          {links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block p-5 rounded-[2rem] border transition-all duration-300 ${themeStyles.card} shadow-sm flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Share2 size={18} />
                  </div>
                  <span className={`font-bold text-lg ${themeStyles.text}`}>{link.title}</span>
                </div>
                <ExternalLink size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <button onClick={copyUrl} className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Compartir perfil
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default PublicProfile;
