'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { RUBRIC_PRESETS } from '@/lib/data/rubrics';
import { RubricCriterion } from '@/lib/types';
import {
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Scale,
  RefreshCw,
} from 'lucide-react';

export default function RubricBuilderPage() {
  const { activeProject, activeEvaluation, reanalyzeProject } = useProject();

  const [selectedPresetId, setSelectedPresetId] = useState(
    activeProject?.rubricId || 'general'
  );

  const selectedPreset =
    RUBRIC_PRESETS.find((r) => r.id === selectedPresetId) || RUBRIC_PRESETS[0];

  const [criteria, setCriteria] = useState<RubricCriterion[]>(selectedPreset.criteria);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const totalPoints = criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = RUBRIC_PRESETS.find((r) => r.id === presetId);
    if (preset) {
      setCriteria(preset.criteria);
    }
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: Math.max(1, newWeight) } : c))
    );
  };

  const handleAddCriterion = () => {
    const newId = `custom-${Date.now()}`;
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: 'Custom Criterion',
        weight: 10,
        description: 'Custom evaluation metric defined by organizers or team.',
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 3) {
      alert('A rubric must contain at least 3 criteria.');
      return;
    }
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRecalculateScores = async () => {
    if (!activeProject) return;
    setIsRecalculating(true);
    setSuccessMessage('');

    const weightsMap: Record<string, number> = {};
    criteria.forEach((c) => {
      weightsMap[c.id] = c.weight;
    });

    try {
      await reanalyzeProject(activeProject.id, weightsMap);
      setSuccessMessage('Scoring engine recalculated project scores with custom rubric weights!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      alert('Failed to recalculate scores. Please try again.');
    } finally {
      setIsRecalculating(false);
    }
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
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  Configurable Judging Engine
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Hackathon Rubric Builder
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Customize scoring criteria and weights. The scoring engine automatically
                recalculates project scores based on your active rubric.
              </p>
            </div>

            <button
              onClick={handleRecalculateScores}
              disabled={isRecalculating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Recalculating...' : 'Apply & Recalculate'}</span>
            </button>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Presets Grid (Requirement 16) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Select Rubric Preset (8 Presets Included)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {RUBRIC_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/10 text-gray-300'
                    }`}
                  >
                    <span className="text-xs font-bold block truncate">{preset.name}</span>
                    <span className="text-[10px] text-gray-400 line-clamp-1">
                      {preset.criteria.length} criteria
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Criteria Customizer */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>Customize Criteria Weights</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adjust points for each dimension. Total points sum: {totalPoints}
                </p>
              </div>

              <button
                onClick={handleAddCriterion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
            </div>

            <div className="space-y-3">
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-white block">{c.name}</span>
                      <span className="text-xs text-gray-400 block">{c.description}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="40"
                          value={c.weight}
                          onChange={(e) => handleWeightChange(c.id, parseInt(e.target.value, 10))}
                          className="w-32 accent-cyan-500 cursor-pointer"
                        />
                        <span className="font-mono font-black text-sm text-cyan-400 w-12 text-right">
                          {c.weight} pts
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveCriterion(c.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove criterion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
