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
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateSocial: (platform: string, updates: Partial<SocialLink>) => void;
  setTheme: (theme: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RecordModel | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const fetchLinks = async () => {
    if (!pb.authStore.isValid) return;
    try {
      const records = await pb.collection('links').getFullList({ filter: `user = "${pb.authStore.record?.id}"` });
      setLinks(records.map(r => ({
        id: r.id,
        title: r.title,
        url: r.url,
        isActive: r.is_active,
      })));
    } catch {
      setLinks([]);
    }
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser(pb.authStore.record);
      setIsLoggedIn(true);
      fetchLinks();
    }
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (record) {
        setUser(record);
        setIsLoggedIn(true);
        fetchLinks();
      }
    });
    return unsubscribe;
  }, []);

  const updateLink = async (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));
    if (!pb.authStore.isValid) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};
    if ('title' in updates) data.title = updates.title;
    if ('url' in updates) data.url = updates.url;
    if ('isActive' in updates) data.is_active = updates.isActive;
    try {
      await pb.collection('links').update(id, data);
    } catch {
      fetchLinks();
    }
  };

  const addLink = async () => {
    if (!pb.authStore.isValid) return;
    try {
      const record = await pb.collection('links').create({
        title: 'Nuevo Enlace',
        url: 'https://',
        is_active: true,
        user: pb.authStore.record?.id,
      });
      const newLink: Link = {
        id: record.id,
        title: record.title,
        url: record.url,
        isActive: record.is_active,
      };
      setLinks(prev => [newLink, ...prev]);
    } catch {
      // silent
    }
  };

  const deleteLink = async (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    if (!pb.authStore.isValid) return;
    try {
      await pb.collection('links').delete(id);
    } catch {
      fetchLinks();
    }
  };

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

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSocial = (platform: string, updates: Partial<SocialLink>) => {
    setSocials(prev => prev.map(social => social.platform === platform ? { ...social, ...updates } : social));
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await pb.collection('users').authWithPassword(email, password);
      setUser(pb.authStore.record);
      setIsLoggedIn(true);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthLoading(true);
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password, name });
      await pb.collection('users').authWithPassword(email, password);
      setUser(pb.authStore.record);
      setIsLoggedIn(true);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setUser(null);
    setIsLoggedIn(false);
    setLinks([
      { id: '1', title: 'Mi Portafolio Web', url: 'https://example.com', isActive: true },
      { id: '2', title: 'Último Artículo del Blog', url: 'https://example.com/blog', isActive: true },
    ]);
  };

  return (
    <AppContext.Provider value={{ 
      links, 
      profile, 
      socials,
      theme,
      isLoggedIn,
      authLoading,
      user,
      updateLink, 
      addLink, 
      deleteLink, 
      updateProfile,
      updateSocial,
      setTheme,
      login,
      register,
      logout
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