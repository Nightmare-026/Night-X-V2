'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
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
      if (res.ok) {
        const data = await res.json();
        setUsage({ count: data.count || 0, limit: data.limit || 30 });
      }
    } catch {
      // ignore
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
      } else if (!res.ok || data.error) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.error || 'AI Assistant is currently standing by. Please verify the API credentials in settings.',
          timestamp: new Date(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.response || 'I am here to help you navigate Night X tools.',
          timestamp: new Date(),
        }]);
      }
      
      fetchUsage();
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Unable to reach AI service right now. Please try again in a moment.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const welcomeMessage = "Hi! I'm your Night X assistant. I can help you find tools, explain how to use them, or assist with writing and formatting tasks. What can I do for you?";

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-[0_6px_20px_rgba(245,158,11,0.4)] z-50 flex items-center justify-center text-black border border-white/20 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={20} /> : <Bot size={20} />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-20 right-5 w-[350px] max-w-[calc(100vw-2.5rem)] h-[480px] max-h-[calc(100vh-7rem)] rounded-2xl bg-surface-base border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-white/[0.08] bg-surface-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Bot size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">Night X Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">Workspace AI</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                aria-label="Close assistant"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-surface-card border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Bot size={12} />
                  </div>
                  <div className="bg-surface-card border border-white/[0.06] rounded-xl rounded-tl-none p-2.5 text-xs text-text-secondary leading-relaxed shadow-sm">
                    {welcomeMessage}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs",
                    msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-surface-card border border-white/10 text-primary"
                  )}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={cn(
                    "max-w-[82%] p-2.5 text-xs rounded-xl leading-relaxed",
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
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-surface-card border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Bot size={12} />
                  </div>
                  <div className="bg-surface-card border border-white/[0.06] rounded-xl rounded-tl-none p-2.5 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/[0.08] bg-surface-card space-y-1.5">
              {usage.count >= usage.limit ? (
                <div className="text-center py-1">
                  <p className="text-xs text-red-400 font-medium">Daily limit reached ({usage.limit}/{usage.limit})</p>
                  <p className="text-[10px] text-text-muted">Resets at midnight UTC</p>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask about any tool..."
                    className="flex-1 bg-surface-inset border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-xl bg-primary text-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors shrink-0"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={13} /> : <Send size={13} />}
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between px-1 text-[10px] text-text-muted">
                <span className="flex items-center gap-1 text-primary">
                  <Sparkles size={9} />
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
