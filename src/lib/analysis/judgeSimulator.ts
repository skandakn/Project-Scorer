import { JudgeObjection, ProjectData } from '../types';

export function generateJudgeObjections(project: ProjectData): JudgeObjection[] {
  const isAI = project.aiModelsTech && project.aiModelsTech.length > 0;
  const target = project.targetUsers || 'target customers';

  return [
    {
      id: 'obj-ai-justification',
      question: isAI
        ? `Why does this problem strictly require AI or LLMs instead of deterministic logic, rules, or standard database queries?`
        : `How does your technology offer a 10x advantage over an optimized rule-based software solution?`,
      whyJudgesAsk:
        'Judges are fatigued by gratuitous "AI wrapper" projects. They want to verify that AI is truly necessary to handle unstructured data, variability, or high-dimensional patterns.',
      suggestedAnswer: isAI
        ? `Our system handles unstructured, unpredictable inputs from ${target} that rigid rule-based systems cannot parse. However, we strictly guardrail the AI: deterministic validation layers verify all output payloads before persisting them.`
        : `Our technical advantage lies in the end-to-end integration and reduced latency, ensuring sub-second response times where existing manual or rule-based tools fail.`,
      evidenceToBring:
        'Show an example input where standard regex or keyword search fails, but your system succeeds.',
      category: 'AI',
    },
    {
      id: 'obj-differentiation',
      question: `What prevents Google, Microsoft, or an established company from replicating your exact feature set in two sprints?`,
      whyJudgesAsk:
        'Judges test for a defensible moat: proprietary data, niche workflow integrations, domain depth, or speed of execution.',
      suggestedAnswer:
        'While large incumbents build generalized platforms, our advantage is hyper-specialized vertical workflow design tailored directly to the daily friction of our users. Our deep integration with their existing ecosystem creates high switching costs.',
      evidenceToBring:
        'Point to your deep API integrations, domain-specific UI design, and customer interview validation.',
      category: 'Business',
    },
    {
      id: 'obj-failure-mode',
      question: `What happens when your primary external API, backend service, or network connection fails mid-operation?`,
      whyJudgesAsk:
        'Judges test system resilience, graceful degradation, and whether you built proper error handling or will crash in production.',
      suggestedAnswer:
        'We implemented optimistic UI updates with automatic retries, exponential backoff, and local offline caching. If an API times out, the user receives an actionable inline retry state rather than an uncaught exception.',
      evidenceToBring:
        'Demonstrate your UI error state or local cache fallback in your codebase.',
      category: 'Technical',
    },
    {
      id: 'obj-scale',
      question: `How would your current technical architecture handle a sudden spike from 10 concurrent users to 1 million users?`,
      whyJudgesAsk:
        'Tests system design maturity: database indexing, caching strategies, queue workers, and horizontal scalability.',
      suggestedAnswer:
        'Our state is decoupled into stateless compute nodes, a Redis caching/queue tier for asynchronous tasks, and database connection pooling. Heavy background tasks are processed via queues rather than blocking synchronous requests.',
      evidenceToBring:
        'Walk through your architecture diagram showing the queue/worker separation and read-replica path.',
      category: 'Scale',
    },
    {
      id: 'obj-technical-limitation',
      question: `What is the single biggest technical limitation or bottleneck currently present in your MVP?`,
      whyJudgesAsk:
        'Tests intellectual honesty and engineering self-awareness. Teams that claim their hackathon project is "flawless" lose judge credibility instantly.',
      suggestedAnswer:
        'Our current bottleneck is the initial cold-start latency during heavy batch requests. To solve this in our production roadmap, we plan to implement Redis pre-caching and model quantization.',
      evidenceToBring:
        'State your latency numbers honestly and explain your step-by-step optimization plan.',
      category: 'Technical',
    },
    {
      id: 'obj-validation',
      question: `How did you validate that real users actually want this, rather than just guessing during the hackathon?`,
      whyJudgesAsk:
        'Judges want to see customer empathy and real-world problem verification rather than a solution searching for a problem.',
      suggestedAnswer:
        'During the hackathon, we interviewed target users, reviewed real Reddit/forum complaints, and tested our prototype with peer teams to validate the core user journey before writing production code.',
      evidenceToBring:
        'Show user survey quotes, interview summaries, or test user feedback metrics.',
      category: 'Product',
    },
    {
      id: 'obj-user-retention',
      question: `Why would a user return to this application daily or weekly instead of trying it once and forgetting it?`,
      whyJudgesAsk:
        'Tests whether your project is an ephemeral novelty or an essential recurring workflow tool.',
      suggestedAnswer:
        'Our app acts as an active workspace and system-of-record. As users accumulate history and project assets, the switching cost increases, and automated digests/notifications bring them back at critical intervals.',
      evidenceToBring:
        'Show the history dashboard and automated notification/digest features in your app.',
      category: 'Product',
    },
    {
      id: 'obj-security',
      question: `What is your security posture regarding user data privacy, API token security, and injection attacks?`,
      whyJudgesAsk:
        'Ensures the team understands modern cybersecurity, sanitized inputs, and secret isolation.',
      suggestedAnswer:
        'All API keys and secrets reside strictly in server-side environment variables. Client inputs are sanitized against injection, and sensitive database records utilize role-based access control.',
      evidenceToBring:
        'Highlight that no API secrets are exposed in the client bundle and show your sanitized server actions.',
      category: 'Security',
    },
    {
      id: 'obj-accuracy',
      question: `How do you measure accuracy and prevent hallucinations or erroneous outputs from misleading the user?`,
      whyJudgesAsk:
        'Crucial for AI projects: testing ground truth, evaluation benchmarks, and human-in-the-loop safeguards.',
      suggestedAnswer:
        'We enforce strict JSON schema validation and deterministic boundary checks. Crucially, the system is designed with a human-in-the-loop paradigm: all suggestions require user review and explicit confirmation before commit.',
      evidenceToBring:
        'Show your structured validation schemas and the confirmation modal in the UI.',
      category: 'AI',
    },
    {
      id: 'obj-real-world-failure',
      question: `Walk me through a scenario where a user gets completely the wrong result from your app. How does the system recover?`,
      whyJudgesAsk:
        'Tests edge-case awareness and recovery UX: undo actions, audit logs, and feedback loops.',
      suggestedAnswer:
        'If an anomalous output is generated, the user can click "Report Anomaly" or "Undo" with one tap. The bad transaction is rolled back, and the prompt context is flagged in our error logging queue for retraining.',
      evidenceToBring:
        'Show the one-click feedback/rollback button in the interface.',
      category: 'Product',
    },
  ];
}

export function evaluateMockAnswer(question: JudgeObjection, answer: string): {
  rating: 'Poor' | 'Adequate' | 'Strong' | 'Outstanding';
  feedback: string;
  pointsAwarded: number;
} {
  const trimmed = answer.trim();
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount < 10) {
    return {
      rating: 'Poor',
      feedback:
        'Answer is too terse. Judges will perceive this as a lack of preparation. Elaborate with concrete architectural specifics and mention the evidence you prepared.',
      pointsAwarded: 25,
    };
  }

  const mentionsEvidence = /data|metric|test|code|demo|prototype|user|security|latency|cache/i.test(trimmed);
  const mentionsTradeoffs = /however|limitation|roadmap|trade-off|bottleneck|future/i.test(trimmed);

  if (wordCount > 40 && mentionsEvidence && mentionsTradeoffs) {
    return {
      rating: 'Outstanding',
      feedback:
        'Superb answer! You balanced technical competence with honest acknowledgment of current limitations and backed it up with concrete evidence.',
      pointsAwarded: 95,
    };
  }

  if (wordCount > 25 && (mentionsEvidence || mentionsTradeoffs)) {
    return {
      rating: 'Strong',
      feedback:
        'Strong defense. Clear logic and solid justification. To make it outstanding, explicitly reference a concrete number or dashboard metric.',
      pointsAwarded: 85,
    };
  }

  return {
    rating: 'Adequate',
    feedback:
      'Covers the basic concept, but lacks specific technical keywords or quantified evidence. Mention exact framework details or validation metrics.',
    pointsAwarded: 65,
  };
}
