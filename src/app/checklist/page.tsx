'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { CheckSquare, CheckCircle2, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export default function ChecklistPage() {
  const { activeProject, activeEvaluation, updateChecklist } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  // The 15 Checklist Items (Requirement 20)
  const checklistItems = [
    { id: 'problem-clear', label: 'Problem is clearly explained with quantified pain points', category: 'Product' },
    { id: 'solution-demo', label: 'Solution is demonstrated within the first 60 seconds', category: 'Demo' },
    { id: 'working-demo', label: 'Working live demo link is accessible and responsive', category: 'Demo' },
    { id: 'no-broken-links', label: 'No broken links or 404 routes in navigation', category: 'Technical' },
    { id: 'mobile-responsive', label: 'Mobile responsive layout tested on smartphone viewport', category: 'Design' },
    { id: 'strong-opening', label: 'Strong opening hook that commands judge attention', category: 'Presentation' },
    { id: 'clear-architecture', label: 'Clear architecture diagram documented and explainable', category: 'Technical' },
    { id: 'tech-differentiation', label: 'Technical differentiation vs competitors is clearly stated', category: 'Technical' },
    { id: 'measurable-impact', label: 'Measurable impact metrics shown (time, accuracy, cost savings)', category: 'Product' },
    { id: 'real-world-use', label: 'Real-world use case validated with target audience quotes', category: 'Product' },
    { id: 'backup-demo-ready', label: 'Backup demo available (video/screenshots) for Wi-Fi failure', category: 'Demo' },
    { id: 'judge-questions-prepped', label: "Judges' attack questions prepared with rehearsed answers", category: 'Presentation' },
    { id: 'pitch-rehearsed', label: 'Presentation rehearsed with strict teleprompter timing', category: 'Presentation' },
    { id: 'deployment-stable', label: 'Deployment is stable with SSL certificate (HTTPS)', category: 'Technical' },
    { id: 'readme-complete', label: 'README complete with 3-step local setup instructions', category: 'Technical' },
  ];

  const statusMap = activeEvaluation.checklistStatus || {};
  const completedCount = checklistItems.filter((item) => statusMap[item.id]).length;
  const percentage = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="pb-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  Pre-Judging Audit
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Judge-Ready Win Checklist
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                The 15 critical milestones required before presenting to the judging panel.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Readiness Progress
                </span>
                <span className="text-xl font-black text-white">
                  {completedCount} / {checklistItems.length}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-2xl font-black ${
                    percentage >= 80 ? 'text-emerald-400' : 'text-cyan-400'
                  }`}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
              <span>Overall Completion Status</span>
              <span>
                {percentage === 100
                  ? 'All 15 Criteria Met — Fully Judge Ready!'
                  : `${checklistItems.length - completedCount} items remaining`}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage === 100
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            {checklistItems.map((item) => {
              const isChecked = !!statusMap[item.id];

              return (
                <label
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => updateChecklist(item.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                    <span
                      className={`text-xs font-semibold truncate ${
                        isChecked ? 'line-through text-gray-400' : 'text-gray-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0 hidden sm:inline">
                    {item.category}
                  </span>
                </label>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
