'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/20 blur-[120px] rounded-full" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 mb-8">
            <AlertCircle className="w-10 h-10 text-accent-purple" />
          </div>
          
          <h1 className="text-8xl md:text-9xl font-bold font-syne text-white mb-4 tracking-tighter">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold font-syne text-white mb-6">
            Lost in the Void?
          </h2>
          
          <p className="text-white/50 mb-12 max-w-md mx-auto font-dm-sans text-lg">
            The tool or page you are looking for has been moved or doesn't exist in this sector.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="group flex items-center gap-2 px-8 py-4 bg-accent-purple hover:bg-accent-purple/80 rounded-2xl text-white font-bold transition-all shadow-lg shadow-accent-purple/25"
            >
              <Home size={18} className="transition-transform group-hover:-translate-y-0.5" />
              Return to Hub
            </Link>
            
            <Link 
              href="/services" 
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
            >
              <Search size={18} />
              Browse Tools
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <div className="text-xs font-mono text-white/50 tracking-widest uppercase">System Error: Route_Not_Found</div>
      </div>
    </div>
  );
}
