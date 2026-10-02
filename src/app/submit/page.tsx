'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import { ProjectData } from '@/lib/types';
import { RUBRIC_PRESETS } from '@/lib/data/rubrics';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Globe,
  Video,
  Palette,
  FileText,
  Terminal,
  UploadCloud,
  Sliders,
  Layers,
  Loader2,
  Check,
  Zap,
  ChevronDown,
  ChevronUp,
  Cpu,
  Search,
  ExternalLink,
} from 'lucide-react';

function SubmitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNewProject, rubrics } = useProject();

  // Mode: 'quick' (1-click GitHub) vs 'manual' (multi-step detailed)
  const [mode, setMode] = useState<'quick' | 'manual'>('quick');

  // Quick GitHub input state
  const [quickGithubUrl, setQuickGithubUrl] = useState('');
  const [quickLiveUrl, setQuickLiveUrl] = useState('');
  const [quickCategory, setQuickCategory] = useState('Auto-Detect');

  // Loading & Progress state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [analysisStatusText, setAnalysisStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Multi-step manual form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    name: '',
    teamName: '',
    teamMembers: [],
    hackathonName: '',
    hackathonTheme: '',
    problemStatement: '',
    category: 'AI & Machine Learning',
    targetUsers: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
    videoUrl: '',
    figmaUrl: '',
    presentationUrl: '',
    frontendTech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    backendTech: ['Node.js', 'FastAPI'],
    databaseTech: ['PostgreSQL'],
    apisTech: ['REST API'],
    aiModelsTech: ['OpenAI GPT-4o-mini'],
    cloudTech: ['Vercel', 'AWS'],
    authTech: ['Clerk'],
    integrationsTech: [],
    screenshots: [],
    architectureDiagram: '',
    pitchDoc: '',
    rubricId: 'general',
    customWeights: {},
  });

  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [frontendInput, setFrontendInput] = useState('Next.js, TypeScript, Tailwind CSS');
  const [backendInput, setBackendInput] = useState('FastAPI, Node.js');
  const [dbInput, setDbInput] = useState('PostgreSQL, Redis');
  const [apiInput, setApiInput] = useState('REST API, WebSockets');
  const [aiInput, setAiInput] = useState('GPT-4o-mini, Whisper');
  const [cloudInput, setCloudInput] = useState('Vercel, AWS');
  const [authInput, setAuthInput] = useState('Clerk');
  const [integrationsInput, setIntegrationsInput] = useState('Twilio, Stripe');
  const [screenshotInput, setScreenshotInput] = useState('');

  // Quick samples to click
  const sampleRepos = [
    { label: 'Project Scorer', url: 'https://github.com/skandakn/Project-Scorer', desc: 'AI Judge Platform' },
    { label: 'Next.js', url: 'https://github.com/vercel/next.js', desc: 'React Framework' },
    { label: 'React', url: 'https://github.com/facebook/react', desc: 'UI Library' },
    { label: 'shadcn/ui', url: 'https://github.com/shadcn-ui/ui', desc: 'Design System' },
    { label: 'FastAPI', url: 'https://github.com/fastapi/fastapi', desc: 'Python API Framework' },
  ];

  // Analysis Checklist Steps
  const analysisSteps = [
    'Connecting to GitHub & fetching public repository data',
    'Extracting README, problem statement & project overview',
    'Detecting languages, dependencies & tech stack synergy',
    'Inspecting codebase structure, tests & CI/CD workflows',
    'Evaluating UI/UX design signals & responsive layout',
    'Benchmarking innovation & competitive market differentiation',
    'Simulating skeptical hackathon judge attack objections',
    'Calculating category weights & generating 0–100 HackScore',
    'Synthesizing prioritized pre-judging improvement roadmap',
  ];

  // Pre-fill from URL param if available
  useEffect(() => {
    const repoParam = searchParams.get('repo');
    if (repoParam) {
      setQuickGithubUrl(repoParam);
    }
  }, [searchParams]);

  // Handle 1-Click GitHub Analysis
  const handleQuickAnalyze = async (repoUrlToUse?: string) => {
    const targetUrl = (repoUrlToUse || quickGithubUrl).trim();
    if (!targetUrl) {
      setErrorMessage('Please enter a GitHub repository URL.');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    const stepInterval = setInterval(() => {
      setAnalysisStepIndex((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 400);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUrl: targetUrl,
          overrides: {
            liveUrl: quickLiveUrl.trim() || undefined,
            category: quickCategory !== 'Auto-Detect' ? quickCategory : undefined,
          },
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze repository');
      }

      const data = await res.json();
      addNewProject(data.project, data.evaluation);

      // Short delay for user to celebrate
      setTimeout(() => {
        router.push('/evaluation');
      }, 500);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMessage(
        err instanceof Error ? err.message : 'Analysis failed. Please check the GitHub repository URL.'
      );
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        setErrorMessage('Project Name is required.');
        return;
      }
      if (!formData.problemStatement?.trim()) {
        setErrorMessage('Problem statement is required.');
        return;
      }
      if (!formData.description?.trim()) {
        setErrorMessage('Project description is required.');
        return;
      }
    }
    setErrorMessage('');
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const parseCommaList = (str: string) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleManualSubmit = async () => {
    setErrorMessage('');
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    const stepInterval = setInterval(() => {
      setAnalysisStepIndex((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    const projectPayload: ProjectData = {
      id: `proj-${Date.now()}`,
      name: formData.name || 'Untitled Project',
      tagline: formData.tagline || '',
      category: formData.category || 'General',
      hackathonName: formData.hackathonName || 'Hackathon 2026',
      hackathonTheme: formData.hackathonTheme || '',
      problemStatement: formData.problemStatement || '',
      targetUsers: formData.targetUsers || '',
      description: formData.description || '',
      teamName: formData.teamName || 'Team Builders',
      teamMembers: teamMembersInput ? parseCommaList(teamMembersInput) : ['Lead Developer'],
      githubUrl: formData.githubUrl || '',
      liveUrl: formData.liveUrl || '',
      videoUrl: formData.videoUrl || '',
      figmaUrl: formData.figmaUrl || '',
      presentationUrl: formData.presentationUrl || '',
      frontendTech: parseCommaList(frontendInput),
      backendTech: parseCommaList(backendInput),
      databaseTech: parseCommaList(dbInput),
      apisTech: parseCommaList(apiInput),
      aiModelsTech: parseCommaList(aiInput),
      cloudTech: parseCommaList(cloudInput),
      authTech: parseCommaList(authInput),
      integrationsTech: parseCommaList(integrationsInput),
      screenshots: screenshotInput
        ? parseCommaList(screenshotInput)
        : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'],
      architectureDiagram: formData.architectureDiagram || '',
      pitchDoc: formData.pitchDoc || '',
      rubricId: formData.rubricId || 'general',
      customWeights: formData.customWeights || {},
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'EVALUATED',
    };

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze project');
      }

      const data = await res.json();
      addNewProject(projectPayload, data.evaluation);

      setTimeout(() => {
        router.push('/evaluation');
      }, 500);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMessage(err instanceof Error ? err.message : 'Analysis failed. Please check network.');
    }
  };

  const activeRubricPreset = rubrics.find((r) => r.id === formData.rubricId) || rubrics[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-sm shadow-cyan-500/10 mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant AI Evaluation</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Analyze Your Project
            </h1>
            <p className="text-sm md:text-base text-gray-300 mt-2 max-w-xl mx-auto">
              Put in your GitHub repo and get an instant <span className="text-cyan-400 font-semibold">0–100 Hackathon Score</span>, technical audit, judge objection defense, and prioritized improvement roadmap.
            </p>

            {/* Quick vs Detailed Toggle */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setMode('quick')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  mode === 'quick'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                    : 'bg-slate-900 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click GitHub (Instant)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  mode === 'manual'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                    : 'bg-slate-900 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Detailed Custom Form</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs md:text-sm">{errorMessage}</div>
            </div>
          )}

          {/* SECTION 1: 1-CLICK INSTANT GITHUB REPOSITORY ANALYSIS */}
          {mode === 'quick' && (
            <div className="max-w-3xl mx-auto">
              <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-500/30 relative overflow-hidden shadow-2xl shadow-cyan-950/40">
                {/* Glow accent */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Enter GitHub Repository</h2>
                      <p className="text-xs text-gray-400">
                        Paste any public repository URL. We inspect the code, README, tests, and dependencies automatically.
                      </p>
                    </div>
                  </div>

                  {/* Primary URL Input Bar */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <span>GitHub Repository URL</span>
                      <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-gray-400">
                        <FolderGit2 className="w-5 h-5 text-cyan-400" />
                      </div>
                      <input
                        type="text"
                        value={quickGithubUrl}
                        onChange={(e) => setQuickGithubUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleQuickAnalyze();
                          }
                        }}
                        placeholder="https://github.com/username/project-repo"
                        disabled={isAnalyzing}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 text-white placeholder-gray-500 text-sm md:text-base font-mono transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Quick Sample Clickable Badges */}
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Or try one of these sample repos:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sampleRepos.map((sample) => (
                        <button
                          key={sample.url}
                          type="button"
                          onClick={() => {
                            setQuickGithubUrl(sample.url);
                            handleQuickAnalyze(sample.url);
                          }}
                          disabled={isAnalyzing}
                          className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 group"
                        >
                          <span className="font-semibold">{sample.label}</span>
                          <span className="text-[10px] text-gray-400">({sample.desc})</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Quick Add-ons (Collapsible or Clean) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                        Live Demo URL (Optional)
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          value={quickLiveUrl}
                          onChange={(e) => setQuickLiveUrl(e.target.value)}
                          placeholder="https://yourdemo.vercel.app"
                          disabled={isAnalyzing}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-gray-200 focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                        Category (Optional)
                      </label>
                      <select
                        value={quickCategory}
                        onChange={(e) => setQuickCategory(e.target.value)}
                        disabled={isAnalyzing}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-gray-200 focus:border-cyan-400 outline-none"
                      >
                        <option value="Auto-Detect">Auto-Detect from Repository</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile Application">Mobile Application</option>
                        <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                        <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                        <option value="Climate & Sustainability">Climate & Sustainability</option>
                        <option value="FinTech & Payments">FinTech & Payments</option>
                        <option value="Developer Tools">Developer Tools</option>
                      </select>
                    </div>
                  </div>

                  {/* Big Submit Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickAnalyze()}
                    disabled={isAnalyzing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing GitHub Repository...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current" />
                        <span>⚡ Analyze Repository & Show Results</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Zero setup required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Auto-detects tech stack & tests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      100% free analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MANUAL MULTI-STEP WIZARD (Optional for power users) */}
          {mode === 'manual' && (
            <div className="max-w-3xl mx-auto">
              {/* Stepper indicator */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />

                {[
                  { step: 1, label: 'Basics' },
                  { step: 2, label: 'Links' },
                  { step: 3, label: 'Tech Stack' },
                  { step: 4, label: 'Artifacts' },
                  { step: 5, label: 'Rubric' },
                ].map((s) => (
                  <div key={s.step} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(s.step)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === s.step
                          ? 'bg-cyan-500 text-black ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                          : currentStep > s.step
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-900 border border-white/10 text-gray-400'
                      }`}
                    >
                      {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                    </button>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        currentStep === s.step ? 'text-cyan-400 font-bold' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Wizard Cards */}
              <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-white/10 relative">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Step 1 — Project Basics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. AuraMed AI"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Tagline</label>
                        <input
                          type="text"
                          value={formData.tagline || ''}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          placeholder="e.g. Ambient clinical voice copilot for doctors"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                          Hackathon Name
                        </label>
                        <input
                          type="text"
                          value={formData.hackathonName || ''}
                          onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                          placeholder="e.g. HackMIT 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                          Hackathon Theme / Track
                        </label>
                        <input
                          type="text"
                          value={formData.hackathonTheme || ''}
                          onChange={(e) => setFormData({ ...formData, hackathonTheme: e.target.value })}
                          placeholder="e.g. AI for Healthcare"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Problem Statement *
                      </label>
                      <textarea
                        rows={3}
                        value={formData.problemStatement || ''}
                        onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        placeholder="What exact pain point does this solve? Be specific about who suffers and the cost."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
                        <select
                          value={formData.category || 'AI & Machine Learning'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        >
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="Web Application">Web Application</option>
                          <option value="Mobile Application">Mobile Application</option>
                          <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                          <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                          <option value="Climate & Sustainability">Climate & Sustainability</option>
                          <option value="FinTech & Payments">FinTech & Payments</option>
                          <option value="Developer Tools">Developer Tools</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                          Target Users
                        </label>
                        <input
                          type="text"
                          value={formData.targetUsers || ''}
                          onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                          placeholder="e.g. Emergency room clinicians and hospital scribes"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Full Project Description *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detail how your solution works, core features, architecture, and user workflow."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Step 2 — Links & Artifacts</h2>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={formData.githubUrl || ''}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Live Deployed App URL
                      </label>
                      <input
                        type="text"
                        value={formData.liveUrl || ''}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        placeholder="https://your-project.vercel.app"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Demo Video URL (YouTube / Loom)
                      </label>
                      <input
                        type="text"
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://youtu.be/... or https://loom.com/share/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Presentation Slides URL (Canva / Slides)
                      </label>
                      <input
                        type="text"
                        value={formData.presentationUrl || ''}
                        onChange={(e) => setFormData({ ...formData, presentationUrl: e.target.value })}
                        placeholder="https://docs.google.com/presentation/d/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Step 3 — Tech Stack</h2>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Frontend (comma separated)
                      </label>
                      <input
                        type="text"
                        value={frontendInput}
                        onChange={(e) => setFrontendInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Backend & APIs (comma separated)
                      </label>
                      <input
                        type="text"
                        value={backendInput}
                        onChange={(e) => setBackendInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        AI Models / LLMs (comma separated)
                      </label>
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Database & Storage (comma separated)
                      </label>
                      <input
                        type="text"
                        value={dbInput}
                        onChange={(e) => setDbInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Step 4 — Screenshots & Pitch</h2>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Screenshot Image URLs (comma separated)
                      </label>
                      <input
                        type="text"
                        value={screenshotInput}
                        onChange={(e) => setScreenshotInput(e.target.value)}
                        placeholder="https://example.com/screenshot1.png, https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Pitch Script / Speaking Notes (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.pitchDoc || ''}
                        onChange={(e) => setFormData({ ...formData, pitchDoc: e.target.value })}
                        placeholder="Paste what you plan to say during your live pitch to get narrative critique."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Step 5 — Select Judging Rubric</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rubrics.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => setFormData({ ...formData, rubricId: r.id })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            formData.rubricId === r.id
                              ? 'bg-cyan-500/10 border-cyan-500 text-white'
                              : 'bg-slate-900/60 border-white/5 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{r.name}</div>
                          <div className="text-[11px] text-gray-400 mt-1">{r.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 flex items-center gap-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleManualSubmit}
                      disabled={isAnalyzing}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-blue-500 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Run AI Evaluation</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REAL-TIME PROGRESS OVERLAY */}
          {isAnalyzing && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="max-w-md w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Analyzing Repository</h3>
                  <p className="text-xs text-cyan-300 mt-1">
                    AI Hackathon Judge is evaluating code quality & presentation
                  </p>
                </div>

                <div className="space-y-2 text-left bg-slate-950/70 p-4 rounded-2xl border border-white/5 max-h-56 overflow-y-auto">
                  {analysisSteps.map((step, idx) => (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                        idx < analysisStepIndex
                          ? 'text-emerald-400'
                          : idx === analysisStepIndex
                          ? 'text-cyan-300 font-bold'
                          : 'text-gray-400 opacity-40'
                      }`}
                    >
                      {idx < analysisStepIndex ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : idx === analysisStepIndex ? (
                        <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-gray-400">
                  Redirecting to your full evaluation dashboard...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#070a13] flex items-center justify-center text-cyan-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold">Loading HackScore AI...</span>
          </div>
        </div>
      }
    >
      <SubmitContent />
    </React.Suspense>
  );
}
