"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const SocialLinks = () => {
  const socials = [
    { icon: <Instagram size={20} />, url: "#", label: "Instagram" },
    { icon: <Twitter size={20} />, url: "#", label: "Twitter" },
    { icon: <Github size={20} />, url: "#", label: "GitHub" },
    { icon: <Linkedin size={20} />, url: "#", label: "LinkedIn" },
    { icon: <Mail size={20} />, url: "#", label: "Email" },
  ];

  return (
    <div className="flex justify-center space-x-6 mt-8">
      {socials.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          whileHover={{ y: -3 }}
          className="text-gray-400 hover:text-gray-900 transition-colors"
          aria-label={social.label}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;