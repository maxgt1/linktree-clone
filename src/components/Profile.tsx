"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProfileProps {
  name: string;
  bio: string;
  avatarUrl: string;
}

const Profile = ({ name, bio, avatarUrl }: ProfileProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center mb-8"
    >
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
      <p className="text-gray-600 max-w-xs leading-relaxed">{bio}</p>
    </motion.div>
  );
};

export default Profile;