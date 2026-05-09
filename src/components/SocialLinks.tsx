"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const iconMap: Record<string, React.ReactNode> = {
  Instagram: <Instagram size={20} />,
  Twitter: <Twitter size={20} />,
  Github: <Github size={20} />,
  Linkedin: <Linkedin size={20} />,
  Mail: <Mail size={20} />,
};

const SocialLinks = () => {
  const { socials } = useAppContext();
  const activeSocials = socials.filter(s => s.isActive && s.url !== '');

  return (
    <div className="flex justify-center flex-wrap gap-6 mt-8">
      {activeSocials.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3, scale: 1.1 }}
          className="text-gray-400 hover:text-primary transition-all"
          aria-label={social.platform}
        >
          {iconMap[social.platform]}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;