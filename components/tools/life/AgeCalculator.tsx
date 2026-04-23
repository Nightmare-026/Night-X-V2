'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Gift, Hourglass, ArrowRight } from 'lucide-react';

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
    nextBirthday: { months: number; days: number };
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

    // Total stats
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
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
      nextBirthday: { months: bdayMonths, days: bdayRemainingDays }
    });
  }, [dob, targetDate]);

  useEffect(() => {
    if (dob) calculateAge();
  }, [dob, targetDate, calculateAge]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Age at Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-white"
            />
          </div>
        </div>

        <AnimatePresence>
          {age && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Gift className="w-24 h-24" />
              </div>
              <p className="text-pink-300 font-medium mb-2 uppercase tracking-widest text-xs">Current Age</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-white">{age.years}</span>
                <span className="text-2xl text-white/60">years</span>
              </div>
              <div className="mt-4 flex gap-4 text-white/80">
                <span>{age.months} months</span>
                <span>•</span>
                <span>{age.days} days</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {age && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-pink-400 mb-4">
                <Gift className="w-5 h-5" />
                <h4 className="font-bold">Next Birthday</h4>
              </div>
              <div className="text-2xl font-bold text-white">
                {age.nextBirthday.months} months, {age.nextBirthday.days} days
              </div>
              <p className="text-sm text-white/40">Remaining until next celebration</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <Hourglass className="w-5 h-5" />
                <h4 className="font-bold">Life Summary</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-white/40 uppercase">Total Weeks</p>
                  <p className="text-xl font-bold text-white">{age.totalWeeks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">Total Days</p>
                  <p className="text-xl font-bold text-white">{age.totalDays.toLocaleString()}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-white/40 uppercase">Total Hours</p>
                  <p className="text-xl font-bold text-white">{age.totalHours.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!age && !dob && (
        <div className="py-20 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
          <Calendar className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Select your birth date to start</p>
        </div>
      )}
    </div>
  );
}
