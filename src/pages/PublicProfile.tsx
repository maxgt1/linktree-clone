"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pb from '@/lib/pocketbase';
import Profile from '@/components/Profile';
import LinkButton from '@/components/LinkButton';
import SocialLinks from '@/components/SocialLinks';
import { Globe, Loader2, UserX } from 'lucide-react';

interface PublicLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface PublicUser {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme: string;
  socials: Array<{ platform: string; url: string; isActive: boolean }>;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [links, setLinks] = useState<PublicLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);

    Promise.all([
      pb.collection('users').getOne(userId),
      pb.collection('links').getFullList({
        filter: `user = "${userId}" && is_active = true`,
      }),
    ])
      .then(([userRecord, linkRecords]) => {
        const avatar = userRecord.avatar
          ? pb.files.getURL(userRecord, userRecord.avatar, { thumb: '200x200' })
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200';
        const rawSocials = userRecord.socials || [];
        const parsedSocials = typeof rawSocials === 'string' ? JSON.parse(rawSocials) : rawSocials;
        setUser({
          id: userRecord.id,
          name: userRecord.name || 'Sin nombre',
          bio: userRecord.bio || '',
          avatarUrl: avatar,
          theme: userRecord.theme || 'light',
          socials: parsedSocials,
        });
        setLinks(linkRecords.map(r => ({
          id: r.id,
          title: r.title,
          url: r.url,
          isActive: r.is_active,
        })));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [userId]);

  const getThemeStyles = () => {
    if (!user) return 'bg-[#f8f9fa]';
    switch (user.theme) {
      case "dark": return "bg-[#121212] text-white";
      case "sunset": return "bg-gradient-to-br from-orange-100 to-rose-200";
      case "ocean": return "bg-[#e0f2f1]";
      default: return "bg-[#f8f9fa]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-gray-400">
        <UserX size={48} className="mb-4" />
        <p className="text-lg font-medium">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeStyles()} py-16 px-4 transition-colors duration-500`}>
      <div className="max-w-md mx-auto">
        <Profile name={user.name} bio={user.bio} avatarUrl={user.avatarUrl} />
        <div className="space-y-4">
          {links.map(link => (
            <LinkButton key={link.id} title={link.title} url={link.url} icon={<Globe size={20} />} />
          ))}
          {links.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay enlaces disponibles.</div>
          )}
        </div>
        <SocialLinks items={user.socials} />
      </div>
    </div>
  );
};

export default PublicProfile;
