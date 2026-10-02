'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { PitchDuration, PitchTone, PitchScript } from '@/lib/types';
import {
  Mic,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Volume2,
  FileText,
  Sliders,
} from 'lucide-react';

export default function PitchCoachPage() {
  const { activeProject, activeEvaluation } = useProject();

  const [duration, setDuration] = useState<PitchDuration>('3m');
  const [tone, setTone] = useState<PitchTone>('Judge-focused');
  const [pitches, setPitches] = useState<Record<PitchDuration, PitchScript> | null>(
    activeEvaluation?.pitches || null
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Teleprompter rehearsal state
  const [isRehearsing, setIsRehearsing] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRehearsing) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRehearsing]);

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const currentPitch = pitches?.[duration] || activeEvaluation.pitches?.[duration];

  const handleCopy = () => {
    if (!currentPitch) return;
    navigator.clipboard.writeText(currentPitch.fullScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateWithTone = async (newTone: PitchTone) => {
    setTone(newTone);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: activeProject, tone: newTone }),
      });
      if (res.ok) {
        const data = await res.json();
        setPitches(data.pitches);
      }
    } catch {
      // Keep existing
    } finally {
      setIsGenerating(false);
    }
  };

  const maxSeconds =
    duration === '30s' ? 30 : duration === '60s' ? 60 : duration === '3m' ? 180 : 300;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

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
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  AI Pitch & Speech Coach
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Hackathon Pitch Generator & Rehearsal
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Multi-length tailored scripts and teleprompter timer. Master the 30-second elevator
                pitch or full 5-minute presentation.
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 self-start sm:self-auto"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Script Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          {/* Controls: Duration Selector & Tone Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration Selector */}
            <div className="p-4 rounded-2xl glass-panel space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Select Duration
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['30s', '60s', '3m', '5m'] as PitchDuration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDuration(d);
                      setSecondsElapsed(0);
                      setIsRehearsing(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      duration === d
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                        : 'bg-slate-900/60 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="p-4 rounded-2xl glass-panel space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Select Tone / Persona
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    'Judge-focused',
                    'Technical',
                    'Startup-style',
                    'Storytelling',
                    'Professional',
                    'Emotional',
                  ] as PitchTone[]
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleRegenerateWithTone(t)}
                    disabled={isGenerating}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold truncate transition-all ${
                      tone === t
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                        : 'bg-slate-900/60 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rehearsal Teleprompter Bar */}
          <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Rehearsal Timer
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-2xl font-black ${
                      secondsElapsed > maxSeconds ? 'text-rose-500 animate-pulse' : 'text-white'
                    }`}
                  >
                    {formatTime(secondsElapsed)}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    / {formatTime(maxSeconds)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRehearsing(!isRehearsing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isRehearsing
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400'
                }`}
              >
                {isRehearsing ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Rehearsal</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRehearsing(false);
                  setSecondsElapsed(0);
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Script Card */}
          {currentPitch && (
            <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Full Pitch Script ({duration} • {tone})
                </span>
                <span className="text-xs text-gray-400">
                  Target Duration: ~{currentPitch.duration}
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-line tracking-wide">
                {currentPitch.fullScript}
              </div>

              {/* Section-by-Section Breakdown */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Timed Stage Breakdown & Delivery Tips</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPitch.breakdown?.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-400">{section.title}</span>
                        <span className="font-mono text-gray-400 text-[11px]">
                          ~{section.durationSeconds}s
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{section.content}</p>
                      <p className="text-[11px] text-purple-300 font-medium italic pt-1">
                        💡 Tip: {section.tips}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
