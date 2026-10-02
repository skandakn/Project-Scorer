'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function PresentationReviewPage() {
  const { activeProject, activeEvaluation } = useProject();
  const [slideLinkInput, setSlideLinkInput] = useState(activeProject?.presentationUrl || '');
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const { presentationReview } = activeEvaluation;

  const handleSimulateUpload = () => {
    setIsAnalyzingFile(true);
    setTimeout(() => {
      setIsAnalyzingFile(false);
      alert('Slide deck analysis refreshed!');
    }, 1200);
  };

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
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  Slide Deck & Narrative Review
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Presentation & Slide Deck Analyzer
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Evaluating story structure, slide text density, demo placement, and closing clarity.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
              <span className="text-xs text-gray-300 font-semibold">Presentation Score:</span>
              <span className="text-2xl font-black text-cyan-400">
                {presentationReview.score}
                <span className="text-xs text-gray-400 font-normal"> / 100</span>
              </span>
            </div>
          </div>

          {/* Slide Deck Link & Upload Card */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <span>Submit or Update Slide Deck</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                value={slideLinkInput}
                onChange={(e) => setSlideLinkInput(e.target.value)}
                placeholder="https://speakerdeck.com/... or Google Slides URL"
                className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSimulateUpload}
                disabled={isAnalyzingFile}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <span>{isAnalyzingFile ? 'Inspecting Deck...' : 'Analyze Deck'}</span>
              </button>
            </div>

            {activeProject.presentationUrl && (
              <div className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                <span>Active link:</span>
                <a
                  href={activeProject.presentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-md"
                >
                  {activeProject.presentationUrl} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Key Dimensions Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-white/10">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Slide Density
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {presentationReview.slideDensity}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-white/10">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Visual Clarity
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {presentationReview.visualClarity}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-white/10">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Demo Flow
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {presentationReview.demoFlow}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-white/10">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Story Structure
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {presentationReview.storyStructure}
              </p>
            </div>
          </div>

          {/* Strong vs Needs Improvement (Requirement 14) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong */}
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Presentation Elements</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                {presentationReview.strongPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs Improvement */}
            <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Needs Improvement</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-200/90 leading-relaxed">
                {presentationReview.needsImprovement.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white">Recommendations for Presentation Day</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {presentationReview.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
