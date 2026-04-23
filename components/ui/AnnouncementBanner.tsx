'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementBannerProps {
  message: string;
  link?: string;
  linkText?: string;
  onClose?: () => void;
}

export default function AnnouncementBanner({ message, link, linkText, onClose }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if the env variable is set
    if (process.env.NEXT_PUBLIC_SHOW_BANNER !== 'true') return;
    
    // Check session storage to see if user already dismissed it
    const dismissed = sessionStorage.getItem('announcement-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcement-dismissed', 'true');
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="w-full bg-gradient-to-r from-accent-purple to-accent-cyan text-white relative z-[60]"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-center relative">
            <p className="text-xs md:text-sm font-medium text-center pr-8">
              {message}
              {link && linkText && (
                <Link href={link} className="ml-2 font-bold underline hover:text-white/80 transition-colors">
                  {linkText}
                </Link>
              )}
            </p>
            <button
              onClick={handleClose}
              aria-label="Dismiss announcement"
              className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
