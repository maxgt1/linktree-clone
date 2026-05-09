"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import type { RecordModel } from 'pocketbase';

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
}

interface SocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

interface AppContextType {
  links: Link[];
  profile: ProfileData;
  socials: SocialLink[];
  theme: string;
  isLoggedIn: boolean;
  authLoading: boolean;
  user: RecordModel | null;
  updateLink: (id: string, updates: Partial<Link>) => void;
  addLink: () => void;
  deleteLink: (id: string) => void;
  saveData: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateSocial: (platform: string, updates: Partial<SocialLink>) => void;
  setTheme: (theme: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record);
  const [authLoading, setAuthLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const [links, setLinks] = useState<Link[]>([
    { id: '1', title: 'Mi Portafolio Web', url: 'https://example.com', isActive: true },
    { id: '2', title: 'Último Artículo del Blog', url: 'https://example.com/blog', isActive: true },
  ]);

  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex Rivera',
    bio: 'Diseñador UI/UX & Desarrollador Frontend apasionado por crear experiencias digitales hermosas.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const [socials, setSocials] = useState<SocialLink[]>([
    { platform: 'Instagram', url: '#', isActive: true },
    { platform: 'Twitter', url: '#', isActive: true },
    { platform: 'Github', url: '#', isActive: true },
  ]);

  // Cargar datos al iniciar
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const userId = pb.authStore.record?.id;
      // Aquí cargaríamos links, perfil, etc. desde las colecciones de PocketBase
      const records = await pb.collection('links').getFullList({ filter: `user = "${userId}"` });
      if (records.length > 0) {
        setLinks(records.map(r => ({
          id: r.id,
          title: r.title,
          url: r.url,
          isActive: r.is_active,
        })));
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };

  const updateLink = (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));
  };

  const addLink = () => {
    const newLink = { id: Math.random().toString(36).substr(2, 9), title: 'Nuevo Enlace', url: 'https://', isActive: true };
    setLinks([newLink, ...links]);
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const saveData = async () => {
    if (!pb.authStore.isValid) return;
    const userId = pb.authStore.record?.id;

    // Sincronizar links
    // Nota: Por simplicidad en esta demo, borramos y creamos, pero en prod se debería actualizar
    try {
      const existing = await pb.collection('links').getFullList({ filter: `user = "${userId}"` });
      for (const record of existing) {
        await pb.collection('links').delete(record.id);
      }
      for (const link of links) {
        await pb.collection('links').create({
          title: link.title,
          url: link.url,
          is_active: link.isActive,
          user: userId,
        });
      }
    } catch (e) {
      console.error("Error guardando datos:", e);
      throw e;
    }
  };

  const updateProfile = (updates: Partial<ProfileData>) => setProfile(prev => ({ ...prev, ...updates }));
  const updateSocial = (platform: string, updates: Partial<SocialLink>) => {
    setSocials(prev => prev.map(s => s.platform === platform ? { ...s, ...updates } : s));
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await pb.collection('users').authWithPassword(email, password);
      setIsLoggedIn(true);
      setUser(pb.authStore.record);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthLoading(true);
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password, name });
      await pb.collection('users').authWithPassword(email, password);
      setIsLoggedIn(true);
      setUser(pb.authStore.record);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      links, profile, socials, theme, isLoggedIn, authLoading, user,
      updateLink, addLink, deleteLink, saveData, updateProfile, updateSocial, setTheme, login, register, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};