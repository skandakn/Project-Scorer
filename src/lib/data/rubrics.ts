import { RubricPreset } from '../types';

export const DEFAULT_CRITERIA = [
  { id: 'innovation', name: 'Innovation & Originality', weight: 15, description: 'Novelty of the approach, uniqueness vs existing solutions.' },
  { id: 'problem_relevance', name: 'Problem & Relevance', weight: 10, description: 'Clarity and severity of problem statement and target audience alignment.' },
  { id: 'technical_impl', name: 'Technical Implementation', weight: 20, description: 'Architecture, code quality, engineering complexity, error handling.' },
  { id: 'ui_ux', name: 'UI/UX & Design', weight: 10, description: 'Visual polish, user flow, usability, responsiveness and accessibility.' },
  { id: 'functionality', name: 'Functionality & Execution', weight: 15, description: 'Working end-to-end features, reliability, handling edge cases.' },
  { id: 'impact', name: 'Impact & Feasibility', weight: 10, description: 'Real-world usefulness, practical feasibility and measurable benefits.' },
  { id: 'scalability', name: 'Scalability', weight: 5, description: 'System design capability to handle growth in users and data load.' },
  { id: 'ai_tech_usage', name: 'AI / Technology Usage', weight: 5, description: 'Effective and justified use of advanced technologies or AI models.' },
  { id: 'presentation', name: 'Presentation & Storytelling', weight: 5, description: 'Clarity of the pitch, communication of value, narrative structure.' },
  { id: 'demo_readiness', name: 'Demo Readiness', weight: 5, description: 'Preparedness of the live demo, fallback plans, smooth demonstration.' },
];

export const RUBRIC_PRESETS: RubricPreset[] = [
  {
    id: 'general',
    name: 'General Hackathon',
    description: 'Balanced scoring rubric standard across major global hackathons.',
    criteria: DEFAULT_CRITERIA,
  },
  {
    id: 'ai_hackathon',
    name: 'AI & Machine Learning',
    description: 'Focuses heavily on model integration, prompt engineering, agentic pipelines, and novelty.',
    criteria: [
      { id: 'ai_tech_usage', name: 'AI Architecture & Agentic Design', weight: 25, description: 'Depth of model usage, fine-tuning, RAG, agent workflows, tool use.' },
      { id: 'technical_impl', name: 'Technical Implementation', weight: 20, description: 'System engineering, pipeline robustness, latency, API reliability.' },
      { id: 'innovation', name: 'AI Innovation & Novelty', weight: 20, description: 'Creative application of generative or predictive models.' },
      { id: 'functionality', name: 'Functionality & Execution', weight: 15, description: 'Reliable outputs, edge case mitigation, guardrails.' },
      { id: 'ui_ux', name: 'AI UX & User Interaction', weight: 10, description: 'Intuitive AI response streaming, conversational flows, latency masking.' },
      { id: 'impact', name: 'Impact & Problem Severity', weight: 10, description: 'Meaningful utility beyond simple wrapper applications.' },
    ],
  },
  {
    id: 'startup',
    name: 'Startup & Venture Track',
    description: 'Evaluated from an angel investor and product-market fit perspective.',
    criteria: [
      { id: 'problem_relevance', name: 'Problem Severity & Market Need', weight: 20, description: 'Validated acute pain point in a large addressable market.' },
      { id: 'impact', name: 'Business Model & Unit Economics', weight: 20, description: 'Go-to-market strategy, monetization potential, defensibility.' },
      { id: 'innovation', name: 'Defensible Moat & Differentiation', weight: 15, description: 'Competitive moat, unique insight, barriers to entry.' },
      { id: 'functionality', name: 'Product Execution & Traction', weight: 15, description: 'Minimum viable product quality and demonstrable customer value.' },
      { id: 'presentation', name: 'Investor Pitch & Storytelling', weight: 15, description: 'Compelling founder narrative, clear problem-solution vision.' },
      { id: 'ui_ux', name: 'Customer UX & Retention Flow', weight: 15, description: 'Seamless onboarding, clean interface, quick time-to-value.' },
    ],
  },
  {
    id: 'sustainability',
    name: 'Sustainability & Climate Tech',
    description: 'Prioritizes measurable carbon reduction, ESG impact, and circular economy metrics.',
    criteria: [
      { id: 'impact', name: 'Environmental Impact & Measurability', weight: 30, description: 'Quantifiable ecological benefit, carbon footprint reduction.' },
      { id: 'innovation', name: 'Green Innovation & Circularity', weight: 20, description: 'Novel approaches to resource efficiency and eco-resilience.' },
      { id: 'technical_impl', name: 'Technical Feasibility & Sensor Tech', weight: 20, description: 'IoT integration, environmental datasets, system durability.' },
      { id: 'functionality', name: 'Working Prototype & Validation', weight: 15, description: 'Operational prototype demonstrating real data acquisition.' },
      { id: 'scalability', name: 'Global Scalability & Deployment', weight: 15, description: 'Adaptability across diverse geographic and economic regions.' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & MedTech',
    description: 'Rigorous criteria emphasizing clinical safety, privacy compliance, and diagnostic utility.',
    criteria: [
      { id: 'technical_impl', name: 'Clinical Accuracy & Data Privacy (HIPAA)', weight: 25, description: 'Rigorous data handling, encryption, medical validation safeguards.' },
      { id: 'impact', name: 'Patient Outcome & Healthcare Impact', weight: 25, description: 'Tangible reduction in mortality, triage time, or caregiver burnout.' },
      { id: 'problem_relevance', name: 'Clinical Need & Doctor Workflow', weight: 15, description: 'Harmonious integration into existing clinical or patient workflows.' },
      { id: 'innovation', name: 'Biomedical / Diagnostic Innovation', weight: 15, description: 'Breakthrough algorithmic or diagnostic approach.' },
      { id: 'ui_ux', name: 'Accessible & Error-Resistant UI', weight: 10, description: 'High contrast, stress-tolerant UI for medical environments.' },
      { id: 'demo_readiness', name: 'Ethical Presentation & Demo Safety', weight: 10, description: 'Clear disclosures on limitations and medical disclaimers.' },
    ],
  },
  {
    id: 'fintech',
    name: 'FinTech & Web3',
    description: 'Highlights auditability, transactional integrity, cryptography, and regulatory readiness.',
    criteria: [
      { id: 'technical_impl', name: 'Security, Encryption & Smart Contracts', weight: 30, description: 'Zero exploit vulnerabilities, cryptographic proofs, secure vaulting.' },
      { id: 'scalability', name: 'Transaction Throughput & Concurrency', weight: 20, description: 'Sub-second finality, high TPS, low gas/transaction overhead.' },
      { id: 'functionality', name: 'Financial Accuracy & Edge Cases', weight: 20, description: 'Double-entry integrity, slippage control, balance reconciliations.' },
      { id: 'impact', name: 'Financial Inclusion & Capital Efficiency', weight: 15, description: 'Democratizing access or unlocking dormant financial capital.' },
      { id: 'ui_ux', name: 'Trust-Building & Transparent UI', weight: 15, description: 'Fee transparency, intuitive signing modals, zero dark patterns.' },
    ],
  },
  {
    id: 'web_dev',
    name: 'Web & Mobile Engineering',
    description: 'Focuses on responsive design, Core Web Vitals, accessibility (a11y), and state management.',
    criteria: [
      { id: 'ui_ux', name: 'Design Polish & User Experience', weight: 25, description: 'Typography, visual rhythm, micro-interactions, responsive fluidity.' },
      { id: 'technical_impl', name: 'Frontend Architecture & Performance', weight: 25, description: 'Clean modular code, Core Web Vitals, sub-second LCP, zero bundle bloat.' },
      { id: 'functionality', name: 'Feature Completeness & State Handling', weight: 20, description: 'Optimistic updates, robust cache, offline states, graceful errors.' },
      { id: 'accessibility', name: 'Web Accessibility & Semantic HTML', weight: 15, description: 'WCAG 2.1 AA compliance, keyboard navigation, aria labels.' },
      { id: 'innovation', name: 'Interactive Novelty & Modern Web APIs', weight: 15, description: 'Creative use of WebGPU, WebSockets, PWAs, or Canvas.' },
    ],
  },
  {
    id: 'college',
    name: 'Collegiate / Beginner-Friendly',
    description: 'Encouraging rubric highlighting learning velocity, passion, teamwork, and foundational execution.',
    criteria: [
      { id: 'problem_relevance', name: 'Problem Identification & Empathy', weight: 20, description: 'Understanding real student or community pain points.' },
      { id: 'functionality', name: 'Working Prototype Execution', weight: 20, description: 'Getting a working app up and running over the weekend.' },
      { id: 'technical_impl', name: 'Learning Curve & Tech Exploration', weight: 20, description: 'Trying modern frameworks and ambitious technical challenges.' },
      { id: 'innovation', name: 'Fresh Perspective & Creativity', weight: 15, description: 'Unconventional thinking unburdened by enterprise legacy.' },
      { id: 'presentation', name: 'Demo Clarity & Team Energy', weight: 15, description: 'Engaging enthusiasm, clear explanation of team roles.' },
      { id: 'ui_ux', name: 'Visual Cleanliness & Polish', weight: 10, description: 'Neat layout, readable fonts, coherent color palette.' },
    ],
  },
];
