'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative w-full max-w-lg rounded-2xl border border-white/[0.05] bg-[#16161F] shadow-2xl overflow-hidden",
              className
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="p-6 border-b border-white/5 pr-14 relative">
                {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
                {description && <p className="text-sm text-text-tertiary mt-1.5">{description}</p>}
                
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {!title && !description && (
               <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
