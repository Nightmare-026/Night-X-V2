'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Percent, Calendar, Info, PieChart, TrendingUp } from 'lucide-react';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(10);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEmi = React.useCallback(() => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / (12 * 100);
    const numberOfMonths = tenureType === 'years' ? tenure * 12 : tenure;

    if (ratePerMonth === 0) {
      setEmi(principal / numberOfMonths);
      setTotalPayment(principal);
      setTotalInterest(0);
      return;
    }

    const emiValue = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    const totalPayable = emiValue * numberOfMonths;
    const totalInt = totalPayable - principal;

    setEmi(emiValue);
    setTotalPayment(totalPayable);
    setTotalInterest(totalInt);
  }, [loanAmount, interestRate, tenure, tenureType]);

  useEffect(() => {
    calculateEmi();
  }, [calculateEmi]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const interestPercentage = (totalInterest / totalPayment) * 100;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/60">Loan Amount</label>
                <span className="text-lg font-bold text-white">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/60">Interest Rate (%)</label>
                <span className="text-lg font-bold text-white">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/60">Loan Tenure</label>
                <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => setTenureType('years')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${tenureType === 'years' ? 'bg-emerald-500 text-white' : 'text-white/40'}`}
                  >
                    Yr
                  </button>
                  <button
                    onClick={() => setTenureType('months')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${tenureType === 'months' ? 'bg-emerald-500 text-white' : 'text-white/40'}`}
                  >
                    Mo
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max={tenureType === 'years' ? 30 : 360}
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl text-center space-y-6">
            <div>
              <p className="text-emerald-300 font-medium mb-1 uppercase tracking-widest text-xs">Monthly EMI</p>
              <h2 className="text-5xl font-bold text-white">{formatCurrency(emi)}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-500/20">
              <div className="text-left">
                <p className="text-xs text-white/40 mb-1">Principal Amount</p>
                <p className="text-lg font-bold text-white">{formatCurrency(loanAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 mb-1">Total Interest</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalInterest)}</p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-white/40 mb-1">Total Amount Payable</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalPayment)}</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Interest vs Principal
              </h4>
              <span className="text-xs text-emerald-400 font-bold">{interestPercentage.toFixed(1)}% Interest</span>
            </div>
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-white/60" 
                style={{ width: `${100 - interestPercentage}%` }}
                title="Principal"
              />
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${interestPercentage}%` }}
                title="Interest"
              />
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-[10px] text-white/40">Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-white/40">Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
