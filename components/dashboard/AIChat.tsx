'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 30 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      fetchUsage();
    }
  }, [isOpen, messages]);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/ai/usage?tool=chatbot');
      const data = await res.json();
      setUsage({ count: data.count, limit: data.limit });
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || usage.count >= usage.limit) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      
      if (res.status === 429) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'Daily limit reached. Please try again tomorrow.',
          timestamp: new Date(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }]);
      }
      
      fetchUsage();
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const welcomeMessage = "Hi! I'm your Night X assistant. I can help you find tools, explain how to use them, or answer questions. What do you need?";

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-13 h-13 rounded-2xl bg-gradient-to-br from-primary via-emerald-500 to-green-600 shadow-[0_8px_25px_rgba(34,197,94,0.4)] z-50 flex items-center justify-center text-black border border-white/20 p-3.5"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] rounded-3xl bg-surface-base border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] bg-surface-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Night X Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white p-1 rounded">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {messages.length === 0 && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-surface-card border border-white/10 flex items-center justify-center flex-shrink-0 text-primary-400">
                    <Bot size={14} />
                  </div>
                  <div className="bg-surface-card border border-white/[0.06] rounded-2xl rounded-tl-none p-3 text-xs text-text-secondary leading-relaxed shadow-sm">
                    {welcomeMessage}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2.5", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs",
                    msg.role === 'user' ? "bg-primary/20 text-primary-300" : "bg-surface-card border border-white/10 text-primary-400"
                  )}>
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={cn(
                    "max-w-[82%] p-3 text-xs rounded-2xl leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary/20 border border-primary/30 rounded-tr-none text-white font-medium" 
                      : "bg-surface-card border border-white/[0.06] rounded-tl-none text-text-secondary"
                  )}>
                    {msg.content}
                    <div className="text-[9px] text-text-muted mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-surface-card border border-white/10 flex items-center justify-center flex-shrink-0 text-primary-400">
                    <Bot size={14} />
                  </div>
                  <div className="bg-surface-card border border-white/[0.06] rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-3 border-t border-white/[0.08] bg-surface-card space-y-2">
              {usage.count >= usage.limit ? (
                <div className="text-center py-1">
                  <p className="text-xs text-red-400 font-medium">Daily limit reached ({usage.limit}/{usage.limit})</p>
                  <p className="text-[10px] text-text-muted">Resets at midnight</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about any tool..."
                    className="flex-1 bg-surface-inset border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-xl bg-primary text-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-400 transition-colors shrink-0"
                    aria-label="Send query"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between px-1 text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <Sparkles size={9} className="text-primary-400" />
                  <span>AI Powered</span>
                </span>
                <span>{usage.count}/{usage.limit} queries</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
