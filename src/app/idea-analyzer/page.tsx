'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  Lightbulb,
  ShieldCheck,
  Target,
  Sparkles,
  Layers,
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function IdeaAnalyzerPage() {
  const { activeProject, activeEvaluation } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const { ideaAnalysis } = activeEvaluation;

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
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Product & Market Validation
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Idea Strength & Defensibility Evaluator
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Analyzing problem severity, market differentiation, innovation depth, and competitive
              defensibility.
            </p>
          </div>

          {/* Three Core Idea Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Problem Definition</span>
                <span className="text-amber-400 font-bold">
                  {ideaAnalysis.problemClarityScore} / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${ideaAnalysis.problemClarityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Measures clarity, pain severity, and target audience focus.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Solution Directness</span>
                <span className="text-cyan-400 font-bold">
                  {ideaAnalysis.solutionAlignmentScore} / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${ideaAnalysis.solutionAlignmentScore}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Evaluates how directly the MVP solves the stated pain point.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Innovation & Novelty</span>
                <span className="text-purple-400 font-bold">
                  {ideaAnalysis.innovationScore} / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-400"
                  style={{ width: `${ideaAnalysis.innovationScore}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Uniqueness versus existing market alternatives and wrappers.
              </p>
            </div>
          </div>

          {/* Deep Idea Evaluation Sections (Requirement 11) */}
          <div className="space-y-4">
            {/* 1. Problem */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Target className="w-4 h-4" />
                <span>1. Problem Definition & Target Audience</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300">
                <p>
                  <strong className="text-white">Severity Assessment:</strong>{' '}
                  {ideaAnalysis.problemSeverity}
                </p>
                <p>
                  <strong className="text-white">Validated Target Users:</strong>{' '}
                  {ideaAnalysis.targetAudience}
                </p>
              </div>
            </div>

            {/* 2. Solution & Differentiation */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>2. Solution, Innovation & Differentiation</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300">
                <p>
                  <strong className="text-white">What is actually new?</strong>{' '}
                  {ideaAnalysis.innovation}
                </p>
                <p>
                  <strong className="text-white">Differentiation:</strong>{' '}
                  {ideaAnalysis.differentiation}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-gray-400 block mb-1">
                    Existing Market Alternatives Considered:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ideaAnalysis.existingAlternatives?.map((alt, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs text-gray-300"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Defensibility & Market Potential */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>3. Defensibility & Real-World Usefulness</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300">
                <p>
                  <strong className="text-white">Competitive Moat:</strong>{' '}
                  {ideaAnalysis.defensibility}
                </p>
                <p>
                  <strong className="text-white">Market Potential:</strong>{' '}
                  {ideaAnalysis.marketPotential}
                </p>
                <p>
                  <strong className="text-white">Engineering Feasibility:</strong>{' '}
                  {ideaAnalysis.feasibility}
                </p>
              </div>
            </div>

            {/* 4. What Judges Will Challenge (Weaknesses) */}
            <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>4. What Judges Could Challenge (Potential Weaknesses)</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-200/90 leading-relaxed">
                {ideaAnalysis.weaknessesJudgesWillChallenge?.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
