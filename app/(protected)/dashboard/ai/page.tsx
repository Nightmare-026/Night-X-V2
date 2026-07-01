'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  Loader2, 
  Zap, 
  Cpu, 
  History, 
  Brain,
  ShieldCheck,
  Terminal,
  ChevronRight,
  Database,
  Search,
  Plus
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
  }, [messages]);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/ai/usage?tool=chatbot');
      const data = await res.json();
      setUsage({ count: data.count, limit: data.limit });
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

  const suggestions = [
    "How do I use the Background Remover?",
    "Explain the 'Violet Protocol' design system",
    "Generate a professional bio for a developer",
    "What's the best tool for checking Regex?",
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
        
        {/* Left Panel: Neural Control (5 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Intelligence Overview */}
          <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden shrink-0">
            <div className="absolute -right-4 -top-4 opacity-[0.03] rotate-12">
              <Brain size={160} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                  Intelligence Overview
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-md">
                  <div className="flex items-center gap-3">
                    <Database size={14} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Model</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">GPT-4O-PRO</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-md">
                  <div className="flex items-center gap-3">
                    <Zap size={14} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quota Usage</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{usage.count}/{usage.limit}</span>
                    <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-violet-400" 
                        style={{ width: `${(usage.count / usage.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-md">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Protocol</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest bg-violet-400/10 px-2 py-0.5 rounded">VIOLET_ENCRYPT</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Queries / Suggestions */}
          <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-violet-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Suggested Queries</h3>
              </div>
              <Plus size={14} className="text-white/20 cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="space-y-2 overflow-y-auto no-scrollbar">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="w-full text-left p-3 rounded-md bg-white/[0.02] border border-white/[0.05] hover:border-violet-400/30 hover:bg-violet-400/5 group transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Search size={12} className="text-white/10 group-hover:text-violet-400 mt-1 transition-colors" />
                    <p className="text-[11px] text-white/40 group-hover:text-white/80 leading-relaxed font-inter italic">
                      &quot;{suggestion}&quot;
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Session Audit */}
            <div className="mt-auto pt-6 border-t border-white/[0.05] flex items-center justify-between opacity-50">
              <div className="flex items-center gap-2">
                <History size={12} className="text-violet-400" />
                <span className="text-[10px] font-mono text-white/40 tracking-tighter uppercase">Session: {new Date().toLocaleDateString()}</span>
              </div>
              <Cpu size={12} className="text-white/20" />
            </div>
          </section>
        </div>

        {/* Right Panel: Synchronized Intelligence (8 Columns) */}
        <div className="lg:col-span-8 h-full">
          <div className="glass-card border-white/[0.05] bg-black/40 rounded-md h-full flex flex-col relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                  <Bot size={20} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider flex items-center gap-2">
                    Night X Neural Hub
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse ml-2" />
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Synchronized Intelligence // Active Session</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">Latency: 24ms</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-20">
                  <div className="w-20 h-20 rounded-md bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/5 mb-8 relative">
                    <Bot size={40} className="relative z-10" />
                    <div className="absolute inset-0 bg-violet-400/5 blur-3xl rounded-full animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit uppercase tracking-[0.2em] mb-4">
                    Neural Hub Active
                  </h3>
                  <p className="text-[11px] text-white/30 leading-relaxed uppercase tracking-widest font-mono mb-8">
                    I am your Sovereign-Grade Assistant. I can help you orchestrate workflows, debug code, or navigate the Night X ecosystem.
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded border border-white/5 bg-white/[0.01] text-[10px] text-white/20 uppercase tracking-tighter">
                      End-to-End Encrypted
                    </div>
                    <div className="p-4 rounded border border-white/5 bg-white/[0.01] text-[10px] text-white/20 uppercase tracking-tighter">
                      Context Aware Sync
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-6 max-w-4xl mx-auto",
                      msg.role === 'user' ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded shrink-0 flex items-center justify-center border",
                      msg.role === 'user' 
                        ? "bg-violet-400/10 border-violet-400/20 text-violet-400" 
                        : "bg-white/5 border-white/10 text-white/20"
                    )}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-violet-400" />}
                    </div>
                    
                    <div className={cn(
                      "flex-1 space-y-2",
                      msg.role === 'user' ? "text-right" : "text-left"
                    )}>
                      <div className="flex items-center gap-3 mb-1 justify-end">
                         {msg.role === 'user' ? (
                            <>
                              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{msg.timestamp.toLocaleTimeString()}</span>
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sovereign_User</span>
                            </>
                         ) : (
                            <>
                              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Neural_Assistant</span>
                              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{msg.timestamp.toLocaleTimeString()}</span>
                            </>
                         )}
                      </div>
                      <div className={cn(
                        "p-6 rounded-md border text-sm leading-relaxed font-inter",
                        msg.role === 'user'
                          ? "bg-violet-400/5 border-violet-400/20 text-white/90"
                          : "bg-white/[0.03] border-white/[0.05] text-white/80"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-6 max-w-4xl mx-auto">
                  <div className="h-10 w-10 rounded shrink-0 flex items-center justify-center border bg-white/5 border-white/10 text-white/20">
                    <Bot size={18} className="text-violet-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Neural_Assistant</span>
                      <Loader2 size={12} className="animate-spin text-violet-400/50" />
                    </div>
                    <div className="p-6 rounded-md bg-white/[0.03] border border-white/[0.05] flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/[0.05] bg-black/40 shrink-0">
              <div className="max-w-4xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Enter semantic instruction or command..."
                  className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md px-6 py-5 pr-16 text-sm text-white/80 outline-none focus:border-violet-400/50 focus:bg-violet-400/[0.02] transition-all font-inter placeholder:text-white/10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || usage.count >= usage.limit}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded bg-violet-400 text-black flex items-center justify-center hover:bg-violet-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="max-w-4xl mx-auto flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Sparkles size={10} /> ENGINE: VIOLET_CORE</span>
                  <span className="flex items-center gap-1.5"><Terminal size={10} /> MODE: SYNCHRONIZED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-400/50" 
                      style={{ width: `${(usage.count / usage.limit) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Load: {usage.count}/{usage.limit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
