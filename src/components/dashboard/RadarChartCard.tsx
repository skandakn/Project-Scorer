'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CategoryScore } from '@/lib/types';
import { Activity } from 'lucide-react';

interface RadarChartCardProps {
  categoryScores: CategoryScore[];
}

export default function RadarChartCard({ categoryScores }: RadarChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format data for Recharts (scale to 100 for visual uniformity)
  const chartData = categoryScores.map((c) => ({
    category: c.category.length > 18 ? c.category.slice(0, 16) + '...' : c.category,
    fullName: c.category,
    score: Math.round((c.score / c.maxScore) * 100),
    rawScore: `${c.score} / ${c.maxScore}`,
  }));

  if (!isMounted) {
    return (
      <div className="p-6 rounded-3xl glass-panel border border-white/10 h-[380px] flex items-center justify-center">
        <span className="text-xs text-gray-500">Loading Radar Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl glass-panel border border-white/10 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Rubric Alignment Radar
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-gray-400">
          Normalized to 100%
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-cyan-500/30 shadow-xl text-xs">
                      <p className="font-bold text-white mb-1">{data.fullName}</p>
                      <p className="text-cyan-400 font-semibold">
                        Alignment: {data.score}% ({data.rawScore})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Project Alignment"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
        <span>Inner: Baseline</span>
        <span className="text-cyan-400 font-semibold">Outer Ring: 100% Mastery</span>
      </div>
    </div>
  );
}
