'use client';

import React, { useEffect, useState } from 'react';
import { ReadinessLevel } from '@/lib/types';
import { Award, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  readinessLevel: ReadinessLevel;
  summaryStatus: string;
}

export default function ScoreGauge({ score, readinessLevel, summaryStatus }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreTheme = (s: number) => {
    if (s >= 85) {
      return {
        gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
        stroke: '#10b981',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      };
    }
    if (s >= 75) {
      return {
        gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
        stroke: '#06b6d4',
        glow: 'shadow-cyan-500/20',
        badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      };
    }
    if (s >= 60) {
      return {
        gradient: 'from-amber-400 via-orange-500 to-amber-600',
        stroke: '#f59e0b',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      };
    }
    return {
      gradient: 'from-rose-500 via-red-500 to-pink-600',
      stroke: '#f43f5e',
      glow: 'shadow-rose-500/20',
      badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Background radial gradient */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${theme.gradient}`}
      />

      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
        {/* Left: Score Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Foreground Animated Progress */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                HackScore
              </span>
              <div className="flex items-baseline">
                <span
                  className={`text-5xl font-black tracking-tight bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
                >
                  {animatedScore}
                </span>
                <span className="text-gray-500 text-sm font-semibold ml-1">/100</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Evaluation</span>
            </div>
          </div>

          <div
            className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border tracking-wide flex items-center gap-1.5 ${theme.badge}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{readinessLevel}</span>
          </div>
        </div>

        {/* Right: Status and Evidence-Based Analysis */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Evaluation Status
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {readinessLevel === 'Judge Ready'
                ? 'High Judge Alignment — Ready for Competition'
                : readinessLevel === 'Strong Foundation'
                ? 'Strong Project — Targeted Improvements Recommended'
                : readinessLevel === 'Developing'
                ? 'Developing Prototype — Core Features Emerging'
                : 'Foundational Phase — Focused Upgrades Needed'}
            </h2>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-normal bg-black/20 p-4 rounded-2xl border border-white/5">
            {summaryStatus}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-gray-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Deterministic rubric weighting
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Verified evidence signals
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400 italic text-[11px]">
              *AI-assisted diagnostic evaluation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
