'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  Award,
  Terminal,
  Palette,
  Lightbulb,
  Mic,
  Flame,
  TrendingUp,
  Sliders,
  Scale,
  GitCompare,
  History,
  Gavel,
  CheckSquare,
  AlertTriangle,
  FileText,
  Settings,
} from 'lucide-react';
import { useProject } from '@/lib/store/projectContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { activeProject, activeEvaluation, toggleEmergencyDemo } = useProject();

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', href: '/projects', icon: FolderGit2 },
    { label: 'New Analysis', href: '/submit', icon: PlusCircle, badge: 'Wizard' },
    { label: 'AI Evaluation', href: '/evaluation', icon: Award },
    { label: 'Technical Audit', href: '/technical-audit', icon: Terminal },
    { label: 'UI/UX Audit', href: '/ui-audit', icon: Palette },
    { label: 'Idea Analyzer', href: '/idea-analyzer', icon: Lightbulb },
    { label: 'Pitch Coach', href: '/pitch-coach', icon: Mic, badge: 'Audio/Text' },
    { label: 'Judge Attack', href: '/judge-attack', icon: Flame, badge: '🔥 Mock' },
    { label: 'Presentation Review', href: '/presentation-review', icon: FileText },
    { label: 'Improvement Roadmap', href: '/roadmap', icon: TrendingUp },
    { label: 'Rubric Builder', href: '/rubric-builder', icon: Sliders },
    { label: 'Project Comparison', href: '/compare', icon: GitCompare },
    { label: 'Score History', href: '/history', icon: History },
    { label: 'Judge Mode', href: '/judge-mode', icon: Gavel, badge: 'Admin' },
    { label: 'Judge Checklist', href: '/checklist', icon: CheckSquare },
    { label: 'Print Evaluation Report', href: `/report/${activeProject?.id || 'current'}`, icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-white/5 bg-[#090d18]/80 min-h-[calc(100vh-4rem)] p-4">
      {/* Active Project Mini Card */}
      {activeProject && (
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Active Project
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
              v{activeProject.version}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white truncate" title={activeProject.name}>
            {activeProject.name}
          </h4>
          <p className="text-xs text-gray-400 truncate mb-2">{activeProject.hackathonName}</p>

          {activeEvaluation && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-gray-400">Score:</span>
              <span
                className={`font-black text-sm ${
                  activeEvaluation.overallScore >= 85
                    ? 'text-emerald-400'
                    : activeEvaluation.overallScore >= 75
                    ? 'text-cyan-400'
                    : 'text-amber-400'
                }`}
              >
                {activeEvaluation.overallScore}
                <span className="text-[10px] text-gray-500 font-normal"> / 100</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Nav List */}
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-cyan-400 border border-white/10 group-hover:border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Emergency Demo Shortcut */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={() => toggleEmergencyDemo(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all group"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:animate-bounce" />
          <span>🚨 Emergency Demo</span>
        </button>
      </div>
    </aside>
  );
}
