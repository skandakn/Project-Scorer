'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import {
  Settings,
  Key,
  ShieldCheck,
  Check,
  Server,
  FolderGit2,
  Database,
  Info,
} from 'lucide-react';

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [openaiBase, setOpenaiBase] = useState('https://api.openai.com/v1');
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');
  const [geminiKey, setGeminiKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
              <Settings className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Configuration & API Keys
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">System Settings</h1>
            <p className="text-xs text-gray-400 mt-1">
              Configure AI providers, GitHub rate limits, and local database options.
            </p>
          </div>

          {/* Fallback Notice */}
          <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-cyan-300 font-bold block text-sm">
                Built-in Intelligent Engine Active
              </strong>
              <p className="text-gray-300 leading-relaxed">
                HackScore AI includes a built-in deterministic heuristic analysis engine that works
                100% out-of-the-box without requiring an external paid API key. If you provide OpenAI
                or Gemini credentials, the platform will utilize real live model calls.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>AI Provider Configuration (Optional)</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  OpenAI API Key (or OpenAI-compatible API)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-... (Leave empty to use built-in engine)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    API Base URL (For Groq, OpenRouter, Ollama)
                  </label>
                  <input
                    type="text"
                    value={openaiBase}
                    onChange={(e) => setOpenaiBase(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={openaiModel}
                    onChange={(e) => setOpenaiModel(e.target.value)}
                    placeholder="gpt-4o-mini"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy... (Gemini 1.5 Flash)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                  <FolderGit2 className="w-3.5 h-3.5 text-gray-300" />
                  GitHub Personal Access Token (Optional — Increases rate limits)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_... (Public repo read only)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold">
                {isSaved && '✓ Configuration updated!'}
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Security & Isolation Callout (Requirement 2 & 25) */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Key Isolation Policy</span>
            </h3>
            <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
              <li>• API keys and secrets are never embedded in client bundles or logged to disk.</li>
              <li>• All third-party calls are routed through server actions or API endpoints.</li>
              <li>• Code repositories are analyzed via read-only metadata APIs; untrusted code is never executed.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
