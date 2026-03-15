import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { dashboards } from '@/lib/dashboardData';

interface ProgressState {
  [dashboardSlug: string]: {
    [sectionId: string]: boolean;
  };
}

interface ProgressContextType {
  progress: ProgressState;
  toggleSection: (dashboardSlug: string, sectionId: string) => void;
  markSection: (dashboardSlug: string, sectionId: string, completed: boolean) => void;
  getModuleProgress: (dashboardSlug: string) => { completed: number; total: number; percent: number };
  getOverallProgress: () => { completed: number; total: number; percent: number };
  resetProgress: () => void;
}

const STORAGE_KEY = 'ai-learning-progress';

const ProgressContext = createContext<ProgressContextType | null>(null);

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleSection = useCallback((dashboardSlug: string, sectionId: string) => {
    setProgress((prev) => {
      const moduleProgress = prev[dashboardSlug] || {};
      const current = moduleProgress[sectionId] || false;
      return {
        ...prev,
        [dashboardSlug]: {
          ...moduleProgress,
          [sectionId]: !current,
        },
      };
    });
  }, []);

  const markSection = useCallback((dashboardSlug: string, sectionId: string, completed: boolean) => {
    setProgress((prev) => {
      const moduleProgress = prev[dashboardSlug] || {};
      return {
        ...prev,
        [dashboardSlug]: {
          ...moduleProgress,
          [sectionId]: completed,
        },
      };
    });
  }, []);

  const getModuleProgress = useCallback(
    (dashboardSlug: string) => {
      const dashboard = dashboards.find((d) => d.slug === dashboardSlug);
      if (!dashboard) return { completed: 0, total: 0, percent: 0 };
      const total = dashboard.sections.length;
      const moduleProgress = progress[dashboardSlug] || {};
      const completed = dashboard.sections.filter((s) => moduleProgress[s.id]).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percent };
    },
    [progress]
  );

  const getOverallProgress = useCallback(() => {
    let totalSections = 0;
    let completedSections = 0;
    for (const d of dashboards) {
      totalSections += d.sections.length;
      const moduleProgress = progress[d.slug] || {};
      completedSections += d.sections.filter((s) => moduleProgress[s.id]).length;
    }
    const percent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    return { completed: completedSections, total: totalSections, percent };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  return (
    <ProgressContext.Provider
      value={{ progress, toggleSection, markSection, getModuleProgress, getOverallProgress, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
