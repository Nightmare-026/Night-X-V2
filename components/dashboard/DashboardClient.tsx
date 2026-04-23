'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { TOOLS, Tool } from '@/lib/tools-registry';
import ToolCard from './ToolCard';
import { Clock } from 'lucide-react';

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    // Toast for first time login
    const hasLoggedIn = sessionStorage.getItem('has-logged-in-toast');
    if (!hasLoggedIn) {
      setTimeout(() => {
        toast('Welcome to Night X. Explore the dashboard and try the tools that fit your workflow.', 'success');
        sessionStorage.setItem('has-logged-in-toast', 'true');
      }, 1000);
    }

    // Keyboard shortcut to focus search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Load recently used tools from localStorage
    const history = localStorage.getItem('night-x-recent-tools');
    if (history) {
      try {
        const slugs: string[] = JSON.parse(history);
        const tools = slugs
          .map(slug => TOOLS.find(t => t.slug === slug))
          .filter(Boolean) as Tool[];
        setRecentTools(tools.slice(0, 3));
      } catch (e) {
        console.error('Failed to parse recent tools', e);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  return (
    <div className="w-full">
      {recentTools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-syne font-bold flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-accent-cyan" />
            Recently Used
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentTools.map(tool => (
              <ToolCard key={`recent-${tool.slug}`} tool={tool} />
            ))}
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}
