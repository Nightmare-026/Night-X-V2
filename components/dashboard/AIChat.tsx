'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-lg shadow-accent-purple/40 z-50 flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-accent-purple/20 -z-10" />
        {isOpen ? <X /> : <Bot />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] glass-card flex flex-col z-50 overflow-hidden border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-syne">Night X AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-accent-cyan" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-white/80 border border-white/5">
                    {welcomeMessage}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-accent-purple/20" : "bg-white/5"
                  )}>
                    {msg.role === 'user' ? <User size={14} className="text-accent-purple" /> : <Bot size={14} className="text-accent-cyan" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 text-sm rounded-2xl border",
                    msg.role === 'user' 
                      ? "bg-accent-purple/10 border-accent-purple/20 rounded-tr-none text-white" 
                      : "bg-white/5 border-white/5 rounded-tl-none text-white/80"
                  )}>
                    {msg.content}
                    <div className="text-[10px] text-white/20 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-accent-cyan" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              {usage.count >= usage.limit ? (
                <div className="text-center py-2">
                  <p className="text-xs text-red-400 font-medium">Daily limit reached (30/30)</p>
                  <p className="text-[10px] text-white/40">Resets at midnight</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent-purple/50 transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-accent-purple flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-purple/90 transition-colors"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest flex items-center gap-1">
                  <Sparkles size={10} />
                  Powered by AI
                </span>
                <span className="text-[10px] text-white/40">
                  {usage.count}/{usage.limit} messages
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
