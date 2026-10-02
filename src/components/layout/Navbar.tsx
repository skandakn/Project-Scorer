'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProject } from '@/lib/store/projectContext';
import {
  Sparkles,
  PlusCircle,
  AlertTriangle,
  FolderGit2,
  ChevronDown,
  Gavel,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { projects, activeProjectId, setActiveProjectId, toggleEmergencyDemo, activeEvaluation } =
    useProject();

  const isLandingPage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070a13]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                HackScore
              </span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase tracking-wider">
                AI
              </span>
            </div>
          </Link>

          {!isLandingPage && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/projects')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                My Projects
              </Link>
              <Link
                href="/judge-mode"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname === '/judge-mode'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-purple-400" />
                Judge Mode
              </Link>
            </nav>
          )}
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {!isLandingPage && (
            <>
              {/* Active Project Switcher */}
              <div className="relative hidden sm:block">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-gray-300">
                  <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-gray-400 hidden lg:inline">Active:</span>
                  <select
                    value={activeProjectId}
                    onChange={(e) => setActiveProjectId(e.target.value)}
                    className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none cursor-pointer pr-4"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.name} ({p.hackathonName})
                      </option>
                    ))}
                  </select>
                  {activeEvaluation && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        activeEvaluation.overallScore >= 85
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : activeEvaluation.overallScore >= 75
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {activeEvaluation.overallScore}/100
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Demo Button */}
              <button
                type="button"
                onClick={() => toggleEmergencyDemo(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/10 active:scale-95"
                title="Open Emergency Backup Demo tools if live demo fails"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Demo Emergency</span>
              </button>
            </>
          )}

          {/* New Analysis CTA */}
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Analyze Project</span>
          </Link>

          {/* Settings / Rubrics */}
          <Link
            href="/rubric-builder"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
            title="Judging Rubric Builder"
          >
            <Sliders className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
