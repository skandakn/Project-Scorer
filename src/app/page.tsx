'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import EmergencyModal from '@/components/dashboard/EmergencyModal';
import { useProject } from '@/lib/store/projectContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Palette,
  Mic,
  Flame,
  CheckCircle2,
  Layers,
  ChevronDown,
  BarChart3,
  Award,
  Terminal,
  Activity,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { addNewProject } = useProject();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Hero Instant GitHub Analysis State
  const [heroRepoUrl, setHeroRepoUrl] = useState('');
  const [isHeroAnalyzing, setIsHeroAnalyzing] = useState(false);
  const [heroError, setHeroError] = useState('');

  const handleHeroAnalyze = async (overrideUrl?: string) => {
    const url = (overrideUrl || heroRepoUrl).trim();
    if (!url) {
      setHeroError('Please enter a GitHub repository URL.');
      return;
    }

    setHeroError('');
    setIsHeroAnalyzing(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze repository');
      }

      const data = await res.json();
      addNewProject(data.project, data.evaluation);
      router.push('/evaluation');
    } catch (err: unknown) {
      setIsHeroAnalyzing(false);
      setHeroError(
        err instanceof Error ? err.message : 'Analysis failed. Please verify the GitHub URL.'
      );
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const sampleCategories = [
    { name: 'Innovation', score: 91, max: 100 },
    { name: 'Technical', score: 84, max: 100 },
    { name: 'UI/UX', score: 88, max: 100 },
    { name: 'Impact', score: 92, max: 100 },
    { name: 'Execution', score: 81, max: 100 },
    { name: 'Presentation', score: 86, max: 100 },
  ];

  const faqs = [
    {
      q: 'Does getting a high HackScore guarantee winning a hackathon?',
      a: 'No. Hackathon judging involves human subjective preference, specific track sponsor guidelines, and real-time competitor dynamics. HackScore AI is an assistive diagnostic coach designed to systematically eliminate common project blind spots before live judging.',
    },
    {
      q: 'How does HackScore AI analyze my code if it is in GitHub?',
      a: 'We query the public GitHub REST API to inspect repository structure, dependencies, README completeness, commit velocity, and test coverage. We never execute arbitrary code or clone private repos without explicit token authorization.',
    },
    {
      q: 'What is Judge Attack Mode?',
      a: 'Judge Attack Mode simulates a skeptical, technically rigorous hackathon judge. It generates 10 difficult objection questions (e.g. "Why does this need AI?", "How does this scale to 1M users?"), explains why judges ask them, provides suggested defense answers, and lets you practice interactively.',
    },
    {
      q: 'Can hackathon organizers use HackScore AI in Judge Mode?',
      a: 'Yes! HackScore AI includes a dedicated Judge Mode where judges can view all competing teams, review AI-assisted audits, submit private scoring overrides, and compile collective feedback.',
    },
    {
      q: 'Are custom judging rubrics supported?',
      a: 'Yes. You can select from 8 industry presets (General, AI/ML, Startup Track, Climate Tech, Healthcare, FinTech, Web Dev, Collegiate) or build your own custom weighted criteria in our Rubric Builder.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13] text-gray-100 overflow-x-hidden">
      <Navbar />
      <EmergencyModal />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden">
        {/* Glow Background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-purple-600/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-sm shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Hackathon Judge & Project Coach</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Turn your hackathon project into a{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                judge-ready
              </span>{' '}
              project.
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Paste your public GitHub repository link to get an instant <span className="text-cyan-400 font-semibold">0–100 HackScore</span>, technical code review, skeptical judge objections, and prioritized improvement roadmap.
            </p>

            {/* Instant GitHub Input Bar */}
            <div className="max-w-2xl mx-auto pt-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-500/15 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={heroRepoUrl}
                    onChange={(e) => setHeroRepoUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleHeroAnalyze();
                      }
                    }}
                    placeholder="https://github.com/username/project-repo"
                    disabled={isHeroAnalyzing}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-gray-500 text-sm font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleHeroAnalyze()}
                  disabled={isHeroAnalyzing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isHeroAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>⚡ Analyze Repo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Repo Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
                <span className="text-xs text-gray-400">Try sample:</span>
                {[
                  { label: 'skandakn/Project-Scorer', url: 'https://github.com/skandakn/Project-Scorer' },
                  { label: 'facebook/react', url: 'https://github.com/facebook/react' },
                  { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
                  { label: 'shadcn/ui', url: 'https://github.com/shadcn-ui/ui' },
                ].map((sample) => (
                  <button
                    key={sample.url}
                    type="button"
                    onClick={() => {
                      setHeroRepoUrl(sample.url);
                      handleHeroAnalyze(sample.url);
                    }}
                    disabled={isHeroAnalyzing}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all font-mono"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              {heroError && (
                <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-center">
                  {heroError}
                </div>
              )}
            </div>

            {/* Sub-actions */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="text-xs text-gray-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>Or explore interactive demo projects (AuraMed, EcoSort) &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Sample Score Card Showcase */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="p-6 md:p-8 rounded-3xl glass-panel-glow relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Overall Score Gauge */}
                <div className="flex flex-col items-center text-center shrink-0">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-400 mb-1">
                    Overall HackScore
                  </span>
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        className="stroke-slate-800"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        stroke="#06b6d4"
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * (1 - 87 / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">87</span>
                      <span className="text-xs text-gray-400 font-semibold">/ 100</span>
                    </div>
                  </div>
                  <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Judge Ready
                  </span>
                </div>

                {/* Right: Rubric Breakdown Bars */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400 pb-1 border-b border-white/5">
                    <span>Category Breakdown</span>
                    <span>Score</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sampleCategories.map((cat) => (
                      <div
                        key={cat.name}
                        className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-200">{cat.name}</span>
                          <span className="font-black text-cyan-400">{cat.score}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center sm:text-left text-xs text-gray-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Live code & demo signals evaluated
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <span>Explore Demo Dashboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How It Works */}
      <section className="py-20 border-t border-white/5 bg-[#090d18]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Four-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              How HackScore AI Works
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              From raw code repository to confident, judge-ready live presentation in 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Project',
                desc: 'Enter your project details, GitHub repo, live deployed URL, tech stack, and pitch assets.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'AI Analysis',
                desc: 'Our engine inspects code quality, architecture, design hierarchy, innovation, and impact.',
                icon: Activity,
              },
              {
                step: '03',
                title: '0–100 Score & Roadmaps',
                desc: 'Receive a diagnostic score, see exact weaknesses, and get a prioritized "What to Fix First" roadmap.',
                icon: BarChart3,
              },
              {
                step: '04',
                title: 'Rehearse & Win',
                desc: 'Practice with Judge Attack Mode questions and rehearse tailored 30s/60s/3m pitch scripts.',
                icon: Mic,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="p-6 rounded-2xl glass-card space-y-3 relative group"
                >
                  <span className="text-3xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors">
                    {card.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: What We Evaluate */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Comprehensive Rubrics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              What We Evaluate
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Every dimension hackathon judges secretly evaluate, made transparent and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Technical Implementation (20 pts)',
                desc: 'Architecture patterns, error handling, database schema, security, testing, and GitHub commit rigor.',
                icon: Terminal,
                badge: 'Engineering',
              },
              {
                title: 'Innovation & Novelty (15 pts)',
                desc: 'Is this truly new or just another generic wrapper? Differentiation against existing market alternatives.',
                icon: Sparkles,
                badge: 'Originality',
              },
              {
                title: 'Functionality & Execution (15 pts)',
                desc: 'End-to-end working features, latency, edge cases, and stability of the live deployed demo.',
                icon: Code2,
                badge: 'Execution',
              },
              {
                title: 'Problem & Relevance (10 pts)',
                desc: 'Clarity of the pain point, target user validation, and urgency of the problem being solved.',
                icon: ShieldCheck,
                badge: 'Product',
              },
              {
                title: 'UI/UX & Design (10 pts)',
                desc: 'Visual hierarchy, accessibility (WCAG AA), responsive layout, smooth interactions, and aesthetic polish.',
                icon: Palette,
                badge: 'Design',
              },
              {
                title: 'Impact & Feasibility (10 pts)',
                desc: 'Measurable real-world benefits, financial or operational savings, and realistic go-to-market feasibility.',
                icon: BarChart3,
                badge: 'Impact',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-6 rounded-2xl glass-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Before vs After */}
      <section className="py-20 border-t border-white/5 bg-[#090d18]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Iterative Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Before vs. After HackScore AI
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              See how a typical 36-hour hackathon project levels up before walking onto the judging stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-rose-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                  Before HackScore AI
                </span>
                <span className="text-2xl font-black text-rose-400">68 / 100</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Demo takes 2 minutes of setup before showing the core value.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Zero automated tests; repo lacks installation instructions in README.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Blindsided by judge question: &ldquo;Why does this even need AI?&rdquo;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Pitch runs 45 seconds over the time limit and gets cut off by judges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Venue Wi-Fi drops and the team has zero offline demo backup.</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-xl shadow-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  After HackScore AI Optimization
                </span>
                <span className="text-2xl font-black text-emerald-400">89 / 100</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>3-step punchy demo proves the core value within the first 30 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Architecture diagram & smoke test suite clearly documented in README.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Team rehearsed bulletproof answers to all 10 judge attack objections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Teleprompter-timed 3-minute pitch delivers flawless closing statement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Emergency Demo Mode ready with offline screenshots and video backup.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Judge Mode vs Participant Mode */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Participant Mode */}
            <div className="p-8 rounded-3xl glass-panel space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">For Hackathon Builders</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Build with confidence. Know exactly where your project stands before you present to judges.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Prioritized &ldquo;What Should I Fix First?&rdquo; roadmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Judge Attack Mode interactive mock defense
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Tailored pitch scripts (30s, 60s, 3m, 5m across 6 tones)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  🚨 Demo Emergency recovery mode for Wi-Fi failures
                </li>
              </ul>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Submit Your Project Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Judge Mode */}
            <div className="p-8 rounded-3xl glass-panel space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">For Hackathon Judges</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Streamline evaluation across 50+ competing teams with AI-assisted rubric audits.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Instant technical & code quality summaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Manual score override controls with private notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Configurable track rubrics (AI, FinTech, Health, Climate)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Exportable feedback reports for organizers & participants
                </li>
              </ul>
              <Link
                href="/judge-mode"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-2"
              >
                <span>Explore Judge Mode Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FAQ */}
      <section className="py-20 border-t border-white/5 bg-[#090d18]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">FAQ</span>
            <h2 className="text-3xl font-black text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-white/5 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to become{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              judge-ready?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Analyze your project in 60 seconds. Understand your weaknesses, fix the critical items,
            and present with unshakeable confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Analyze My Project Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-gray-200 font-bold text-sm border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              View Sample Evaluations
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-[#05070f] text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-gray-300">HackScore AI</span>
            <span>— The AI Hackathon Judge & Project Coach</span>
          </div>
          <p className="text-gray-500">
            Engineered for hackathon builders, teams, and judges worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
