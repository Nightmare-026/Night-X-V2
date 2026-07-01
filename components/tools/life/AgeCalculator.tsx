import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  Gift, 
  Hourglass, 
  ArrowRight,
  Timer,
  Cake,
  History,
  Activity,
  Fingerprint,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalHours: number;
    nextBirthday: { months: number; days: number; totalDays: number };
  } | null>(null);

  const calculateAge = useCallback(() => {
    if (!dob) return;

    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (birth > target) {
      setAge(null);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }

    let bdayDiff = nextBday.getTime() - target.getTime();
    let bdayDays = Math.ceil(bdayDiff / (1000 * 60 * 60 * 24));
    
    let bdayMonths = Math.floor(bdayDays / 30.44);
    let bdayRemainingDays = Math.floor(bdayDays % 30.44);

    setAge({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      nextBirthday: { months: bdayMonths, days: bdayRemainingDays, totalDays: bdayDays }
    });
  }, [dob, targetDate]);

  useEffect(() => {
    if (dob) calculateAge();
  }, [dob, targetDate, calculateAge]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Temporal Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Timer className="text-amber-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Temporal Parameters</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Calendar size={10} /> Date of Birth
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md py-4 px-6 font-mono text-sm text-white/80 focus:outline-none focus:border-amber-400/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Clock size={10} /> Reference Date
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md py-4 px-6 font-mono text-sm text-white/80 focus:outline-none focus:border-amber-400/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-400/5 border border-amber-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <Cake size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Birthday Logic</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Calculates precise age intervals including leap years and month-day normalization protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Chronological Analysis */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase mb-2">Protocol Output</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Chronological Analysis</h2>
                </div>
                
                {age && (
                  <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                    <Activity size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Calculated</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-8">
                {age ? (
                  <div className="space-y-8">
                    {/* Primary Age Readout */}
                    <div className="p-10 bg-black/40 border border-white/[0.05] rounded-md flex flex-col items-center justify-center text-center space-y-4 relative group">
                      <div className="absolute top-4 right-4 text-[10px] font-bold text-white/10 uppercase tracking-widest group-hover:text-amber-400/20 transition-colors">Current Age</div>
                      <div className="flex items-baseline gap-4">
                        <span className="text-7xl font-outfit font-bold text-white tracking-tighter">{age.years}</span>
                        <span className="text-xl font-outfit font-bold text-white/20 uppercase tracking-widest">Years</span>
                      </div>
                      <div className="flex gap-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                        <span>{age.months} Months</span>
                        <span className="text-white/10">•</span>
                        <span>{age.days} Days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Next Birthday */}
                      <div className="p-8 bg-amber-400/[0.03] border border-amber-400/10 rounded-md space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60">Next Event</span>
                          <Gift size={14} className="text-amber-400" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-outfit font-bold text-white uppercase tracking-widest">
                            {age.nextBirthday.totalDays} <span className="text-xs text-white/20">Days Remaining</span>
                          </div>
                          <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                            {age.nextBirthday.months}M {age.nextBirthday.days}D until next cycle
                          </div>
                        </div>
                      </div>

                      {/* Summary Grid */}
                      <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Life Metrics</span>
                          <History size={14} className="text-white/20" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white/80">{age.totalWeeks.toLocaleString()}</div>
                            <div className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Weeks</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white/80">{age.totalDays.toLocaleString()}</div>
                            <div className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-6 py-20">
                    <div className="p-8 rounded-full bg-white/[0.02] border border-white/[0.05]">
                      <Fingerprint size={48} className="opacity-10" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Awaiting Temporal Data</p>
                      <p className="text-[9px] uppercase tracking-widest text-white/5">Input birth date to initialize analysis</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Latency Trace</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Real-time date diff calculations executed on client-side JS engine with sub-10ms latency.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Data Privacy</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    All chronological processing is local. No personal temporal data is transmitted to servers.
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
