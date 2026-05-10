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
  reorderLinks: (startIndex: number, endIndex: number) => void;
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
        id: crypto.randomUUID(),
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
      if (record && !savingRef.current) {
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

  const reorderLinks = (startIndex: number, endIndex: number) => {
    setLinks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    markDirty(true);
  };

  const performSave = async (): Promise<boolean> => {
    if (!pb.authStore.isValid) return false;
    try {
      const userId = pb.authStore.record?.id;

      // Delete all existing links (order will be recreated from local state)
      const existing = await pb.collection('links').getFullList({
        filter: `user = "${userId}"`,
      });
      for (const record of existing) {
        try { await pb.collection('links').delete(record.id); } catch { /* skip */ }
      }

      // Recreate all links in order (preserves local order)
      const pbIdUpdates: Array<{ oldId: string; newId: string }> = [];
      for (const link of links) {
        const record = await pb.collection('links').create({
          title: link.title,
          url: link.url,
          is_active: link.isActive,
          user: userId,
        });
        pbIdUpdates.push({ oldId: link.id, newId: record.id });
      }
      if (pbIdUpdates.length > 0) {
        setLinks(prev => prev.map(l => {
          const u = pbIdUpdates.find(p => p.oldId === l.id);
          return u ? { ...l, pbId: u.newId } : l;
        }));
      }

      // Update user record
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

      deletedPbIdsRef.current = [];

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
    const soloToggle = 'isActive' in updates && Object.keys(updates).length === 1;
    markDirty(soloToggle);
  };

  const addLink = (title: string, url: string) => {
    const newLink: Link = {
      id: crypto.randomUUID(),
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

  const [links, setLinks] = useState<Link[]>([]);

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    bio: '',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const [socials, setSocials] = useState<SocialLink[]>([]);

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
      name: '',
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
    });
    setSocials([]);
    setLinks([]);
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
      reorderLinks,
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
