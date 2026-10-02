'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectData,
  EvaluationResult,
  RubricPreset,
  JudgeTeamFeedback,
} from '../types';
import { DEMO_PROJECTS } from '../data/demoProjects';
import { RUBRIC_PRESETS } from '../data/rubrics';

interface ProjectContextType {
  projects: ProjectData[];
  evaluations: Record<string, EvaluationResult>;
  activeProjectId: string;
  activeProject: ProjectData;
  activeEvaluation: EvaluationResult;
  rubrics: RubricPreset[];
  activeRubric: RubricPreset;
  setActiveProjectId: (id: string) => void;
  addNewProject: (project: ProjectData, evaluation: EvaluationResult) => void;
  reanalyzeProject: (projectId: string, customWeights?: Record<string, number>) => Promise<EvaluationResult>;
  updateChecklist: (itemId: string, completed: boolean) => void;
  updateJudgeFeedback: (feedback: JudgeTeamFeedback) => void;
  judgeFeedbacks: Record<string, JudgeTeamFeedback>;
  toggleEmergencyDemo: (open?: boolean) => void;
  isEmergencyDemoOpen: boolean;
  selectedCompareA: string;
  selectedCompareB: string;
  setSelectedCompareA: (id: string) => void;
  setSelectedCompareB: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  // Initialize with the 5 demo projects
  const initialProjects = DEMO_PROJECTS.map((d) => d.project);
  const initialEvaluations = DEMO_PROJECTS.reduce<Record<string, EvaluationResult>>((acc, d) => {
    acc[d.project.id] = d.evaluation;
    return acc;
  }, {});

  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>(initialEvaluations);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialProjects[0].id);
  const [isEmergencyDemoOpen, setIsEmergencyDemoOpen] = useState(false);
  const [judgeFeedbacks, setJudgeFeedbacks] = useState<Record<string, JudgeTeamFeedback>>({});

  // Comparison defaults
  const [selectedCompareA, setSelectedCompareA] = useState<string>(initialProjects[0].id);
  const [selectedCompareB, setSelectedCompareB] = useState<string>(initialProjects[1].id);

  // Load persisted projects from localStorage if available
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('hackscore_projects');
      const savedEvals = localStorage.getItem('hackscore_evaluations');
      const savedActiveId = localStorage.getItem('hackscore_active_id');

      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with demo projects to guarantee demo projects are always present
          const existingIds = new Set(parsed.map((p: ProjectData) => p.id));
          const missingDemos = initialProjects.filter((d) => !existingIds.has(d.id));
          setProjects([...parsed, ...missingDemos]);
        }
      }

      if (savedEvals) {
        const parsedEvals = JSON.parse(savedEvals);
        setEvaluations((prev) => ({ ...prev, ...parsedEvals }));
      }

      if (savedActiveId) {
        setActiveProjectId(savedActiveId);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save changes to localStorage
  const saveState = (newProjects: ProjectData[], newEvals: Record<string, EvaluationResult>, newActiveId: string) => {
    try {
      localStorage.setItem('hackscore_projects', JSON.stringify(newProjects));
      localStorage.setItem('hackscore_evaluations', JSON.stringify(newEvals));
      localStorage.setItem('hackscore_active_id', newActiveId);
    } catch {
      // Ignore quota errors
    }
  };

  const handleSetActiveProject = (id: string) => {
    setActiveProjectId(id);
    try {
      localStorage.setItem('hackscore_active_id', id);
    } catch {
      // Ignore
    }
  };

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || initialProjects[0];

  const activeEvaluation =
    evaluations[activeProject.id] || initialEvaluations[initialProjects[0].id];

  const activeRubric =
    RUBRIC_PRESETS.find((r) => r.id === activeProject.rubricId) || RUBRIC_PRESETS[0];

  const addNewProject = (project: ProjectData, evaluation: EvaluationResult) => {
    const updatedProjects = [project, ...projects.filter((p) => p.id !== project.id)];
    const updatedEvals = { ...evaluations, [project.id]: evaluation };
    setProjects(updatedProjects);
    setEvaluations(updatedEvals);
    setActiveProjectId(project.id);
    saveState(updatedProjects, updatedEvals, project.id);
  };

  const reanalyzeProject = async (
    projectId: string,
    customWeights?: Record<string, number>
  ): Promise<EvaluationResult> => {
    const targetProject = projects.find((p) => p.id === projectId) || activeProject;
    const updatedProject: ProjectData = {
      ...targetProject,
      version: targetProject.version + 1,
      customWeights: customWeights || targetProject.customWeights,
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject),
    });

    if (!res.ok) {
      throw new Error('Analysis failed');
    }

    const data = await res.json();
    const newEval: EvaluationResult = data.evaluation;

    const updatedProjects = projects.map((p) => (p.id === projectId ? updatedProject : p));
    const updatedEvals = { ...evaluations, [projectId]: newEval };

    setProjects(updatedProjects);
    setEvaluations(updatedEvals);
    saveState(updatedProjects, updatedEvals, projectId);

    return newEval;
  };

  const updateChecklist = (itemId: string, completed: boolean) => {
    if (!activeEvaluation) return;
    const updatedEval = {
      ...activeEvaluation,
      checklistStatus: {
        ...activeEvaluation.checklistStatus,
        [itemId]: completed,
      },
    };
    const updatedEvals = { ...evaluations, [activeProject.id]: updatedEval };
    setEvaluations(updatedEvals);
    try {
      localStorage.setItem('hackscore_evaluations', JSON.stringify(updatedEvals));
    } catch {
      // Ignore
    }
  };

  const updateJudgeFeedback = (feedback: JudgeTeamFeedback) => {
    setJudgeFeedbacks((prev) => ({
      ...prev,
      [feedback.projectId]: feedback,
    }));
  };

  const toggleEmergencyDemo = (open?: boolean) => {
    setIsEmergencyDemoOpen((prev) => (open !== undefined ? open : !prev));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        evaluations,
        activeProjectId,
        activeProject,
        activeEvaluation,
        rubrics: RUBRIC_PRESETS,
        activeRubric,
        setActiveProjectId: handleSetActiveProject,
        addNewProject,
        reanalyzeProject,
        updateChecklist,
        updateJudgeFeedback,
        judgeFeedbacks,
        toggleEmergencyDemo,
        isEmergencyDemoOpen,
        selectedCompareA,
        selectedCompareB,
        setSelectedCompareA,
        setSelectedCompareB,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
