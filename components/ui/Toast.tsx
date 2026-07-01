"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "premium";

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
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={cn(
                "relative group overflow-hidden glass-card p-4 pl-5 rounded-2xl border min-w-[320px] max-w-[400px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all",
                t.type === "success" && "border-green-500/20 bg-green-500/[0.02] border-l-green-500 border-l-[4px]",
                t.type === "error" && "border-red-500/20 bg-red-500/[0.02] border-l-red-500 border-l-[4px]",
                t.type === "info" && "border-blue-500/20 bg-blue-500/[0.02] border-l-blue-500 border-l-[4px]",
                t.type === "premium" && "border-accent-purple/20 bg-accent-purple/[0.02] border-l-accent-purple border-l-[4px]"
              )}>
                {/* Glow Effect */}
                <div className={cn(
                  "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none",
                  t.type === "success" && "bg-green-500",
                  t.type === "error" && "bg-red-500",
                  t.type === "info" && "bg-blue-500",
                  t.type === "premium" && "bg-accent-purple"
                )} />

                <div className="relative flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-xl border shrink-0",
                    t.type === "success" && "bg-green-500/10 border-green-500/20 text-green-400",
                    t.type === "error" && "bg-red-500/10 border-red-500/20 text-red-400",
                    t.type === "info" && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                    t.type === "premium" && "bg-accent-purple/10 border-accent-purple/20 text-accent-purple"
                  )}>
                    {t.type === "success" && <CheckCircle2 size={18} />}
                    {t.type === "error" && <AlertCircle size={18} />}
                    {t.type === "info" && <Info size={18} />}
                    {t.type === "premium" && <Zap size={18} />}
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <p className={cn(
                      "text-[0.625rem] font-black uppercase tracking-[0.2em] mb-1",
                      t.type === "success" && "text-green-500",
                      t.type === "error" && "text-red-500",
                      t.type === "info" && "text-blue-500",
                      t.type === "premium" && "text-accent-purple"
                    )}>{t.type}</p>
                    <p className="text-white/90 text-[0.8125rem] font-medium leading-relaxed">{t.message}</p>
                  </div>
                  
                  <button 
                    onClick={() => removeToast(t.id)}
                    className="p-1 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all shrink-0 mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Progress Bar */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px]",
                    t.type === "success" && "bg-green-500/50",
                    t.type === "error" && "bg-red-500/50",
                    t.type === "info" && "bg-blue-500/50",
                    t.type === "premium" && "bg-accent-purple/50"
                  )}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
