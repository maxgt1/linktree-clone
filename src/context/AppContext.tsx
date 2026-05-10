"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbase';
import type { RecordModel } from 'pocketbase';

interface Link {
  id: string;
  pbId: string | null;
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
  saving: boolean;
  user: RecordModel | null;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  updateLink: (id: string, updates: Partial<Link>) => void;
  commitLink: (id: string) => void;
  addLink: (title: string, url: string) => void;
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
  const [theme, setThemeState] = useState('light');

  const fetchLinks = async () => {
    if (!pb.authStore.isValid) return;
    try {
      const records = await pb.collection('links').getFullList({ filter: `user = "${pb.authStore.record?.id}"` });
      setLinks(records.map(r => ({
        id: r.id,
        pbId: r.id,
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
      } catch {
        // ignore parse errors
      }
    }
    fetchLinks();
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      loadUserData();
    }
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      if (record) {
        loadUserData();
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [avatarFile, setAvatarFileState] = useState<File | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingDuringSaveRef = useRef(false);
  const debounceDelayRef = useRef(1500);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const deletedPbIdsRef = useRef<string[]>([]);

  const markDirty = (inmediato = false) => {
    if (savingRef.current) {
      pendingDuringSaveRef.current = true;
      return;
    }
    debounceDelayRef.current = inmediato ? 100 : 1500;
    setSaveTrigger(v => v + 1);
  };

  const setAvatarFile = (file: File | null) => {
    setAvatarFileState(file);
    if (file) markDirty(true);
  };

  const performSave = async (): Promise<boolean> => {
    if (!pb.authStore.isValid) return false;
    try {
      const userId = pb.authStore.record?.id;

      // 1. Delete removed links
      const toDelete = [...deletedPbIdsRef.current];
      deletedPbIdsRef.current = [];
      for (const pbId of toDelete) {
        try { await pb.collection('links').delete(pbId); } catch { /* already gone */ }
      }

      // 2. Create new + update existing
      const updatedLinks: Link[] = [];
      for (const link of links) {
        if (link.pbId === null) {
          const record = await pb.collection('links').create({
            title: link.title,
            url: link.url,
            is_active: link.isActive,
            user: userId,
          });
          updatedLinks.push({ ...link, pbId: record.id, id: record.id });
        } else {
          await pb.collection('links').update(link.pbId, {
            title: link.title,
            url: link.url,
            is_active: link.isActive,
          });
          updatedLinks.push(link);
        }
      }
      setLinks(updatedLinks);

      // 3. Update user record
      const userData: Record<string, unknown> = {
        name: profile.name,
        bio: profile.bio,
        theme: theme,
        socials: JSON.stringify(socials),
      };
      if (avatarFile) {
        userData.avatar = avatarFile;
      }
      const updated = await pb.collection('users').update(userId, userData);
      setAvatarFileState(null);
      setProfile(prev => ({
        ...prev,
        avatarUrl: updated.avatar
          ? pb.files.getURL(updated, updated.avatar, { thumb: '200x200' })
          : prev.avatarUrl,
      }));

      return true;
    } catch (e) {
      console.error('Auto-save failed:', e);
      return false;
    }
  };

  useEffect(() => {
    if (savingRef.current) return;

    const delay = debounceDelayRef.current;
    const timer = setTimeout(async () => {
      savingRef.current = true;
      setSaving(true);
      pendingDuringSaveRef.current = false;

      await performSave();

      if (pendingDuringSaveRef.current) {
        savingRef.current = false;
        setSaving(false);
        setSaveTrigger(v => v + 1);
      } else {
        savingRef.current = false;
        setSaving(false);
      }
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveTrigger]);

  const commitLink = (id: string) => {
    markDirty();
  };

  const updateLink = (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));
    if ('isActive' in updates && Object.keys(updates).length === 1) {
      markDirty(true);
    }
  };

  const addLink = (title: string, url: string) => {
    const newLink: Link = {
      id: Math.random().toString(36).substr(2, 9),
      pbId: null,
      title,
      url,
      isActive: true,
    };
    setLinks(prev => [newLink, ...prev]);
    markDirty(true);
  };

  const deleteLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link?.pbId) deletedPbIdsRef.current.push(link.pbId);
    setLinks(prev => prev.filter(l => l.id !== id));
    markDirty(true);
  };

  const [links, setLinks] = useState<Link[]>([
    { id: '1', pbId: null, title: 'Mi Portafolio Web', url: 'https://example.com', isActive: true },
    { id: '2', pbId: null, title: 'Último Artículo del Blog', url: 'https://example.com/blog', isActive: true },
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
    if ('isActive' in updates && Object.keys(updates).length === 1) {
      markDirty(true);
    } else {
      markDirty();
    }
  };

  const setTheme = (t: string) => {
    setThemeState(t);
    markDirty(true);
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
      { id: '1', pbId: null, title: 'Mi Portafolio Web', url: 'https://example.com', isActive: true },
      { id: '2', pbId: null, title: 'Último Artículo del Blog', url: 'https://example.com/blog', isActive: true },
    ]);
    deletedPbIdsRef.current = [];
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
      user,
      avatarFile,
      setAvatarFile,
      updateLink,
      commitLink,
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
