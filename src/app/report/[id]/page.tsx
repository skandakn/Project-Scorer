'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/lib/store/projectContext';
import {
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Terminal,
  Palette,
  Lightbulb,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';

export default function ReportPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const { projects, evaluations, activeProject, activeEvaluation } = useProject();

  const targetProject =
    projects.find((p) => p.id === projectId) || activeProject;
  const targetEval =
    evaluations[targetProject?.id] || activeEvaluation;

  if (!targetProject || !targetEval) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-gray-400">
        Report not found.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-12 font-sans selection:bg-cyan-200">
      {/* Print Trigger Button */}
      <div className="no-print max-w-4xl mx-auto mb-8 flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm">HackScore AI — Official Evaluation Report</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Main Document */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-cyan-700 block mb-1">
              Hackathon Project Evaluation Report
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              {targetProject.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Team: {targetProject.teamName} • {targetProject.hackathonName} (v{targetProject.version})
            </p>
          </div>

          <div className="text-right p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Overall HackScore
            </span>
            <div className="text-4xl font-black text-slate-900">
              {targetEval.overallScore}
              <span className="text-sm text-slate-500 font-normal"> / 100</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {targetEval.readinessLevel}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Executive Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {targetEval.summary}
          </p>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
              Problem Statement
            </span>
            <p className="text-slate-800 leading-relaxed">{targetProject.problemStatement}</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
              Technology Stack
            </span>
            <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
              Frontend: {targetProject.frontendTech?.join(', ')}
              <br />
              Backend: {targetProject.backendTech?.join(', ')}
              <br />
              Storage: {targetProject.databaseTech?.join(', ')}
            </p>
          </div>
        </div>

        {/* Rubric Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Rubric Scores ({targetEval.rubricName})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {targetEval.categoryScores.map((cat) => (
              <div key={cat.category} className="p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 text-xs block truncate">
                  {cat.category}
                </span>
                <span className="text-lg font-black text-slate-900 block">
                  {cat.score} <span className="text-xs text-slate-400 font-normal">/ {cat.maxScore}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Critical Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Key Strengths (3–5 Findings)
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {targetEval.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
              Critical Weaknesses
            </span>
            <ul className="space-y-1.5 text-xs text-rose-900">
              {targetEval.criticalWeaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold">⚠</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Prioritized Improvements */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Top Prioritized Improvements (Fix Before Judging)
          </h3>
          <div className="space-y-2">
            {targetEval.improvements.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {idx + 1}. {item.title} ({item.priority})
                  </span>
                  <span className="text-slate-600 block mt-0.5">{item.action}</span>
                </div>
                <span className="font-black text-cyan-800 shrink-0">
                  +{item.estimatedPointGain} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Judge Attack Questions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Prepared Judge Attack Questions & Answers
          </h3>
          <div className="space-y-2 text-xs">
            {targetEval.judgeObjections.slice(0, 3).map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Q: &ldquo;{q.question}&rdquo;</span>
                <p className="text-slate-700 italic">
                  Suggested Defense: &ldquo;{q.suggestedAnswer}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
          <p>Generated by HackScore AI — The AI Hackathon Judge & Project Coach.</p>
          <p>
            *Scores are diagnostic estimates based on verifiable evidence and configurable rubric
            criteria.
          </p>
        </div>
      </div>
    </div>
  );
}
