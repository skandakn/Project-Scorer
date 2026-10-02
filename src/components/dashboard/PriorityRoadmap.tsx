'use client';

import React from 'react';
import { ImprovementItem } from '@/lib/types';
import { AlertCircle, Zap, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

interface PriorityRoadmapProps {
  improvements: ImprovementItem[];
}

export default function PriorityRoadmap({ improvements }: PriorityRoadmapProps) {
  const getPriorityBadge = (priority: ImprovementItem['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          label: 'Critical',
          icon: AlertCircle,
          badgeClass: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          dotClass: 'bg-rose-500',
        };
      case 'HIGH':
        return {
          label: 'High Priority',
          icon: AlertCircle,
          badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          dotClass: 'bg-amber-500',
        };
      case 'QUICK_WIN':
        return {
          label: 'Quick Win',
          icon: Zap,
          badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dotClass: 'bg-emerald-500',
        };
      default:
        return {
          label: 'Medium',
          icon: Clock,
          badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
          dotClass: 'bg-cyan-500',
        };
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              What Should I Fix First?
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Ranked by judging impact. Complete critical items first to maximize score potential.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-gray-300 self-start sm:self-auto">
          {improvements.length} Prioritized Actions
        </span>
      </div>

      <div className="space-y-4">
        {improvements.map((item) => {
          const config = getPriorityBadge(item.priority);
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dotClass} animate-pulse`} />
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Category: {item.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Expected Impact:{' '}
                    <span className="text-white font-bold">{item.expectedImpact}</span>
                  </span>
                  {item.estimatedPointGain && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      +{item.estimatedPointGain} pts
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
              </div>

              {/* Problem vs Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">
                    Current Problem:
                  </span>
                  <p className="text-gray-300 leading-relaxed">{item.problem}</p>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                  <span className="text-cyan-400 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Recommended Action:
                  </span>
                  <p className="text-cyan-100/90 leading-relaxed font-medium">{item.action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
