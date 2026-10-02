'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { GitCompare, ArrowRight, TrendingUp, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function ComparePage() {
  const { projects, evaluations, selectedCompareA, selectedCompareB, setSelectedCompareA, setSelectedCompareB } = useProject();

  const projectA = projects.find((p) => p.id === selectedCompareA) || projects[0];
  const projectB = projects.find((p) => p.id === selectedCompareB) || projects[1] || projects[0];

  const evalA = evaluations[projectA?.id];
  const evalB = evaluations[projectB?.id];

  const categories = [
    { name: 'Overall Score', scoreA: evalA?.overallScore || 70, scoreB: evalB?.overallScore || 85 },
    { name: 'Technical Implementation', scoreA: evalA?.technicalAudit.architecture || 72, scoreB: evalB?.technicalAudit.architecture || 88 },
    { name: 'UI/UX Polish', scoreA: evalA?.uiAudit.overallScore || 68, scoreB: evalB?.uiAudit.overallScore || 86 },
    { name: 'Innovation & Differentiation', scoreA: evalA?.ideaAnalysis.innovationScore || 74, scoreB: evalB?.ideaAnalysis.innovationScore || 89 },
    { name: 'Presentation & Story', scoreA: evalA?.presentationReview.score || 65, scoreB: evalB?.presentationReview.score || 86 },
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
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Comparative Analytics
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Project Version Comparison</h1>
            <p className="text-xs text-gray-400 mt-1">
              Compare two versions or two different projects side-by-side to understand score progression.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl glass-panel space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Baseline (Version A)
              </span>
              <select
                value={selectedCompareA}
                onChange={(e) => setSelectedCompareA(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (v{p.version})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl glass-panel space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Iterated (Version B)
              </span>
              <select
                value={selectedCompareB}
                onChange={(e) => setSelectedCompareB(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (v{p.version})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table (Requirement 19) */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="grid grid-cols-12 text-xs font-bold text-gray-400 pb-3 border-b border-white/5">
              <span className="col-span-6">Evaluation Category</span>
              <span className="col-span-2 text-center">{projectA.name} (A)</span>
              <span className="col-span-2 text-center text-cyan-400">{projectB.name} (B)</span>
              <span className="col-span-2 text-right">Delta</span>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => {
                const delta = cat.scoreB - cat.scoreA;
                return (
                  <div
                    key={cat.name}
                    className="grid grid-cols-12 items-center p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                  >
                    <span className="col-span-6 font-bold text-white truncate">{cat.name}</span>
                    <span className="col-span-2 text-center font-mono font-semibold text-gray-300">
                      {cat.scoreA}
                    </span>
                    <span className="col-span-2 text-center font-mono font-black text-cyan-400">
                      {cat.scoreB}
                    </span>
                    <span
                      className={`col-span-2 text-right font-black ${
                        delta > 0
                          ? 'text-emerald-400'
                          : delta < 0
                          ? 'text-rose-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Three Diagnostic Answers (Requirement 19) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                What Changed?
              </span>
              <p className="text-xs text-cyan-100/90 leading-relaxed">
                Integrated structured microservices, added live test assertions, and improved responsive layout for judges.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                What Improved?
              </span>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Core demo flow delivers key results in the first 30 seconds, and error handling handles edge cases gracefully.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                What Still Needs Work?
              </span>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Prepare evidence for the two remaining judge attack questions and rehearse pitch within 2 minutes 45 seconds.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
