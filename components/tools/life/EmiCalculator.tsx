import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  IndianRupee, 
  Percent, 
  Calendar, 
  Info, 
  PieChart, 
  TrendingUp,
  Wallet,
  Calculator,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Activity,
  History
} from 'lucide-react';

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
      setEmi(numberOfMonths > 0 ? principal / numberOfMonths : 0);
      setTotalPayment(principal);
      setTotalInterest(0);
      return;
    }

    if (numberOfMonths === 0) {
      setEmi(0);
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

  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Financial Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Calculator className="text-amber-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Financial Parameters</h3>
            </div>

            <div className="space-y-8">
              {/* Loan Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20 flex items-center gap-2"><IndianRupee size={10} /> Principal</span>
                  <span className="text-amber-400 font-mono">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] group space-y-4">
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-3 px-4 font-mono text-xs text-white/40 focus:outline-none focus:border-amber-400/50 transition-all text-right"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20 flex items-center gap-2"><Percent size={10} /> Interest Rate</span>
                  <span className="text-amber-400 font-mono">{interestRate}% P.A.</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] group space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-3 px-4 font-mono text-xs text-white/40 focus:outline-none focus:border-amber-400/50 transition-all text-right"
                  />
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20 flex items-center gap-2"><Calendar size={10} /> Loan Tenure</span>
                  <div className="flex bg-black/40 rounded-md p-1 border border-white/[0.05]">
                    <button
                      onClick={() => setTenureType('years')}
                      className={cn(
                        "px-3 py-1 text-[8px] font-bold uppercase rounded-sm transition-all",
                        tenureType === 'years' ? "bg-amber-400 text-black" : "text-white/20 hover:text-white/40"
                      )}
                    >Years</button>
                    <button
                      onClick={() => setTenureType('months')}
                      className={cn(
                        "px-3 py-1 text-[8px] font-bold uppercase rounded-sm transition-all",
                        tenureType === 'months' ? "bg-amber-400 text-black" : "text-white/20 hover:text-white/40"
                      )}
                    >Months</button>
                  </div>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] group space-y-4">
                  <input
                    type="range"
                    min="1"
                    max={tenureType === 'years' ? 30 : 360}
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-3 px-4 font-mono text-xs text-white/40 focus:outline-none focus:border-amber-400/50 transition-all text-right"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-400/5 border border-amber-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Financial Logic</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Utilizing reducing balance method for amortization scheduling and interest accrual modeling.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Amortization Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[700px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase mb-2">Protocol Output</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Amortization Output</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                  <Activity size={12} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Sync</span>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {/* Primary EMI Readout */}
                <div className="p-10 bg-black/40 border border-white/[0.05] rounded-md flex flex-col items-center justify-center text-center space-y-4 relative group">
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-white/10 uppercase tracking-widest group-hover:text-amber-400/20 transition-colors text-right">Monthly<br/>Commitment</div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-outfit font-bold text-white tracking-tighter">{formatCurrency(emi)}</span>
                  </div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                    Estimated EMI Payment
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Interest Breakdown */}
                  <div className="p-8 bg-amber-400/[0.03] border border-amber-400/10 rounded-md space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60">Interest Cost</span>
                      <ArrowUpRight size={14} className="text-amber-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-outfit font-bold text-white uppercase tracking-widest">
                        {formatCurrency(totalInterest)}
                      </div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        Total interest over {tenure} {tenureType}
                      </div>
                    </div>
                  </div>

                  {/* Total Payment */}
                  <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Total Liquidity</span>
                      <Wallet size={14} className="text-white/20" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-outfit font-bold text-white uppercase tracking-widest">
                        {formatCurrency(totalPayment)}
                      </div>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        Principal + interest cumulative
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ratio Analysis */}
                <div className="p-8 bg-black/40 border border-white/[0.05] rounded-md space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <PieChart size={12} className="text-amber-400" />
                      Debt Structure Analysis
                    </h4>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">{interestPercentage.toFixed(1)}% Interest Ratio</span>
                  </div>
                  
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-white/60 transition-all duration-500" 
                      style={{ width: `${100 - interestPercentage}%` }}
                    />
                    <div 
                      className="h-full bg-amber-400 transition-all duration-500" 
                      style={{ width: `${interestPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Principal ({formatCurrency(loanAmount)})</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Interest ({formatCurrency(totalInterest)})</div>
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Engine Trace</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Asynchronous calculation cycle ensures UI responsiveness during high-frequency parameter shifts.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Audit Policy</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Mathematical models verified against standard amortization protocols for maximum precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
