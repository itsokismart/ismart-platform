import { Section } from '@/lib/dashboardData';
import { useProgress } from '@/contexts/ProgressContext';
import { Check } from 'lucide-react';

interface ProgressTrackerProps {
  sections: Section[];
  activeSection: string;
  accentColor: string;
  dashboardSlug: string;
  onSectionClick: (id: string) => void;
}

export default function ProgressTracker({
  sections,
  activeSection,
  accentColor,
  dashboardSlug,
  onSectionClick,
}: ProgressTrackerProps) {
  const { progress, toggleSection, getModuleProgress } = useProgress();
  const moduleProgress = progress[dashboardSlug] || {};
  const { completed, total, percent } = getModuleProgress(dashboardSlug);

  return (
    <nav className="hidden xl:block sticky top-24 w-60 shrink-0">
      {/* Module progress bar */}
      <div className="mb-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Прогресс
          </p>
          <span className="text-xs font-bold" style={{ color: accentColor }}>
            {percent}%
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {completed} из {total} разделов пройдено
        </p>
      </div>

      {/* Section list with checkboxes */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Содержание
      </p>
      <div className="flex flex-col gap-0.5">
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          const isCompleted = moduleProgress[s.id] || false;
          return (
            <div key={s.id} className="flex items-start gap-1.5 group">
              {/* Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(dashboardSlug, s.id);
                }}
                className={`
                  mt-1.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center
                  border transition-all duration-200
                  ${isCompleted
                    ? 'border-transparent'
                    : 'border-muted-foreground/30 hover:border-muted-foreground/60'
                  }
                `}
                style={isCompleted ? { backgroundColor: accentColor } : {}}
                title={isCompleted ? 'Отметить как непройденный' : 'Отметить как пройденный'}
              >
                {isCompleted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>

              {/* Section title */}
              <button
                onClick={() => onSectionClick(s.id)}
                className={`
                  text-left text-xs py-1.5 pl-1 border-l-2 transition-all leading-snug flex-1
                  ${isCompleted ? 'line-through opacity-60' : ''}
                  ${isActive
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                  }
                `}
                style={isActive ? { borderColor: accentColor, color: accentColor } : {}}
              >
                {s.title}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
