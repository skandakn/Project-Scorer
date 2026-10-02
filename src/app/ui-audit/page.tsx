'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  Palette,
  Layout,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function UIAuditPage() {
  const { activeProject, activeEvaluation } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const { uiAudit } = activeEvaluation;
  const uiMetrics = [
    { label: 'Visual Design', score: uiAudit.visualDesign, desc: 'Color palette, typography & visual hierarchy' },
    { label: 'Navigation', score: uiAudit.navigation, desc: 'Information architecture & intuitive flow' },
    { label: 'Accessibility', score: uiAudit.accessibility, desc: 'WCAG AA contrast & screen-reader tags' },
    { label: 'Responsiveness', score: uiAudit.responsiveness, desc: 'Viewport scaling & tablet/mobile adaptability' },
    { label: 'Consistency', score: uiAudit.consistency, desc: 'Design tokens, spacing & button styles' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Palette className="w-4 h-4 text-purple-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
                  Design System & UX Review
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                UI/UX Audit & Visual Polish
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Evaluating layout clarity, contrast, responsiveness, accessibility, and user flows.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
              <span className="text-xs text-gray-300 font-semibold">UI/UX Score:</span>
              <span className="text-2xl font-black text-purple-300">
                {uiAudit.overallScore}
                <span className="text-xs text-gray-400 font-normal"> / 100</span>
              </span>
            </div>
          </div>

          {/* Core UI Metrics (Requirement 9) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {uiMetrics.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-2xl glass-card flex flex-col justify-between space-y-2 border border-white/10"
              >
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    {m.label}
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {m.score}
                    <span className="text-xs text-gray-500 font-normal"> / 100</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.score >= 85
                        ? 'bg-purple-400'
                        : m.score >= 70
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Uploaded Screenshots Inspection */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Visual Screenshot Inspection
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-semibold">
                {activeProject.screenshots?.length || 0} Artifacts Submitted
              </span>
            </div>

            {activeProject.screenshots && activeProject.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProject.screenshots.map((src, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Artifact ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-xs text-white">
                        <span className="font-bold block">Screenshot {i + 1}</span>
                        <span className="text-[11px] text-cyan-300">
                          Visual hierarchy & layout verified
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 text-center text-xs text-gray-400">
                No screenshots attached to this project. Upload screenshots in the Submission
                Wizard to unlock pixel-level visual hierarchy checks.
              </div>
            )}
          </div>

          {/* UI/UX Checklist */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>UI/UX Quality Checklist</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {uiAudit.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    item.passed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{item.item}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.passed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {item.passed ? 'PASSED' : 'ACTION REQUIRED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable UI Recommendations */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white">Actionable UI Recommendations</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {uiAudit.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-black">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
