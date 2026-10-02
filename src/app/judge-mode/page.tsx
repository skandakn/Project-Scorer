'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  Gavel,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Save,
  MessageSquare,
  Sliders,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function JudgeModePage() {
  const { projects, evaluations, activeProjectId, setActiveProjectId, judgeFeedbacks, updateJudgeFeedback } =
    useProject();

  const [selectedTeamId, setSelectedTeamId] = useState<string>(activeProjectId);
  const [enableRankings, setEnableRankings] = useState(false);

  const currentProject = projects.find((p) => p.id === selectedTeamId) || projects[0];
  const currentEval = evaluations[currentProject?.id];

  // Feedback form state for current project
  const existingFeedback = judgeFeedbacks[currentProject?.id] || {
    teamId: currentProject?.id,
    projectId: currentProject?.id,
    teamName: currentProject?.teamName || '',
    projectName: currentProject?.name || '',
    aiScore: currentEval?.overallScore || 80,
    judgeScoreOverride: undefined,
    privateNotes: '',
    strengths: currentEval?.strengths || [],
    weaknesses: currentEval?.criticalWeaknesses || [],
    questions: currentEval?.judgeObjections?.slice(0, 3).map((q) => q.question) || [],
    feedback: '',
    evaluatedAt: new Date().toISOString(),
  };

  const [scoreOverride, setScoreOverride] = useState<string>(
    existingFeedback.judgeScoreOverride !== undefined ? String(existingFeedback.judgeScoreOverride) : ''
  );
  const [privateNotes, setPrivateNotes] = useState(existingFeedback.privateNotes || '');
  const [customFeedback, setCustomFeedback] = useState(existingFeedback.feedback || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectTeam = (id: string) => {
    setSelectedTeamId(id);
    setActiveProjectId(id);
    const fb = judgeFeedbacks[id];
    setScoreOverride(fb?.judgeScoreOverride !== undefined ? String(fb.judgeScoreOverride) : '');
    setPrivateNotes(fb?.privateNotes || '');
    setCustomFeedback(fb?.feedback || '');
    setIsSaved(false);
  };

  const handleSaveFeedback = () => {
    const overrideNum = scoreOverride ? parseFloat(scoreOverride) : undefined;
    updateJudgeFeedback({
      ...existingFeedback,
      teamId: currentProject.id,
      projectId: currentProject.id,
      teamName: currentProject.teamName,
      projectName: currentProject.name,
      aiScore: currentEval?.overallScore || 80,
      judgeScoreOverride: overrideNum,
      privateNotes,
      feedback: customFeedback,
      evaluatedAt: new Date().toISOString(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Optional ranking list if enabled by organizer
  const sortedProjects = [...projects].sort((a, b) => {
    const scoreA = judgeFeedbacks[a.id]?.judgeScoreOverride ?? evaluations[a.id]?.overallScore ?? 0;
    const scoreB = judgeFeedbacks[b.id]?.judgeScoreOverride ?? evaluations[b.id]?.overallScore ?? 0;
    return scoreB - scoreA;
  });

  const displayedProjects = enableRankings ? sortedProjects : projects;

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
                <Gavel className="w-4 h-4 text-purple-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
                  Organizer & Judge Console
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Judge Mode Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1">
                Evaluate teams, review AI-assisted audits, override scores, and submit private notes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableRankings}
                  onChange={(e) => setEnableRankings(e.target.checked)}
                  className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 cursor-pointer"
                />
                <span>Enable Team Ranking</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Teams Roster Sidebar (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Participating Teams ({projects.length})
                </span>
                <span className="text-[10px] text-gray-500">
                  {enableRankings ? 'Ranked by Score' : 'Alphabetical'}
                </span>
              </div>

              <div className="space-y-2">
                {displayedProjects.map((p, idx) => {
                  const isSelected = p.id === selectedTeamId;
                  const evalItem = evaluations[p.id];
                  const override = judgeFeedbacks[p.id]?.judgeScoreOverride;
                  const finalScore = override !== undefined ? override : evalItem?.overallScore || 0;

                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectTeam(p.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-purple-500/15 border-purple-500 text-white shadow-md shadow-purple-500/10'
                          : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-gray-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          {enableRankings && (
                            <span className="text-[10px] font-mono font-bold text-gray-500">
                              #{idx + 1}
                            </span>
                          )}
                          <span className="text-xs font-bold truncate block">{p.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate block">
                          {p.teamName} • {p.category}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-purple-300">{finalScore}</span>
                        <span className="text-[9px] text-gray-500 block">
                          {override !== undefined ? 'Judge' : 'AI'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Team Evaluation & Scoring Override Form (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Project Summary Banner */}
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-xl font-black text-white">{currentProject.name}</h2>
                    <p className="text-xs text-gray-400">
                      Team: {currentProject.teamName} ({currentProject.teamMembers?.join(', ')})
                    </p>
                  </div>

                  {/* AI Score vs Human Override */}
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-center">
                      <span className="text-[9px] uppercase font-bold text-cyan-400 block">
                        AI Score
                      </span>
                      <span className="text-lg font-black text-white">
                        {currentEval?.overallScore}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center">
                      <span className="text-[9px] uppercase font-bold text-purple-300 block">
                        Judge Score
                      </span>
                      <span className="text-lg font-black text-purple-300">
                        {scoreOverride ? scoreOverride : currentEval?.overallScore}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
                  {currentProject.problemStatement}
                </p>

                {/* Score Override Slider / Input */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-200">
                      Judge Manual Score Override (0–100)
                    </label>
                    <span className="text-purple-400 font-bold">
                      {scoreOverride ? `${scoreOverride} / 100` : 'Using AI Base Score'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={scoreOverride || currentEval?.overallScore || 80}
                      onChange={(e) => setScoreOverride(e.target.value)}
                      className="flex-1 accent-purple-500 cursor-pointer"
                    />
                    <button
                      onClick={() => setScoreOverride('')}
                      className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5"
                    >
                      Reset to AI
                    </button>
                  </div>
                </div>

                {/* Private Notes & Feedback */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Private Judge Notes (Hidden from participants)
                    </label>
                    <textarea
                      rows={3}
                      value={privateNotes}
                      onChange={(e) => setPrivateNotes(e.target.value)}
                      placeholder="Add confidential observations for the judging committee..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Participant Feedback (Shared with team)
                    </label>
                    <textarea
                      rows={3}
                      value={customFeedback}
                      onChange={(e) => setCustomFeedback(e.target.value)}
                      placeholder="Constructive feedback to help this team improve..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-400 font-semibold">
                      {isSaved && '✓ Feedback saved successfully!'}
                    </span>
                    <button
                      onClick={handleSaveFeedback}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Judge Evaluation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
