'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

export default function SubmitPage() {
  const router = useRouter();
  const { addNewProject, rubrics } = useProject();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  // Form State
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
  const [errorMessage, setErrorMessage] = useState('');

  // Analysis Checklist Steps
  const analysisSteps = [
    'Understanding problem statement & target audience',
    'Reviewing innovation & market differentiation',
    'Inspecting GitHub repository metadata & dependencies',
    'Evaluating system architecture & code organization',
    'Evaluating UI/UX design & responsiveness signals',
    'Checking product experience & demo stability',
    'Evaluating real-world impact & economic feasibility',
    'Reviewing presentation narrative & hook strength',
    'Identifying skeptical judge objections & failure scenarios',
    'Generating prioritized improvement roadmap',
  ];

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

  const handleSubmitAnalysis = async () => {
    setErrorMessage('');
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    // Simulate animated step-by-step progress
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
        : [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          ],
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

      // Short delay to let user see final checkmark
      setTimeout(() => {
        router.push(`/evaluation`);
      }, 600);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMessage(err instanceof Error ? err.message : 'Analysis failed. Please check network.');
    }
  };

  const activeRubricPreset =
    rubrics.find((r) => r.id === formData.rubricId) || rubrics[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13]">
      <Navbar />
      <EmergencyModal />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Project Submission Wizard
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Submit Your Project for AI Evaluation
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Provide project details, code repository, and live links. We analyze real artifacts to
              give you actionable feedback before judging.
            </p>

            {/* Stepper Indicator */}
            <div className="mt-6 flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
              {[
                { step: 1, label: 'Basics' },
                { step: 2, label: 'Links' },
                { step: 3, label: 'Tech Stack' },
                { step: 4, label: 'Artifacts' },
                { step: 5, label: 'Rubric' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === s.step
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                        : currentStep > s.step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden sm:inline ${
                      currentStep === s.step ? 'text-cyan-400' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Project Basics */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
                  Step 1 — Project Basics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AuraMed AI"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Ambient clinical voice copilot for doctors"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Hackathon Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HackMIT 2026"
                      value={formData.hackathonName || ''}
                      onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Hackathon Theme / Track
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI for Healthcare"
                      value={formData.hackathonTheme || ''}
                      onChange={(e) => setFormData({ ...formData, hackathonTheme: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Team Name</label>
                    <input
                      type="text"
                      placeholder="e.g. NeuralPulse"
                      value={formData.teamName || ''}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Team Members (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex (ML), Maya (Doctor), Sam (Frontend)"
                      value={teamMembersInput}
                      onChange={(e) => setTeamMembersInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Problem Statement *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What exact pain point does this solve? Be specific about who suffers and the cost."
                    value={formData.problemStatement || ''}
                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Project Category
                    </label>
                    <select
                      value={formData.category || 'AI & Machine Learning'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                      <option value="Sustainability & Climate">Sustainability & Climate</option>
                      <option value="FinTech & Web3">FinTech & Web3</option>
                      <option value="EdTech & Learning">EdTech & Learning</option>
                      <option value="Disaster & Public Safety">Disaster & Public Safety</option>
                      <option value="Developer Tools & Infrastructure">Developer Tools</option>
                      <option value="Collegiate / General">Collegiate / General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Target Users</label>
                    <input
                      type="text"
                      placeholder="e.g. Emergency room clinicians and hospital scribes"
                      value={formData.targetUsers || ''}
                      onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Project Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe how the solution works end-to-end, the key workflow, and its core capabilities."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Project Links */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
                  Step 2 — Project Links
                </h3>
                <p className="text-xs text-gray-400">
                  We inspect public GitHub repositories and live websites to verify commits,
                  deployment status, responsive viewport tags, and latency.
                </p>

                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                    GitHub Repository (Public)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/organization/repo-name"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Live Deployed Website / Web App
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project.vercel.app"
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    Demo Video Link (YouTube, Loom, Vimeo)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtu.be/your-demo"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                      <Palette className="w-3.5 h-3.5 text-pink-400" />
                      Figma Design System Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://figma.com/@project"
                      value={formData.figmaUrl || ''}
                      onChange={(e) => setFormData({ ...formData, figmaUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Slide Deck Link (Slides, SpeakerDeck)
                    </label>
                    <input
                      type="url"
                      placeholder="https://speakerdeck.com/your-pitch"
                      value={formData.presentationUrl || ''}
                      onChange={(e) => setFormData({ ...formData, presentationUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Technical Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
                  Step 3 — Technical Information & Architecture
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Frontend Frameworks & Libraries
                    </label>
                    <input
                      type="text"
                      value={frontendInput}
                      onChange={(e) => setFrontendInput(e.target.value)}
                      placeholder="e.g. Next.js 15, TypeScript, Tailwind CSS, Radix UI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Backend & Microservices
                    </label>
                    <input
                      type="text"
                      value={backendInput}
                      onChange={(e) => setBackendInput(e.target.value)}
                      placeholder="e.g. FastAPI, Node.js, WebSockets, Celery"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Database & Caching Tier
                    </label>
                    <input
                      type="text"
                      value={dbInput}
                      onChange={(e) => setDbInput(e.target.value)}
                      placeholder="e.g. PostgreSQL, pgvector, Redis"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      AI / Machine Learning Models
                    </label>
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g. OpenAI Whisper v3, Llama-3-70b, pgvector RAG"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Cloud & Deployment Services
                    </label>
                    <input
                      type="text"
                      value={cloudInput}
                      onChange={(e) => setCloudInput(e.target.value)}
                      placeholder="e.g. Vercel, AWS EC2, Cloudflare"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Authentication & Security
                    </label>
                    <input
                      type="text"
                      value={authInput}
                      onChange={(e) => setAuthInput(e.target.value)}
                      placeholder="e.g. Clerk, NextAuth, JWT, MFA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">APIs Used</label>
                    <input
                      type="text"
                      value={apiInput}
                      onChange={(e) => setApiInput(e.target.value)}
                      placeholder="e.g. FHIR REST API, OpenStreetMap, Twilio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Third-Party Integrations
                    </label>
                    <input
                      type="text"
                      value={integrationsInput}
                      onChange={(e) => setIntegrationsInput(e.target.value)}
                      placeholder="e.g. Slack Webhooks, Stripe, Hardware Sensors"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Uploads & Artifacts */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
                  Step 4 — Artifacts & Screenshots
                </h3>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Interface Screenshot URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    value={screenshotInput}
                    onChange={(e) => setScreenshotInput(e.target.value)}
                    placeholder="https://.../screenshot1.png, https://.../screenshot2.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Tip: Upload screenshots to Imgur or GitHub and paste the direct image URLs here.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Architecture Diagram Summary / Flow
                  </label>
                  <textarea
                    rows={3}
                    value={formData.architectureDiagram || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, architectureDiagram: e.target.value })
                    }
                    placeholder="e.g. Client WebAudio Stream -> WebSocket Gateway -> Whisper v3 -> LLM Extraction -> FHIR DB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Pitch Notes / Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formData.pitchDoc || ''}
                    onChange={(e) => setFormData({ ...formData, pitchDoc: e.target.value })}
                    placeholder="Key talking points or customer quote highlights you plan to mention during judging."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Judging Criteria & Rubric Selection */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
                  Step 5 — Select Judging Rubric & Weights
                </h3>
                <p className="text-xs text-gray-400">
                  Different hackathons use different rubrics. Select the preset that matches your
                  hackathon or track to tailor your 0–100 score.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rubrics.map((r) => {
                    const isSelected = (formData.rubricId || 'general') === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, rubricId: r.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{r.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {r.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Criteria breakdown of active preset */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider block mb-2">
                    Active Rubric Criteria: {activeRubricPreset.name} (Total: 100 points)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeRubricPreset.criteria.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5"
                      >
                        <span className="text-gray-300 truncate">{c.name}</span>
                        <span className="font-black text-cyan-400 shrink-0 ml-2">
                          {c.weight} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAnalysis}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Analyze Project</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Analysis Progress Modal Overlay (Requirement 5) */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090e1a] border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-950/50 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="text-xl font-black text-white">Analyzing Project...</h3>
              <p className="text-xs text-gray-400">
                Evaluating against hackathon judging criteria and inspecting accessible repository
                artifacts.
              </p>
            </div>

            {/* Animated Step List */}
            <div className="space-y-2.5 pt-2">
              {analysisSteps.map((step, idx) => {
                const isPassed = idx < analysisStepIndex;
                const isCurrent = idx === analysisStepIndex;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                      isPassed
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-cyan-300 font-bold'
                        : 'text-gray-600'
                    }`}
                  >
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      )}
                    </div>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center text-[11px] text-gray-500 italic">
              *Verifying real accessible repository information. No faked metrics.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
