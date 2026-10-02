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
  GitCommit,
  Users,
  Package,
  BookOpen,
  Code,
  Calendar,
  Check,
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
  const gh = technicalAudit.gitHubData;

  const metrics = [
    { label: 'Architecture', score: technicalAudit.architecture, desc: 'Component separation & service boundaries' },
    { label: 'Security', score: technicalAudit.security, desc: 'Authentication, input sanitization & secrets' },
    { label: 'Scalability', score: technicalAudit.scalability, desc: 'Stateless compute & DB index capacity' },
    { label: 'Code Quality', score: technicalAudit.codeQuality, desc: 'Structure, types, and modular design' },
    { label: 'Testing', score: technicalAudit.testing, desc: 'Unit, integration & regression smoke tests' },
    { label: 'Documentation', score: technicalAudit.documentation, desc: 'README clarity & setup instructions' },
  ];

  const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Python: '#3572A5',
    Go: '#00ADD8',
    Rust: '#dea584',
    Shell: '#89e051',
  };

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
              Technical Audit & Empirical Repository Analysis
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Real-time inspection of source files, dependencies, commit history, schema models, and tests.
            </p>
          </div>

          {/* Six Core Metrics */}
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

          {/* REAL GitHub Repository Verification Card */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                {gh?.ownerAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gh.ownerAvatar}
                    alt={gh.owner || 'Owner'}
                    className="w-10 h-10 rounded-full border border-cyan-500/30 object-cover"
                  />
                ) : (
                  <FileCode2 className="w-8 h-8 text-cyan-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">
                      {gh?.repoName || activeProject.githubUrl || 'Repository'}
                    </h3>
                    {gh?.license && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 font-mono">
                        {gh.license}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {gh?.description || 'Public GitHub repository'}
                  </p>
                </div>
              </div>

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold transition-colors border border-white/10 self-start sm:self-auto"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {gh ? (
              <>
                {/* Real Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Stars</span>
                    <span className="font-black text-amber-400 text-base">{gh.stars}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Forks</span>
                    <span className="font-black text-cyan-400 text-base">{gh.forks}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Total Commits</span>
                    <span className="font-black text-purple-400 text-base">{gh.commitCount || 0}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Total Files</span>
                    <span className="font-black text-emerald-400 text-base">{gh.fileStats?.totalFiles || 0}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Code Files</span>
                    <span className="font-black text-blue-400 text-base">{gh.fileStats?.codeFiles || 0}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">Default Branch</span>
                    <span className="font-black text-white text-base font-mono">{gh.defaultBranch || 'main'}</span>
                  </div>
                </div>

                {/* Real Languages Breakdown */}
                {gh.languagesDetailed && gh.languagesDetailed.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-300">Languages Breakdown (Empirical Bytes)</span>
                      <span className="text-cyan-400 font-mono">
                        {gh.languagesDetailed[0]?.name} ({gh.languagesDetailed[0]?.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                      {gh.languagesDetailed.map((l) => (
                        <div
                          key={l.name}
                          style={{
                            width: `${l.percentage}%`,
                            backgroundColor: languageColors[l.name] || '#64748b',
                          }}
                          className="h-full transition-all"
                          title={`${l.name}: ${l.percentage}% (${(l.bytes / 1024).toFixed(1)} KB)`}
                        />
                      ))}
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-3 text-xs">
                      {gh.languagesDetailed.map((l) => (
                        <div key={l.name} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: languageColors[l.name] || '#64748b' }}
                          />
                          <span className="text-white font-medium">{l.name}</span>
                          <span className="text-gray-400 font-mono text-[11px]">{l.percentage}%</span>
                          <span className="text-gray-500 text-[10px]">({(l.bytes / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Manifest Dependencies (from package.json) */}
                {gh.dependencies && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Production Dependencies */}
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Production Packages ({Object.keys(gh.dependencies.production).length})</span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">package.json</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {Object.entries(gh.dependencies.production).map(([name, ver]) => (
                          <div
                            key={name}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/5 text-[11px] font-mono flex items-center gap-1.5"
                          >
                            <span className="text-white">{name}</span>
                            <span className="text-cyan-400 opacity-80">{ver}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Scripts */}
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-purple-400" />
                          <span>Package Scripts ({Object.keys(gh.dependencies.scripts).length})</span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">npm run &lt;script&gt;</span>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {Object.entries(gh.dependencies.scripts).map(([script, cmd]) => (
                          <div
                            key={script}
                            className="p-2 rounded-lg bg-slate-900/80 border border-white/5 text-xs font-mono flex items-center justify-between gap-2"
                          >
                            <span className="text-purple-300 font-bold shrink-0">{script}</span>
                            <span className="text-gray-400 text-[11px] truncate">{cmd}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Database Schema (Prisma) */}
                {gh.database && gh.database.models && gh.database.models.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Database Schema & Models ({gh.database.orm})</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">
                        Engine: {gh.database.provider}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gh.database.models.map((model) => (
                        <div
                          key={model}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300"
                        >
                          model {model}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Recent Commits Timeline */}
                {gh.commits && gh.commits.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Verified Commit History (Latest {gh.commits.length})</span>
                      </span>
                      <span className="text-gray-400 font-mono text-[11px]">GitHub REST API</span>
                    </div>
                    <div className="space-y-2">
                      {gh.commits.slice(0, 5).map((c) => (
                        <div
                          key={c.sha}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] shrink-0">
                              {c.sha}
                            </span>
                            <span className="text-gray-200 font-medium truncate">{c.message}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 shrink-0">
                            <span>{c.author}</span>
                            {c.date && <span>• {new Date(c.date).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Contributors */}
                {gh.contributors && gh.contributors.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Repository Contributors</span>
                      </span>
                      <span className="text-gray-400 text-[11px]">{gh.contributors.length} verified developer(s)</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {gh.contributors.map((contrib) => (
                        <a
                          key={contrib.login}
                          href={contrib.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/20 transition-all text-xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={contrib.avatar}
                            alt={contrib.login}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-white font-bold font-mono">{contrib.login}</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">
                            {contrib.contributions} {contrib.contributions === 1 ? 'commit' : 'commits'}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
              <span>Diagnostic Key Findings & Evidence</span>
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
