"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  updateLink: (id: string, updates: Partial<Link>) => void;
  addLink: () => void;
  deleteLink: (id: string) => void;
  saveLinks: () => Promise<void>;
  saving: boolean;
  dirty: boolean;
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
  const [theme, setThemeState] = useState('light');

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

  const loadUserData = () => {
    const record = pb.authStore.record;
    if (!record) return;
    setUser(record);
    setIsLoggedIn(true);
    const avatar = record.avatar
      ? pb.files.getURL(record, record.avatar, { thumb: '200x200' })
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200';
    setProfile({
      name: record.name || 'Sin nombre',
      bio: record.bio || '',
      avatarUrl: avatar,
    });
    setThemeState(record.theme || 'light');
    if (record.socials) {
      try {
        const parsed = typeof record.socials === 'string' ? JSON.parse(record.socials) : record.socials;
        setSocials(parsed);
      } catch {}
    }
    fetchLinks();
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      loadUserData();
    }
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (record) {
        loadUserData();
      }
    });
    return unsubscribe;
  }, []);

  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [avatarFile, setAvatarFileState] = useState<File | null>(null);
  const [dirty, setDirty] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const dirtyGen = useRef(0);

  const markDirty = () => {
    dirtyGen.current++;
    setDirty(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const gen = dirtyGen.current;
    debounceTimer.current = setTimeout(async () => {
      try {
        await saveLinks();
      } catch {}
      if (dirtyGen.current === gen) setDirty(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const setAvatarFile = (file: File | null) => {
    setAvatarFileState(file);
    if (file) markDirty();
  };

  const updateLink = (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));
    markDirty();
  };

  const addLink = () => {
    const newLink: Link = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nuevo Enlace',
      url: 'https://ejemplo.com',
      isActive: true,
    };
    setLinks(prev => [newLink, ...prev]);
    markDirty();
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    markDirty();
  };

  const saveLinks = async () => {
    if (!pb.authStore.isValid || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const userId = pb.authStore.record?.id;
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
      await fetchLinks();
      const userData: Record<string, any> = {
        name: profile.name,
        bio: profile.bio,
        theme: theme,
        socials: JSON.stringify(socials),
      };
      if (avatarFile) {
        userData.avatar = avatarFile;
      }
      const updated = await pb.collection('users').update(userId, userData);
      setAvatarFile(null);
      setProfile(prev => ({
        ...prev,
        avatarUrl: updated.avatar
          ? pb.files.getURL(updated, updated.avatar, { thumb: '200x200' })
          : prev.avatarUrl,
      }));
    } catch (e) {
      console.error('Failed to save:', e);
      throw e;
    } finally {
      savingRef.current = false;
      setSaving(false);
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
    markDirty();
  };

  const updateSocial = (platform: string, updates: Partial<SocialLink>) => {
    setSocials(prev => prev.map(social => social.platform === platform ? { ...social, ...updates } : social));
    markDirty();
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

  const setTheme = (t: string) => {
    setThemeState(t);
    markDirty();
  };

  const logout = async () => {
    pb.authStore.clear();
    setUser(null);
    setIsLoggedIn(false);
    setThemeState('light');
    setProfile({
      name: 'Alex Rivera',
      bio: 'Diseñador UI/UX & Desarrollador Frontend apasionado por crear experiencias digitales hermosas.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
    });
    setSocials([
      { platform: 'Instagram', url: '#', isActive: true },
      { platform: 'Twitter', url: '#', isActive: true },
      { platform: 'Github', url: '#', isActive: true },
    ]);
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
      saving,
      dirty,
      user,
      avatarFile,
      setAvatarFile,
      updateLink, 
      addLink, 
      deleteLink, 
      saveLinks,
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