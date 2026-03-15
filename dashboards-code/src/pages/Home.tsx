import { dashboards } from '@/lib/dashboardData';
import Header from '@/components/Header';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Cpu, Database, Code2, Wrench, Bot, Settings, Zap, Eye, Trophy, RotateCcw } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const moduleIcons = [BookOpen, Cpu, Database, Code2, Wrench, Bot, Settings, Zap, Eye];

export default function Home() {
  const { getModuleProgress, getOverallProgress, resetProgress } = useProgress();
  const overall = getOverallProgress();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, oklch(0.637 0.237 25.331), transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, oklch(0.623 0.214 259.815), transparent)' }} />
        </div>

        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6 tracking-wide">
              iSmart Platform / Module 0
            </span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              Интерактивный курс
              <br />
              <span className="bg-gradient-to-r from-coral via-sapphire to-amethyst bg-clip-text text-transparent">
                по искусственному интеллекту
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              От фундаментальных концепций до практического развёртывания локальных LLM, RAG-систем, Text-to-SQL, файн-тюнинга моделей и разработки ИИ-агентов.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { value: '9', label: 'Модулей' },
              { value: '80+', label: 'Разделов' },
              { value: '18', label: 'Квизов' },
              { value: '25+', label: 'Примеров кода' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="font-[var(--font-display)] text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Overall progress section */}
      <section className="container pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Left: progress info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                    Прогресс курса
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {overall.completed} из {overall.total} разделов пройдено
                  </p>
                </div>
              </div>

              {/* Overall progress bar */}
              <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-coral via-sapphire to-emerald"
                  style={{ width: `${overall.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{overall.percent}%</span>
                {overall.completed > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Сбросить весь прогресс курса? Это действие нельзя отменить.')) {
                        resetProgress();
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Сбросить
                  </button>
                )}
              </div>
            </div>

            {/* Right: module mini-bars */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:w-80">
              {dashboards.slice(0, 9).map((d) => {
                const mp = getModuleProgress(d.slug);
                return (
                  <Link
                    key={d.id}
                    href={`/dashboard/${d.slug}`}
                    className="no-underline group"
                  >
                    <div className="text-center">
                      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                          style={{ width: `${mp.percent}%`, backgroundColor: d.color }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        {d.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Module cards */}
      <section className="container pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((d, i) => {
            const Icon = moduleIcons[i] || BookOpen;
            const mp = getModuleProgress(d.slug);
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/dashboard/${d.slug}`}
                  className="group block no-underline"
                >
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Card hero image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={d.heroImage}
                        alt={d.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${d.color}aa 0%, transparent 60%)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: d.color + '30' }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                        Модуль {d.moduleNumber}
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="p-5">
                      <h3 className="font-[var(--font-display)] text-xl font-bold text-card-foreground mb-1.5 group-hover:text-foreground transition-colors">
                        {d.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                        {d.subtitle}
                      </p>

                      {/* Module progress bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-muted-foreground">
                            {mp.completed} из {mp.total} разделов
                          </span>
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: mp.percent > 0 ? d.color : undefined }}
                          >
                            {mp.percent}%
                          </span>
                        </div>
                        <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                            style={{ width: `${mp.percent}%`, backgroundColor: d.color }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {mp.percent === 100 ? 'Завершён' : mp.percent > 0 ? 'В процессе' : 'Не начат'}
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all"
                          style={{ color: d.color }}
                        >
                          {mp.percent === 100 ? 'Повторить' : 'Изучить'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              iSmart Platform — AI Learning Dashboards
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Учебные материалы для курса по искусственному интеллекту
          </p>
        </div>
      </footer>
    </div>
  );
}
