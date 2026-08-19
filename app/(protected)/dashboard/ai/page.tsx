'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  Loader2, 
  Zap, 
  History, 
  Terminal, 
  Search, 
  RotateCcw,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 30 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/ai/usage?tool=chatbot');
      const data = await res.json();
      setUsage({ count: data.count || 0, limit: data.limit || 30 });
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

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
          content: 'You have reached your daily AI usage limit. Please come back tomorrow or upgrade your plan.',
          timestamp: new Date(),
        }]);
      } else if (!res.ok) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.error || 'I encountered an error processing your request. Please try again.',
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
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Unable to connect to the AI service. Please verify your network and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const suggestions = [
    "How can I compress an image without losing quality?",
    "Explain how to write a regex for validating UUID v4",
    "Generate a concise, professional developer bio",
    "What is the difference between Base64 and SHA-256?",
  ];

  const quotaPercent = Math.min(100, Math.round((usage.count / Math.max(1, usage.limit)) * 100));

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
        
        {/* Left Sidebar: Controls & Stats (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Quota & Model Card */}
          <section className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 rounded-2xl relative overflow-hidden shrink-0 shadow-[var(--shadow-raised-sm)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">AI Assistant</h2>
                  <p className="text-[11px] text-text-muted">High-precision language engine</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Online
              </span>
            </div>

            {/* Usage Progress */}
            <div className="space-y-2 p-3.5 bg-surface-inset border border-white/[0.06] rounded-xl shadow-[var(--shadow-inset-sm)]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">Daily Quota</span>
                <span className="font-mono text-white font-semibold">{usage.count} / {usage.limit} requests</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-500" 
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-text-muted">Resets daily at 00:00 UTC</p>
            </div>
          </section>

          {/* Prompt Suggestions */}
          <section className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-[var(--shadow-raised-sm)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Terminal size={14} className="text-primary-400" />
                <span>Suggested Prompts</span>
              </div>
              {messages.length > 0 && (
                <button 
                  onClick={clearConversation}
                  className="text-[11px] text-text-muted hover:text-red-400 flex items-center gap-1 transition-colors"
                  aria-label="Clear chat history"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
            </div>

            <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="w-full text-left p-3 rounded-xl bg-surface-inset border border-white/[0.06] hover:border-primary/40 hover:bg-primary/[0.06] group transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <Search size={13} className="text-white/30 group-hover:text-primary-400 mt-0.5 transition-colors shrink-0" />
                    <p className="text-xs text-text-secondary group-hover:text-white leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel: Chat Interface (8 Columns) */}
        <div className="lg:col-span-8 h-full">
          <div className="rounded-3xl border border-white/[0.08] bg-surface-card rounded-2xl h-full flex flex-col relative overflow-hidden shadow-[var(--shadow-raised-md)]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-400 mb-6 shadow-md">
                    <Bot size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    How can I assist your workflow today?
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed mb-6">
                    Ask questions about code formatting, security algorithms, regex patterns, or tool recommendations across the Night X suite.
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-3xl",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border text-xs font-bold shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary/20 border-primary/30 text-primary-300" 
                        : "bg-surface-inset border-white/10 text-primary-400"
                    )}>
                      {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                    </div>
                    
                    <div className={cn(
                      "space-y-1",
                      msg.role === 'user' ? "text-right" : "text-left"
                    )}>
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[11px] font-semibold text-text-muted">
                          {msg.role === 'user' ? (session?.user?.name || 'You') : 'Night X AI'}
                        </span>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal",
                        msg.role === 'user'
                          ? "bg-primary/20 border-primary/40 text-white shadow-sm font-medium"
                          : "bg-surface-inset border-white/[0.08] text-text-secondary"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-4 max-w-3xl mr-auto">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border bg-surface-inset border-white/10 text-primary-400">
                    <Bot size={15} />
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-inset border border-white/[0.08] flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary-400" />
                    <span className="text-xs text-text-tertiary">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-surface-inset shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask a question or request assistance..."
                  className="w-full bg-surface-card border border-white/[0.1] rounded-xl px-4 py-3 pr-14 text-xs sm:text-sm text-white outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted shadow-[var(--shadow-inset-sm)]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                  aria-label="AI message prompt input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || usage.count >= usage.limit}
                  aria-label="Send message"
                  className="absolute right-2 p-2 rounded-lg bg-primary text-black hover:bg-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
