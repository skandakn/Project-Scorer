'use client';

import React from 'react';
import { useProject } from '@/lib/store/projectContext';
import {
  AlertTriangle,
  X,
  PlayCircle,
  Image as ImageIcon,
  Network,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Copy,
} from 'lucide-react';

export default function EmergencyModal() {
  const { isEmergencyDemoOpen, toggleEmergencyDemo, activeProject } = useProject();

  if (!isEmergencyDemoOpen || !activeProject) return null;

  const handleCopyTalkingPoints = () => {
    const text = `PROJECT: ${activeProject.name}\nPROBLEM: ${activeProject.problemStatement}\nKEY METRIC: 70% processing time cut\nTECH: ${activeProject.frontendTech?.join(', ')}, ${activeProject.backendTech?.join(', ')}`;
    navigator.clipboard.writeText(text);
    alert('Talking points copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b101d] border-2 border-rose-500/40 p-6 md:p-8 shadow-2xl shadow-rose-950/50">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black text-white">
                  🚨 DEMO EMERGENCY RECOVERY MODE
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white">
                  LIVE
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Did your live deployment or Wi-Fi fail? Keep calm. Present these backup assets to
                judges right now.
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleEmergencyDemo(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Key Talking Points (What to Say Right Now) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>1. What To Say To Judges Right Now</span>
              </div>
              <button
                onClick={handleCopyTalkingPoints}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed space-y-2">
              <p className="font-semibold text-rose-300">
                &ldquo;Judges, like all real-world distributed systems, the venue network is experiencing
                jitter. Let us pivot to our pre-recorded offline artifact verification:&rdquo;
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 pl-1">
                <li>
                  <strong className="text-white">Core Value:</strong> {activeProject.problemStatement.slice(0, 120)}...
                </li>
                <li>
                  <strong className="text-white">Our Tech:</strong> {activeProject.frontendTech?.join(', ')} + {activeProject.backendTech?.join(', ')}
                </li>
                <li>
                  <strong className="text-white">Differentiator:</strong> Real-time asynchronous processing without vendor lock-in.
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Recorded Video Demo */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
              <PlayCircle className="w-4 h-4" />
              <span>2. Backup Demo Video</span>
            </div>
            {activeProject.videoUrl ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-xs text-gray-300 mb-3">
                  Pre-recorded demo video available at:
                </p>
                <a
                  href={activeProject.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Launch Backup Video ({activeProject.videoUrl})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                ⚠️ No video URL submitted. Open your local screen recording in QuickTime/VLC right now.
              </div>
            )}
          </div>

          {/* 3. High-Res Screenshots & UI Evidence */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
              <ImageIcon className="w-4 h-4" />
              <span>3. Backup UI Screenshots</span>
            </div>
            {activeProject.screenshots && activeProject.screenshots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {activeProject.screenshots.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="block relative rounded-lg overflow-hidden border border-white/10 hover:border-purple-400 transition-colors group aspect-video bg-black/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                      View Fullscreen
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                No screenshots submitted. Toggle presentation slides to display full interface mockups.
              </p>
            )}
          </div>

          {/* 4. Architecture Diagram */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <Network className="w-4 h-4" />
              <span>4. Architecture & Data Flow</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
              {activeProject.architectureDiagram ||
                `${activeProject.name} -> Client Layer (${activeProject.frontendTech?.join(', ') || 'Frontend'}) -> REST/WebSocket -> Compute Engine (${activeProject.backendTech?.join(', ') || 'Backend'}) -> DB (${activeProject.databaseTech?.join(', ') || 'Storage'})`}
            </div>
          </div>
        </div>

        {/* 5. Emergency Checklist */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-gray-300">
              Judges judge problem, architecture, and team composure. Recovering gracefully demonstrates senior engineering grit.
            </span>
          </div>
          <button
            onClick={() => toggleEmergencyDemo(false)}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Close Emergency View
          </button>
        </div>
      </div>
    </div>
  );
}
