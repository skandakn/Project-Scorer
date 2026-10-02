'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  AlertTriangle,
  PlayCircle,
  Image as ImageIcon,
  Network,
  Copy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function EmergencyDemoPage() {
  const { activeProject } = useProject();

  if (!activeProject) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleCopyTalkingPoints = () => {
    const text = `PROJECT: ${activeProject.name}\nPROBLEM: ${activeProject.problemStatement}\nKEY METRIC: 70% processing time cut\nTECH: ${activeProject.frontendTech?.join(', ')}, ${activeProject.backendTech?.join(', ')}`;
    navigator.clipboard.writeText(text);
    alert('Talking points copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="p-6 md:p-8 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <span className="text-xs uppercase font-black tracking-widest">
                Disaster Recovery Hub
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              🚨 Emergency Demo Mode: {activeProject.name}
            </h1>
            <p className="text-xs md:text-sm text-gray-300">
              Did venue Wi-Fi collapse or did your live API 500? Keep your composure. Walk judges
              through these verified backup assets right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. What to Say to Judges Right Now */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  1. Immediate Talking Point Script
                </span>
                <button
                  onClick={handleCopyTalkingPoints}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-rose-200/90 italic p-3 rounded-xl bg-black/40 border border-white/5 leading-relaxed">
                &ldquo;Judges, venue Wi-Fi is experiencing temporary packet loss. In true resilient
                engineering spirit, we have our local offline architecture and recording ready to
                inspect right here:&rdquo;
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pl-2 list-disc list-inside">
                <li>
                  <strong className="text-white">Core Value:</strong> {activeProject.problemStatement}
                </li>
                <li>
                  <strong className="text-white">Stack:</strong> {activeProject.frontendTech?.join(', ')} + {activeProject.backendTech?.join(', ')}
                </li>
              </ul>
            </div>

            {/* 2. Video Backup */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                2. Recorded Demo Video
              </span>
              {activeProject.videoUrl ? (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <p className="text-xs text-gray-300">
                    High-definition screen recording ready on remote player:
                  </p>
                  <a
                    href={activeProject.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Launch Video ({activeProject.videoUrl})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  Open your local QuickTime or VLC recording file from your desktop now.
                </div>
              )}
            </div>

            {/* 3. Architecture Flow */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                3. Architecture & Data Flow
              </span>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                {activeProject.architectureDiagram ||
                  `${activeProject.name} -> Client UI -> REST/WS -> Ingestion Engine -> Persistent Storage`}
              </div>
            </div>

            {/* 4. High-Resolution Screenshots */}
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                4. Backup UI Screenshots
              </span>
              {activeProject.screenshots && activeProject.screenshots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {activeProject.screenshots.map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="block relative rounded-lg overflow-hidden border border-white/10 aspect-video"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No screenshots attached.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
