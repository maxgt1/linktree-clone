"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbase';

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface Social {
  platform: string;
  url: string;
  isActive: boolean;
}

interface Profile {
  name: string;
  bio: string;
  avatarUrl: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppContextType {
  links: Link[];
  profile: Profile;
  socials: Social[];
  theme: string;
  saving: boolean;
  dirty: boolean;
  user: User | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  addLink: () => void;
  updateLink: (id: string, data: Partial<Link>) => void;
  deleteLink: (id: string) => void;
  updateProfile: (data: Partial<Profile>) => void;
  updateSocial: (platform: string, data: Partial<Social>) => void;
  setTheme: (theme: string) => void;
  saveLinks: () => Promise<void>;
  setAvatarFile: (file: File) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
  });
  const [socials, setSocials] = useState<Social[]>([
    { platform: 'Instagram', url: '', isActive: false },
    { platform: 'Twitter', url: '', isActive: false },
    { platform: 'Github', url: '', isActive: false },
    { platform: 'Linkedin', url: '', isActive: false }
  ]);

  const [theme, setTheme] = useState('light');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Sincronizar estado inicial con PocketBase
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model as unknown as User);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setAuthLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, pass);
      setUser(authData.record as unknown as User);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setAuthLoading(true);
    try {
      await pb.collection('users').create({
        email,
        password: pass,
        passwordConfirm: pass,
        name,
      });
      await login(email, pass);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const addLink = () => {
    const newLink: Link = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      url: '',
      isActive: true
    };
    setLinks([...links, newLink]);
    setDirty(true);
  };

  const updateLink = (id: string, data: Partial<Link>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...data } : l));
    setDirty(true);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    setDirty(true);
  };

  const updateProfile = (data: Partial<Profile>) => {
    setProfile({ ...profile, ...data });
    setDirty(true);
  };

  const updateSocial = (platform: string, data: Partial<Social>) => {
    setSocials(socials.map(s => s.platform === platform ? { ...s, ...data } : s));
    setDirty(true);
  };

  const saveLinks = async () => {
    setSaving(true);
    try {
      // Aquí iría la lógica de persistencia real con PocketBase descrita en AGENTS.md
      await new Promise(resolve => setTimeout(resolve, 800));
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppContext.Provider value={{
      links,
      profile,
      socials,
      theme,
      saving,
      dirty,
      user,
      isLoggedIn: !!user,
      authLoading,
      addLink,
      updateLink,
      deleteLink,
      updateProfile,
      updateSocial,
      setTheme,
      saveLinks,
      setAvatarFile,
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
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};