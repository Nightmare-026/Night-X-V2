'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, ArrowRight, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Percentage of', icon: <Percent className="w-4 h-4" /> },
    { title: 'Percentage change', icon: <TrendingUp className="w-4 h-4" /> },
    { title: 'Reverse %', icon: <TrendingDown className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 max-w-2xl mx-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === idx ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.title}</span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {activeTab === 0 && <PercentageOf />}
        {activeTab === 1 && <PercentageChange />}
        {activeTab === 2 && <ReversePercentage />}
      </div>
    </div>
  );
}

function PercentageOf() {
  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(200);
  const result = (val1 / 100) * val2;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-wrap items-center justify-center gap-6 text-2xl font-bold">
        <span className="text-white/40">What is</span>
        <div className="relative group">
          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
            className="w-24 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 uppercase tracking-widest">Percent</span>
        </div>
        <span className="text-white/40">% of</span>
        <div className="relative group">
          <input
            type="number"
            value={val2}
            onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
            className="w-40 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 uppercase tracking-widest">Total</span>
        </div>
        <span className="text-white/40">?</span>
      </div>

      <div className="p-10 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 rounded-3xl text-center">
        <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">Result</p>
        <h2 className="text-6xl font-bold text-white">{result % 1 === 0 ? result : result.toFixed(2)}</h2>
      </div>
    </motion.div>
  );
}

function PercentageChange() {
  const [val1, setVal1] = useState(100);
  const [val2, setVal2] = useState(150);
  const diff = val2 - val1;
  const result = (diff / val1) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-wrap items-center justify-center gap-6 text-2xl font-bold">
        <span className="text-white/40">From</span>
        <input
          type="number"
          value={val1}
          onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
          className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        />
        <span className="text-white/40">to</span>
        <input
          type="number"
          value={val2}
          onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
          className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div className="p-10 bg-gradient-to-br from-orange-500/20 to-emerald-500/20 border border-white/10 rounded-3xl text-center">
        <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">Percentage Change</p>
        <h2 className={`text-6xl font-bold ${result >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {result > 0 ? '+' : ''}{result % 1 === 0 ? result : result.toFixed(2)}%
        </h2>
        <p className="mt-2 text-white/60">
          A {Math.abs(result).toFixed(2)}% {result >= 0 ? 'increase' : 'decrease'}
        </p>
      </div>
    </motion.div>
  );
}

function ReversePercentage() {
  const [val1, setVal1] = useState(20);
  const [val2, setVal2] = useState(50);
  const result = (val1 / val2) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-wrap items-center justify-center gap-6 text-2xl font-bold">
        <input
          type="number"
          value={val1}
          onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
          className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <span className="text-white/40">is what % of</span>
        <input
          type="number"
          value={val2}
          onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
          className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <span className="text-white/40">?</span>
      </div>

      <div className="p-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-3xl text-center">
        <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">Percentage Result</p>
        <h2 className="text-6xl font-bold text-white">{result % 1 === 0 ? result : result.toFixed(2)}%</h2>
      </div>
    </motion.div>
  );
}
