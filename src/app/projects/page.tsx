'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  FolderGit2,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export default function ProjectsPage() {
  const { projects, evaluations, setActiveProjectId } = useProject();

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
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  Workspace
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">My Projects</h1>
              <p className="text-xs text-gray-400 mt-1">
                Manage all your evaluated projects, versions, and hackathon submissions.
              </p>
            </div>

            <Link
              href="/submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Project</span>
            </Link>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const evalData = evaluations[project.id];
              const score = evalData?.overallScore || 0;

              return (
                <div
                  key={project.id}
                  className="p-6 rounded-3xl glass-card flex flex-col justify-between space-y-4 border border-white/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">v{project.version}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{project.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {project.problemStatement}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-400">
                      <span>{project.hackathonName}</span>
                      <span>•</span>
                      <span>{project.teamName}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Score:</span>
                      <span
                        className={`text-xl font-black ${
                          score >= 85
                            ? 'text-emerald-400'
                            : score >= 75
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {score}
                        <span className="text-xs text-gray-500 font-normal"> / 100</span>
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setActiveProjectId(project.id)}
                      className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
