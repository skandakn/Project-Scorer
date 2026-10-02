'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { History, TrendingUp, Sparkles, Award } from 'lucide-react';

export default function HistoryPage() {
  const { activeProject, activeEvaluation } = useProject();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  // Simulated iterative version progression for active project
  const currentScore = activeEvaluation.overallScore;
  const historyData = [
    { version: 'v1.0 (Hackathon Kickoff)', score: Math.max(55, currentScore - 22), date: 'Sep 29, 09:00' },
    { version: 'v1.5 (Initial Prototype)', score: Math.max(62, currentScore - 14), date: 'Sep 30, 02:00' },
    { version: 'v2.0 (Testing & UI Overhaul)', score: Math.max(72, currentScore - 6), date: 'Oct 01, 14:00' },
    { version: `v${activeProject.version}.0 (Current Evaluation)`, score: currentScore, date: 'Oct 02, 12:00' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <History className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Score Trajectory
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Score History & Progression</h1>
            <p className="text-xs text-gray-400 mt-1">
              Tracking HackScore improvements across iterations and commits.
            </p>
          </div>

          {/* Progress Chart Card */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Version Score Progression</h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                +{currentScore - historyData[0].score} pts overall gain
              </span>
            </div>

            {isMounted ? (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="version" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 rounded-xl bg-slate-900/95 border border-cyan-500/30 text-xs shadow-xl">
                              <p className="font-bold text-white mb-0.5">{data.version}</p>
                              <p className="text-gray-400 text-[11px] mb-1">{data.date}</p>
                              <p className="text-cyan-400 font-bold">HackScore: {data.score} / 100</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-gray-500">
                Loading progression chart...
              </div>
            )}
          </div>

          {/* Version Logs */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white">Historical Evaluation Logs</h3>
            <div className="space-y-2.5">
              {historyData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{item.version}</span>
                    <span className="text-[11px] text-gray-400">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-cyan-400">{item.score} pts</span>
                    <span className="text-[10px] font-semibold text-gray-400 px-2 py-0.5 rounded bg-white/5">
                      Archived
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
