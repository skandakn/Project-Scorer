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
import { useProject } from '@/lib/store/projectContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Terminal,
  Palette,
  Lightbulb,
  TrendingUp,
  Flame,
  FileText,
  Mic,
  ArrowRight,
  GitBranch,
  Star,
  GitFork,
  GitCommit,
  FileCode2,
  ExternalLink,
} from 'lucide-react';

export default function EvaluationPage() {
  const { activeProject, activeEvaluation } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
          Loading evaluation data...
        </div>
      </div>
    );
  }

  const gh = activeEvaluation.technicalAudit.gitHubData;

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
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  AI Evaluation Report
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-semibold">
                  v{activeProject.version}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {activeProject.name} — Full Assessment
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Evaluated using {activeEvaluation.rubricName}. Deterministic scoring breakdown.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href={`/report/${activeProject.id}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Printable Report</span>
              </Link>

              <Link
                href="/judge-attack"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Challenge With Judges</span>
              </Link>
            </div>
          </div>

          {/* Verified Empirical GitHub Signals Card */}
          {gh && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {gh.ownerAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gh.ownerAvatar}
                    alt={gh.owner || 'Owner'}
                    className="w-11 h-11 rounded-full border border-cyan-500/40 object-cover"
                  />
                ) : (
                  <FileCode2 className="w-9 h-9 text-cyan-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Empirical Signals Verified from GitHub API
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-base font-black text-white">{gh.repoName || activeProject.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="font-mono text-cyan-300">{gh.primaryLanguage}</span>
                    <span>•</span>
                    <span>{gh.stars} stars</span>
                    <span>•</span>
                    <span>{gh.forks} forks</span>
                    <span>•</span>
                    <span>{gh.commitCount || 0} commits</span>
                    <span>•</span>
                    <span>{gh.fileStats?.totalFiles || 0} files</span>
                    {gh.isDefaultReadme && (
                      <span className="text-amber-400 font-semibold">• README is default boilerplate</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <Link
                  href="/technical-audit"
                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Inspect Code & Manifest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Overall Assessment Score Indicator */}
          <ScoreGauge
            score={activeEvaluation.overallScore}
            readinessLevel={activeEvaluation.readinessLevel}
            summaryStatus={activeEvaluation.summary}
          />

          {/* Core Structured Review Findings (Requirement 27) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Review Findings */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Technical Review Findings</span>
                </div>
                <Link
                  href="/technical-audit"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  Full Audit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
                {activeEvaluation.technicalAudit.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
                {activeEvaluation.technicalAudit.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UI/UX Review Findings */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Palette className="w-4 h-4" />
                  <span>UI/UX Review Findings</span>
                </div>
                <Link
                  href="/ui-audit"
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                >
                  Full Audit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
                {activeEvaluation.uiAudit.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
                {activeEvaluation.uiAudit.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Innovation Review */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Innovation & Differentiation</span>
                </div>
                <Link
                  href="/idea-analyzer"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  Deep Dive <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Core Innovation:</strong>{' '}
                  {activeEvaluation.ideaAnalysis.innovation}
                </p>
                <p>
                  <strong className="text-white">Moat:</strong>{' '}
                  {activeEvaluation.ideaAnalysis.defensibility}
                </p>
              </div>
            </div>

            {/* Impact & Pitch Review */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Mic className="w-4 h-4" />
                  <span>Pitch Coaching & Impact</span>
                </div>
                <Link
                  href="/pitch-coach"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Generate Scripts <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Market Potential:</strong>{' '}
                  {activeEvaluation.ideaAnalysis.marketPotential}
                </p>
                <p>
                  <strong className="text-white">Story Structure:</strong>{' '}
                  {activeEvaluation.presentationReview.storyStructure}
                </p>
              </div>
            </div>
          </div>

          {/* Radar Chart + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 h-full">
              <RadarChartCard categoryScores={activeEvaluation.categoryScores} />
            </div>
            <div className="lg:col-span-7">
              <CategoryBreakdown categoryScores={activeEvaluation.categoryScores} />
            </div>
          </div>

          {/* Prioritized Improvements */}
          <PriorityRoadmap improvements={activeEvaluation.improvements} />
        </main>
      </div>
    </div>
  );
}
