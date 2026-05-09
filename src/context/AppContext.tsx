"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface AppContextType {
  links: Link[];
  profile: ProfileData;
  updateLink: (id: string, updates: Partial<Link>) => void;
  addLink: () => void;
  deleteLink: (id: string) => void;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<Link[]>([
    { id: '1', title: 'Mi Portafolio Web', url: 'https://example.com', isActive: true },
    { id: '2', title: 'Último Artículo del Blog', url: 'https://example.com/blog', isActive: true },
    { id: '3', title: 'Asesorías 1 a 1', url: 'https://example.com/booking', isActive: true },
  ]);

  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex Rivera',
    bio: 'Diseñador UI/UX & Desarrollador Frontend apasionado por crear experiencias digitales hermosas.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const updateLink = (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));
  };

  const addLink = () => {
    const newLink = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nuevo Enlace',
      url: 'https://',
      isActive: true
    };
    setLinks([newLink, ...links]);
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ links, profile, updateLink, addLink, deleteLink, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};