'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import PriorityRoadmap from '@/components/dashboard/PriorityRoadmap';
import ScoreSimulator from '@/components/dashboard/ScoreSimulator';
import { useProject } from '@/lib/store/projectContext';
import { TrendingUp, Zap, Target } from 'lucide-react';

export default function RoadmapPage() {
  const { activeProject, activeEvaluation } = useProject();

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

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
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Action Plan & Simulator
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Improvement Roadmap: &ldquo;What Should I Fix First?&rdquo;
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Ranked by judging impact. Eliminate critical vulnerabilities and simulate your score
              gain.
            </p>
          </div>

          {/* Priority Roadmap */}
          <PriorityRoadmap improvements={activeEvaluation.improvements} />

          {/* Interactive Score Simulator */}
          <ScoreSimulator
            currentScore={activeEvaluation.overallScore}
            improvements={activeEvaluation.improvements}
          />
        </main>
      </div>
    </div>
  );
}
