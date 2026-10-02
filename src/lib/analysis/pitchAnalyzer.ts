import { PitchDuration, PitchScript, PitchTone, ProjectData } from '../types';

export function generatePitches(project: ProjectData, preferredTone: PitchTone = 'Judge-focused'): Record<PitchDuration, PitchScript> {
  const name = project.name || 'Our Project';
  const problem = project.problemStatement || 'Users experience significant friction in their daily operations.';
  const audience = project.targetUsers || 'target users';
  const tech = [
    ...(project.frontendTech || []),
    ...(project.backendTech || []),
    ...(project.aiModelsTech || []),
  ].slice(0, 4).join(', ') || 'modern web technologies and intelligent APIs';

  const generateSinglePitch = (duration: PitchDuration, tone: PitchTone): PitchScript => {
    let hook = `Every day, thousands of ${audience} lose hours struggling with inefficient workflows.`;
    let whyItMatters = `This friction slows down decision-making, increases errors, and costs organizations significant resources.`;
    let solution = `Meet ${name}: an intelligent, end-to-end platform engineered to eliminate this barrier.`;
    let howItWorks = `By integrating ${tech}, ${name} streamlines the entire workflow into a responsive, real-time experience.`;
    let technology = `Built with ${tech}, featuring robust API boundaries and secure data handling.`;
    let innovation = `Unlike legacy alternatives, our approach provides immediate feedback with zero latency overhead.`;
    let impact = `Initial user benchmarks indicate up to 70% reduction in workflow completion time.`;
    let liveDemoGuide = `Watch as we demonstrate the core 3-step loop: Input -> Real-time Processing -> Instant Result.`;
    let futureScope = `Our roadmap includes multi-tenant enterprise integrations and automated predictive analytics.`;
    let closingStatement = `${name} turns complex obstacles into effortless execution. Thank you!`;

    // Tone variations
    if (tone === 'Technical') {
      hook = `In modern distributed systems, data fragmentation and high latency paralyze operational workflows.`;
      technology = `Our architecture utilizes ${tech} with decoupled microservices, sub-second query latency, and strict schema validation.`;
      innovation = `We replaced synchronous polling with real-time reactive event streams and edge computation.`;
    } else if (tone === 'Startup-style') {
      hook = `What if you could solve an acute multi-billion dollar operational pain point in three clicks?`;
      whyItMatters = `The total addressable market is expanding rapidly, yet incumbents still charge enterprise rates for clunky tools.`;
      closingStatement = `We are capturing this market starting with hackathons and developer teams. Join our journey with ${name}!`;
    } else if (tone === 'Storytelling' || tone === 'Emotional') {
      hook = `Picture this: it is 2 AM, deadlines are closing in, and your tools break right when you need them most.`;
      solution = `We built ${name} because we lived this pain ourselves. We wanted a tool that feels like a natural extension of human thought.`;
    }

    let fullScript = '';
    const breakdown: PitchScript['breakdown'] = [];

    if (duration === '30s') {
      fullScript = `${hook} ${problem} That is why we built ${name}: ${solution} Powered by ${tech}, we cut processing time by over 70%. In our live demo right now, watch how fast it executes. ${name} transforms how ${audience} work. Thank you!`;
      breakdown.push(
        { title: 'The Hook & Problem', content: `${hook} ${problem}`, durationSeconds: 8, tips: 'Make eye contact with all judges.' },
        { title: 'The Solution & Tech', content: `${solution} Powered by ${tech}.`, durationSeconds: 12, tips: 'Point to the screen.' },
        { title: 'The Call to Action', content: `${liveDemoGuide} ${closingStatement}`, durationSeconds: 10, tips: 'Deliver with confident smile.' }
      );
    } else if (duration === '60s') {
      fullScript = `${hook} Today, ${problem} ${whyItMatters}\n\nWe created ${name}. ${solution}\n\nHere is how it works: ${howItWorks}\n\nBy leveraging ${technology}, our platform delivers ${impact}\n\nWatch our live demonstration right now as we show the core loop in action. ${closingStatement}`;
      breakdown.push(
        { title: 'The Acute Problem', content: `${hook} ${problem}`, durationSeconds: 15, tips: 'Establish clear urgency.' },
        { title: 'The Solution & Innovation', content: `${solution} ${innovation}`, durationSeconds: 20, tips: 'Show UI on primary monitor.' },
        { title: 'Technical Power & Live Demo', content: `${technology} ${liveDemoGuide}`, durationSeconds: 15, tips: 'Execute live click.' },
        { title: 'Impact & Closing', content: `${impact} ${closingStatement}`, durationSeconds: 10, tips: 'Invite judge questions.' }
      );
    } else if (duration === '3m') {
      fullScript = `Judges, ${hook}\n\n${problem}\n\n${whyItMatters}\n\nOur team built ${name}: ${solution}\n\nLet us break down our technical architecture:\n1. Frontend & Client: Engineered with ${project.frontendTech?.join(', ') || 'modern TypeScript frameworks'} for instant responsiveness.\n2. Backend & Intelligence: Powered by ${project.backendTech?.join(', ') || 'scalable APIs'} and ${project.aiModelsTech?.join(', ') || 'intelligent models'}.\n3. Reliability: Sanitized inputs, robust error boundaries, and low-latency storage.\n\nNotice on our live dashboard: as we execute this action, ${liveDemoGuide}\n\nIn our validation testing, ${impact}\n\nLooking forward, ${futureScope}\n\n${closingStatement}`;
      breakdown.push(
        { title: 'The Problem & Market Stakes', content: `${hook} ${problem} ${whyItMatters}`, durationSeconds: 30, tips: 'Command the room.' },
        { title: 'The Solution: Introducing Project', content: `${solution}`, durationSeconds: 30, tips: 'Show brand logo & tagline.' },
        { title: 'Technical Architecture & Moat', content: `${technology} ${innovation}`, durationSeconds: 45, tips: 'Walk through architecture diagram.' },
        { title: 'Live Interactive Demo', content: `${liveDemoGuide}`, durationSeconds: 45, tips: 'Keep hands steady and walk through steps.' },
        { title: 'Impact, Roadmap & Q&A', content: `${impact} ${futureScope} ${closingStatement}`, durationSeconds: 30, tips: 'Step forward for Q&A.' }
      );
    } else {
      // 5-minute presentation
      fullScript = `Good afternoon, esteemed judges.\n\n${hook}\n\n${problem}\n\n${whyItMatters}\n\nWe founded ${name} to bridge this gap. ${solution}\n\nHere is how our technical architecture operates from top to bottom:\n1. Architecture: Clean separation of concerns with ${tech}.\n2. Real-World Robustness: Error states, input validation, and reliable fallback logic.\n3. Security & Privacy: Zero exposed credentials and strict role-based data handling.\n\nLet us demonstrate the system live...\n${liveDemoGuide}\n\nNotice that the user receives immediate clarity without waiting for complex manual processes.\n\nIn terms of validation: ${impact}\n\nOur business and scalability vision: ${futureScope}\n\nThank you, and we welcome your questions!`;
      breakdown.push(
        { title: 'The Macro Problem', content: `${hook} ${problem}`, durationSeconds: 45, tips: 'High gravity and clear metrics.' },
        { title: 'Why Existing Tools Fail', content: `${whyItMatters} ${innovation}`, durationSeconds: 45, tips: 'Contrast with competitors.' },
        { title: 'Deep Technical Architecture', content: `${technology}`, durationSeconds: 90, tips: 'Demonstrate engineering depth.' },
        { title: 'Live Interactive Demonstration', content: `${liveDemoGuide}`, durationSeconds: 75, tips: 'Flawless execution.' },
        { title: 'Business Impact, Roadmap & Closing', content: `${impact} ${futureScope} ${closingStatement}`, durationSeconds: 45, tips: 'Confident final words.' }
      );
    }

    return {
      duration,
      tone,
      hook,
      problem,
      whyItMatters,
      solution,
      howItWorks,
      technology,
      innovation,
      impact,
      liveDemoGuide,
      futureScope,
      closingStatement,
      fullScript,
      breakdown,
    };
  };

  return {
    '30s': generateSinglePitch('30s', preferredTone),
    '60s': generateSinglePitch('60s', preferredTone),
    '3m': generateSinglePitch('3m', preferredTone),
    '5m': generateSinglePitch('5m', preferredTone),
  };
}
