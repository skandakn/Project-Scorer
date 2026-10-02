'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  GitBranch,
  Star,
  GitFork,
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Database,
  Lock,
} from 'lucide-react';

export default function TechnicalAuditPage() {
  const { activeProject, activeEvaluation } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const { technicalAudit } = activeEvaluation;
  const metrics = [
    { label: 'Architecture', score: technicalAudit.architecture, desc: 'Component separation & service boundaries' },
    { label: 'Security', score: technicalAudit.security, desc: 'Authentication, input sanitization & secrets' },
    { label: 'Scalability', score: technicalAudit.scalability, desc: 'Stateless compute & DB index capacity' },
    { label: 'Code Quality', score: technicalAudit.codeQuality, desc: 'Structure, types, and modular design' },
    { label: 'Testing', score: technicalAudit.testing, desc: 'Unit, integration & regression smoke tests' },
    { label: 'Documentation', score: technicalAudit.documentation, desc: 'README clarity & setup instructions' },
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
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Deep Technical Inspection
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Technical Audit & Repository Analysis
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Evaluating architecture, code organization, security boundaries, and live repository
              signals.
            </p>
          </div>

          {/* Six Core Metrics (Requirement 10) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((m) => (
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
                        ? 'bg-emerald-400'
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

          {/* GitHub Repository Verification Card */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <FileCode2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    GitHub Repository Signals
                  </h3>
                  <span className="text-xs text-gray-400">
                    {technicalAudit.gitHubData?.repoName || activeProject.githubUrl || 'No public repository attached'}
                  </span>
                </div>
              </div>

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold transition-colors border border-white/10 self-start sm:self-auto"
                >
                  <span>Open GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {technicalAudit.gitHubData ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Stars</span>
                    <span className="font-bold text-white text-sm">
                      {technicalAudit.gitHubData.stars}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Forks</span>
                    <span className="font-bold text-white text-sm">
                      {technicalAudit.gitHubData.forks}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Primary Language</span>
                    <span className="font-bold text-white text-sm truncate">
                      {technicalAudit.gitHubData.primaryLanguage}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Commit Activity</span>
                    <span className="font-bold text-white text-sm">
                      {technicalAudit.gitHubData.commitCount || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                Notice: Repository public metadata could not be fetched or repository is private.
                Analysis is derived from self-reported tech stack architecture.
              </div>
            )}
          </div>

          {/* Key Findings List */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Diagnostic Key Findings</span>
            </h3>

            <div className="space-y-3">
              {technicalAudit.keyFindings?.map((finding, idx) => {
                const isGood = finding.severity === 'good';
                const isWarning = finding.severity === 'warning';
                const isCritical = finding.severity === 'critical';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                      isGood
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
                        : isWarning
                        ? 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-200'
                    }`}
                  >
                    {isGood ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-0.5">
                      <span className="font-bold text-white block text-sm">{finding.title}</span>
                      <p className="leading-relaxed opacity-90">{finding.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
