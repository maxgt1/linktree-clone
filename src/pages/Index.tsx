"use client";

import React from 'react';
import Profile from '../components/Profile';
import LinkButton from '../components/LinkButton';
import SocialLinks from '../components/SocialLinks';
import { useAppContext } from '@/context/AppContext';
import { Globe } from 'lucide-react';

const Index = () => {
  const { links, profile } = useAppContext();
  
  const activeLinks = links.filter(l => l.isActive);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4">
      <div className="max-w-md mx-auto">
        <Profile 
          name={profile.name}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
        />

        <div className="space-y-2">
          {activeLinks.map((link) => (
            <LinkButton 
              key={link.id}
              title={link.title}
              url={link.url}
              icon={<Globe size={20} />}
            />
          ))}
          {activeLinks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No hay enlaces activos para mostrar.
            </div>
          )}
        </div>

        <SocialLinks />

        <footer className="mt-16 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Creado con ❤️ por Dyad
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;