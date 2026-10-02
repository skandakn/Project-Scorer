'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import ScoreGauge from '@/components/dashboard/ScoreGauge';
import RadarChartCard from '@/components/dashboard/RadarChartCard';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import PriorityRoadmap from '@/components/dashboard/PriorityRoadmap';
import ScoreSimulator from '@/components/dashboard/ScoreSimulator';
import { useProject } from '@/lib/store/projectContext';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Mic,
  Terminal,
  Palette,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ExternalLink,
  FolderGit2,
  Share2,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const { activeProject, activeEvaluation, projects, setActiveProjectId } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-4">
            <p className="text-gray-400">Loading project evaluation...</p>
            <Link href="/submit" className="text-cyan-400 underline font-semibold">
              Or submit a new project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8">
          {/* Top Project Selector & Quick Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/60 border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Current Project View
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                  {activeProject.category}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white">{activeProject.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeProject.hackathonName} • {activeProject.tagline || activeProject.problemStatement.slice(0, 80) + '...'}
              </p>
            </div>

            {/* Quick Demo Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-gray-400 font-semibold mr-1">Switch:</span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    p.id === activeProject.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Overall Score Gauge Section (Requirement 7) */}
          <ScoreGauge
            score={activeEvaluation.overallScore}
            readinessLevel={activeEvaluation.readinessLevel}
            summaryStatus={activeEvaluation.summary}
          />

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Technical Audit', href: '/technical-audit', icon: Terminal, color: 'text-blue-400' },
              { label: 'UI/UX Audit', href: '/ui-audit', icon: Palette, color: 'text-purple-400' },
              { label: 'Idea Analyzer', href: '/idea-analyzer', icon: Lightbulb, color: 'text-amber-400' },
              { label: 'Pitch Coach', href: '/pitch-coach', icon: Mic, color: 'text-emerald-400' },
              { label: 'Judge Attack', href: '/judge-attack', icon: Flame, color: 'text-rose-400', badge: '🔥' },
              { label: 'Report PDF', href: `/report/${activeProject.id}`, icon: FileText, color: 'text-cyan-400' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="p-3.5 rounded-2xl glass-card flex flex-col items-center text-center gap-2 group hover:border-cyan-500/30"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-200 group-hover:text-white flex items-center gap-1">
                    {action.label}
                    {action.badge && <span>{action.badge}</span>}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Middle Row: Radar Chart + High-Level Strengths & Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Radar Chart (5 cols) */}
            <div className="lg:col-span-5 h-full">
              <RadarChartCard categoryScores={activeEvaluation.categoryScores} />
            </div>

            {/* Right: Key Findings (7 cols) */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              {/* Strengths Card */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3–5 Key Strengths Detected</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-200/90 leading-relaxed">
                  {activeEvaluation.strengths.slice(0, 4).map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Weaknesses Card */}
              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Critical Weaknesses to Address</span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-200/90 leading-relaxed">
                  {activeEvaluation.criticalWeaknesses.slice(0, 4).map((weak, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">⚠</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Wins Card */}
              <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Immediate Quick Wins (&lt; 15 mins)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-cyan-200/90 leading-relaxed">
                  {activeEvaluation.quickWins.slice(0, 3).map((win, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">⚡</span>
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Priority Roadmap ("What Should I Fix First?") */}
          <PriorityRoadmap improvements={activeEvaluation.improvements} />

          {/* Section: Category Breakdown */}
          <CategoryBreakdown categoryScores={activeEvaluation.categoryScores} />

          {/* Section: Score Simulator ("How to Improve My Score") */}
          <ScoreSimulator
            currentScore={activeEvaluation.overallScore}
            improvements={activeEvaluation.improvements}
          />
        </main>
      </div>
    </div>
  );
}
