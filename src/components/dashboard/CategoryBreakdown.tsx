'use client';

import React, { useState } from 'react';
import { CategoryScore } from '@/lib/types';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface CategoryBreakdownProps {
  categoryScores: CategoryScore[];
}

export default function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Detailed Rubric Breakdown
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Individual category scores, detected problems, evidence, and actionable recommendations.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 self-start sm:self-auto">
          {categoryScores.length} Categories Evaluated
        </span>
      </div>

      <div className="space-y-3">
        {categoryScores.map((cat, idx) => {
          const isExpanded = expandedIndex === idx;
          const percentage = Math.round((cat.score / cat.maxScore) * 100);

          return (
            <div
              key={cat.category}
              className={`rounded-2xl transition-all border ${
                isExpanded
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-lg shadow-black/40'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Category Header Row */}
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left focus:outline-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white truncate">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">
                        {cat.score}{' '}
                        <span className="text-xs text-gray-400 font-normal">/ {cat.maxScore}</span>
                      </span>
                      {cat.potentialScore && cat.potentialScore > cat.score && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Potential: {cat.score} <ArrowRight className="w-2.5 h-2.5" /> {cat.potentialScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        percentage >= 85
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : percentage >= 70
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs animate-in fade-in duration-200">
                  {/* Explanation & Evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                        Evaluation Explanation
                      </span>
                      <p className="text-gray-300 leading-relaxed">{cat.explanation}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                        Observed Evidence
                      </span>
                      <p className="text-gray-300 leading-relaxed">{cat.evidence}</p>
                    </div>
                  </div>

                  {/* Problems Detected */}
                  {cat.problems && cat.problems.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Problems Detected
                      </span>
                      <ul className="space-y-1.5">
                        {cat.problems.map((prob, i) => (
                          <li key={i} className="flex items-start gap-2 text-amber-200/90 leading-relaxed">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  {cat.actions && cat.actions.length > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recommended Actions for Points Gain
                      </span>
                      <ul className="space-y-1.5">
                        {cat.actions.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-emerald-200/90 leading-relaxed">
                            <span className="text-emerald-400 font-bold">{i + 1}.</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
