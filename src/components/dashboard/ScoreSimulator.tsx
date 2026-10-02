'use client';

import React, { useState } from 'react';
import { ImprovementItem } from '@/lib/types';
import { Sliders, Sparkles, AlertCircle, ArrowUpRight, Check } from 'lucide-react';

interface ScoreSimulatorProps {
  currentScore: number;
  improvements: ImprovementItem[];
}

export default function ScoreSimulator({ currentScore, improvements }: ScoreSimulatorProps) {
  // Simulator checklist state: IDs of checked items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    improvements.forEach((item) => {
      initial[item.id] = false;
    });
    return initial;
  });

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAll = () => {
    const all: Record<string, boolean> = {};
    improvements.forEach((item) => {
      all[item.id] = true;
    });
    setCheckedItems(all);
  };

  const clearAll = () => {
    const none: Record<string, boolean> = {};
    improvements.forEach((item) => {
      none[item.id] = false;
    });
    setCheckedItems(none);
  };

  // Calculate simulated score
  const additionalPoints = improvements.reduce((sum, item) => {
    if (checkedItems[item.id]) {
      return sum + (item.estimatedPointGain || 2);
    }
    return sum;
  }, 0);

  const potentialScore = Math.min(99, currentScore + additionalPoints);
  const potentialRangeMin = Math.min(97, currentScore + Math.floor(additionalPoints * 0.8));
  const potentialRangeMax = Math.min(99, currentScore + Math.ceil(additionalPoints * 1.15));

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Score Improvement Simulator
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Test hypothetical improvements and calculate your estimated score opportunity range.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="px-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 transition-colors"
          >
            Check All
          </button>
          <button
            onClick={clearAll}
            className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Simulator Visualizer Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Current Score */}
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Current Score
            </span>
            <div className="text-4xl font-black text-white">{currentScore}</div>
            <span className="text-xs text-gray-500">Baseline</span>
          </div>

          <div className="flex flex-col items-center text-cyan-400">
            <ArrowUpRight className="w-6 h-6 animate-pulse" />
            {additionalPoints > 0 && (
              <span className="text-xs font-black bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                +{additionalPoints}
              </span>
            )}
          </div>

          {/* Potential Score */}
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Estimated Opportunity
            </span>
            <div className="text-4xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
              {additionalPoints > 0 ? `${potentialRangeMin} – ${potentialRangeMax}` : currentScore}
            </div>
            <span className="text-xs text-gray-400">
              {additionalPoints > 0 ? `Target: ~${potentialScore}` : 'Select items below'}
            </span>
          </div>
        </div>

        {/* Disclaimer Warning */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-sm text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-0.5">
              Estimated Improvement Opportunity
            </strong>
            Score increases reflect algorithmic alignment with standard judging criteria and are
            not guaranteed competition outcomes.
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {improvements.map((item) => {
          const isChecked = !!checkedItems[item.id];

          return (
            <label
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                isChecked
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-white shadow-sm shadow-cyan-500/5'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{item.title}</span>
                  <span className="text-[11px] text-gray-400 truncate block">{item.action}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  +{item.estimatedPointGain} pts
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold hidden sm:inline">
                  {item.expectedImpact} Impact
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
