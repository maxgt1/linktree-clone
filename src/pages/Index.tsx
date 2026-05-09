"use client";

import React from 'react';
import Profile from '../components/Profile';
import LinkButton from '../components/LinkButton';
import SocialLinks from '../components/SocialLinks';
import { Globe, BookOpen, MessageSquare, Coffee, Sparkles } from 'lucide-react';

const Index = () => {
  const links = [
    { 
      title: "Mi Portafolio Web", 
      url: "https://example.com", 
      icon: <Globe size={20} /> 
    },
    { 
      title: "Último Artículo del Blog", 
      url: "https://example.com/blog", 
      icon: <BookOpen size={20} /> 
    },
    { 
      title: "Asesorías 1 a 1", 
      url: "https://example.com/booking", 
      icon: <MessageSquare size={20} /> 
    },
    { 
      title: "Cursos Online", 
      url: "https://example.com/courses", 
      icon: <Sparkles size={20} /> 
    },
    { 
      title: "Cómprame un café", 
      url: "https://example.com/coffee", 
      icon: <Coffee size={20} /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4">
      <div className="max-w-md mx-auto">
        <Profile 
          name="Alex Rivera"
          bio="Diseñador UI/UX & Desarrollador Frontend apasionado por crear experiencias digitales hermosas."
          avatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200"
        />

        <div className="space-y-2">
          {links.map((link, index) => (
            <LinkButton 
              key={index}
              title={link.title}
              url={link.url}
              icon={link.icon}
            />
          ))}
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