"use client";

import React from 'react';

interface LinkButtonProps {
  title: string;
  url: string;
  theme?: string;
}

const LinkButton = ({ title, url, theme = 'light' }: LinkButtonProps) => {
  const themeClasses: Record<string, string> = {
    light: 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50',
    dark: 'bg-[#1e1e1e] text-white border-white/10 hover:bg-[#252525]',
    sunset: 'bg-white/70 backdrop-blur-md text-rose-900 border-rose-100 hover:bg-white/90',
    ocean: 'bg-white/70 backdrop-blur-md text-cyan-900 border-cyan-100 hover:bg-white/90',
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full py-4 px-6 rounded-2xl border-2 font-bold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center ${currentTheme}`}
    >
      {title}
    </a>
  );
};

export default LinkButton;