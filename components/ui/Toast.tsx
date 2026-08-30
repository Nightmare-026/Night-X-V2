"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.15 } }}
              className="pointer-events-auto"
            >
              <div className={cn(
                "relative overflow-hidden glass-card p-3.5 pl-4 rounded-xl border min-w-[280px] max-w-[380px] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8)] transition-all",
                t.type === "success" && "border-emerald-500/20 bg-surface-card border-l-emerald-500 border-l-[3px]",
                t.type === "error" && "border-red-500/20 bg-surface-card border-l-red-500 border-l-[3px]",
                t.type === "info" && "border-primary/20 bg-surface-card border-l-primary border-l-[3px]"
              )}>
                <div className="relative flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-lg border shrink-0",
                    t.type === "success" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    t.type === "error" && "bg-red-500/10 border-red-500/20 text-red-400",
                    t.type === "info" && "bg-primary/10 border-primary/20 text-primary"
                  )}>
                    {t.type === "success" && <CheckCircle2 size={16} />}
                    {t.type === "error" && <AlertCircle size={16} />}
                    {t.type === "info" && <Info size={16} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium leading-snug">{t.message}</p>
                  </div>
                  
                  <button 
                    onClick={() => removeToast(t.id)}
                    className="p-1 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
