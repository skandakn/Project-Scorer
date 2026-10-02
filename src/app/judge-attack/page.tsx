'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { JudgeObjection } from '@/lib/types';
import {
  Flame,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function JudgeAttackPage() {
  const { activeProject, activeEvaluation } = useProject();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMockMode, setIsMockMode] = useState(false);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [mockAnswer, setMockAnswer] = useState('');
  const [mockEvaluations, setMockEvaluations] = useState<
    Record<string, { rating: string; feedback: string; pointsAwarded: number }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeProject || !activeEvaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a13]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  const objections = activeEvaluation.judgeObjections || [];

  const handleToggle = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleStartMockJudging = () => {
    setIsMockMode(true);
    setCurrentMockIndex(0);
    setMockAnswer('');
  };

  const handleResetMockJudging = () => {
    setIsMockMode(false);
    setCurrentMockIndex(0);
    setMockAnswer('');
    setMockEvaluations({});
  };

  const currentQuestion = objections[currentMockIndex];

  const handleSubmitMockAnswer = async () => {
    if (!mockAnswer.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/judge-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: mockAnswer }),
      });

      if (res.ok) {
        const evalData = await res.json();
        setMockEvaluations((prev) => ({
          ...prev,
          [currentQuestion.id]: evalData,
        }));
      }
    } catch {
      // Fallback evaluation
      setMockEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          rating: 'Strong',
          feedback:
            'Good answer! Solid technical justification. Prepare to show your live metrics in the demo.',
          pointsAwarded: 85,
        },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Mock Readiness Score
  const evaluatedCount = Object.keys(mockEvaluations).length;
  const totalPoints = Object.values(mockEvaluations).reduce((acc, curr) => acc + curr.pointsAwarded, 0);
  const averageMockScore = evaluatedCount > 0 ? Math.round(totalPoints / evaluatedCount) : 0;

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
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
                  Judge Defense Simulator
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                🔥 Judge Attack Mode
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Skeptical hackathon judges challenge your project with 10 tough objections. Prepare
                bulletproof defenses before judging.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isMockMode ? (
                <button
                  onClick={handleStartMockJudging}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mock Judging</span>
                </button>
              ) : (
                <button
                  onClick={handleResetMockJudging}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Exit Mock Mode</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Mock Judging Section */}
          {isMockMode ? (
            <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-rose-500/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-base font-bold text-white">
                    Live Mock Defense — Question {currentMockIndex + 1} of {objections.length}
                  </h3>
                </div>

                {evaluatedCount > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Readiness Score:</span>
                    <span className="font-black text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                      {averageMockScore} / 100
                    </span>
                  </div>
                )}
              </div>

              {/* Current Question */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Judge Objection ({currentQuestion.category})
                </span>
                <h4 className="text-lg md:text-xl font-bold text-white">
                  &ldquo;{currentQuestion.question}&rdquo;
                </h4>
                <p className="text-xs text-gray-400">
                  <strong className="text-gray-300">Why the judge is asking:</strong>{' '}
                  {currentQuestion.whyJudgesAsk}
                </p>
              </div>

              {/* Answer Box */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-300 block">
                  Your Defense Answer (Type your answer as you would speak it to judges):
                </label>
                <textarea
                  rows={4}
                  value={mockAnswer}
                  onChange={(e) => setMockAnswer(e.target.value)}
                  placeholder="Explain your technical architecture, trade-offs, and evidence..."
                  className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 transition-colors leading-relaxed"
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleSubmitMockAnswer}
                    disabled={isSubmitting || !mockAnswer.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Defense'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {currentMockIndex > 0 && (
                      <button
                        onClick={() => {
                          setCurrentMockIndex((prev) => prev - 1);
                          setMockAnswer('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300"
                      >
                        Previous
                      </button>
                    )}
                    {currentMockIndex < objections.length - 1 && (
                      <button
                        onClick={() => {
                          setCurrentMockIndex((prev) => prev + 1);
                          setMockAnswer('');
                        }}
                        className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold"
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Result */}
              {mockEvaluations[currentQuestion.id] && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Judge Assessment
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        mockEvaluations[currentQuestion.id].rating === 'Outstanding'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : mockEvaluations[currentQuestion.id].rating === 'Strong'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {mockEvaluations[currentQuestion.id].rating} (
                      {mockEvaluations[currentQuestion.id].pointsAwarded} pts)
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {mockEvaluations[currentQuestion.id].feedback}
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-purple-400 block">
                      Recommended Suggested Answer:
                    </span>
                    <p className="text-xs text-gray-400 leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5">
                      &ldquo;{currentQuestion.suggestedAnswer}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* 10 Judge Objections List (Requirement 12) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-base font-bold text-white">
                All 10 Skeptical Judge Challenges
              </h3>
              <span className="text-xs text-gray-400 font-semibold">
                Click any challenge to reveal answer & evidence guide
              </span>
            </div>

            <div className="space-y-3">
              {objections.map((item, idx) => {
                const isExpanded = expandedIndex === idx;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-900/90 border-rose-500/30 shadow-lg shadow-black/40'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(idx)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="text-sm font-bold text-white block truncate">
                            {item.question}
                          </span>
                          <span className="text-[11px] text-gray-400 truncate block">
                            Category: {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-1 rounded-lg bg-white/5 text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs animate-in fade-in duration-200">
                        {/* Why judges ask it */}
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                            Why the Judge is Asking:
                          </span>
                          <p className="text-gray-300 leading-relaxed">{item.whyJudgesAsk}</p>
                        </div>

                        {/* Suggested Answer */}
                        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                            Suggested Defense Answer:
                          </span>
                          <p className="text-cyan-100 leading-relaxed font-medium">
                            &ldquo;{item.suggestedAnswer}&rdquo;
                          </p>
                        </div>

                        {/* Evidence to Bring */}
                        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                            Evidence the Team Should Prepare:
                          </span>
                          <p className="text-purple-200 leading-relaxed">{item.evidenceToBring}</p>
                        </div>
                      </div>
                    )}
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
