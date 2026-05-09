"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LinkButtonProps {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

const LinkButton = ({ title, url, icon }: LinkButtonProps) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center justify-between w-full p-4 mb-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        {icon && <div className="text-gray-600 group-hover:text-black transition-colors">{icon}</div>}
        <span className="font-semibold text-gray-800 group-hover:text-black">{title}</span>
      </div>
      <ExternalLink size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
    </motion.a>
  );
};

export default LinkButton;