import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  accentColor: string;
}

export default function QuizCard({ question, options, correctIndex, explanation, accentColor }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  };

  const reset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accentColor }} />
        <h4 className="font-[var(--font-display)] text-lg font-semibold text-card-foreground leading-snug">
          {question}
        </h4>
      </div>

      <div className="flex flex-col gap-2.5 mb-4">
        {options.map((option, i) => {
          const isCorrect = i === correctIndex;
          const isSelected = i === selected;
          let borderColor = 'border-border';
          let bgColor = 'bg-transparent';
          let textColor = 'text-card-foreground';

          if (revealed) {
            if (isCorrect) {
              borderColor = 'border-emerald';
              bgColor = 'bg-emerald/5';
              textColor = 'text-emerald';
            } else if (isSelected && !isCorrect) {
              borderColor = 'border-destructive';
              bgColor = 'bg-destructive/5';
              textColor = 'text-destructive';
            } else {
              textColor = 'text-muted-foreground';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`
                flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border transition-all
                ${borderColor} ${bgColor} ${textColor}
                ${!revealed ? 'hover:border-foreground/30 hover:bg-accent/50' : ''}
                ${revealed ? 'cursor-default' : ''}
              `}
            >
              <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0"
                style={!revealed ? { borderColor: accentColor + '40', color: accentColor } : {}}
              >
                {revealed && isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                ) : revealed && isSelected && !isCorrect ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-lg p-4 mt-2 border"
              style={{
                borderColor: selected === correctIndex ? 'oklch(0.696 0.17 162.48 / 0.3)' : 'oklch(0.577 0.245 27.325 / 0.3)',
                backgroundColor: selected === correctIndex ? 'oklch(0.696 0.17 162.48 / 0.05)' : 'oklch(0.577 0.245 27.325 / 0.05)',
              }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: selected === correctIndex ? 'oklch(0.696 0.17 162.48)' : 'oklch(0.577 0.245 27.325)' }}>
                {selected === correctIndex ? 'Правильно!' : 'Неправильно'}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
            </div>
            <button
              onClick={reset}
              className="mt-3 text-sm font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Попробовать ещё раз
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
