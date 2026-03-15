import { useParams, useLocation } from 'wouter';
import { getDashboardBySlug, dashboards } from '@/lib/dashboardData';
import Header from '@/components/Header';
import SectionRenderer from '@/components/SectionRenderer';
import ProgressTracker from '@/components/ProgressTracker';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronUp } from 'lucide-react';
import { Link } from 'wouter';
import { useProgress } from '@/contexts/ProgressContext';

export default function DashboardPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const dashboard = getDashboardBySlug(params.slug || '');
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!dashboard) {
      setLocation('/404');
      return;
    }
    window.scrollTo(0, 0);
    setActiveSection(dashboard.sections[0]?.id || '');
  }, [dashboard, setLocation]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      if (!dashboard) return;
      const sections = dashboard.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dashboard]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const { getModuleProgress } = useProgress();

  if (!dashboard) return null;

  const { completed, total, percent } = getModuleProgress(dashboard.slug);
  const currentIndex = dashboards.findIndex((d) => d.id === dashboard.id);
  const prevDashboard = currentIndex > 0 ? dashboards[currentIndex - 1] : null;
  const nextDashboard = currentIndex < dashboards.length - 1 ? dashboards[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
        <div className="absolute inset-0">
          <img
            src={dashboard.heroImage}
            alt={dashboard.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${dashboard.color}cc 0%, ${dashboard.color}88 40%, transparent 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative container pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-4">
              Модуль {dashboard.moduleNumber}
            </span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {dashboard.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl font-light drop-shadow">
              {dashboard.subtitle}
            </p>
            <p className="mt-3 text-sm text-white/70 max-w-3xl leading-relaxed">
              {dashboard.description}
            </p>

            {/* Mobile progress bar */}
            <div className="mt-5 max-w-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/70 font-medium">Прогресс модуля</span>
                <span className="text-xs text-white font-bold">{percent}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[11px] text-white/60 mt-1">
                {completed} из {total} разделов
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="flex gap-12">
          <ProgressTracker
            sections={dashboard.sections}
            activeSection={activeSection}
            accentColor={dashboard.color}
            dashboardSlug={dashboard.slug}
            onSectionClick={scrollToSection}
          />

          <main className="flex-1 min-w-0 max-w-3xl">
            <div className="flex flex-col gap-10">
              {dashboard.sections.map((section, i) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  index={i}
                  accentColor={dashboard.color}
                  dashboardSlug={dashboard.slug}
                />
              ))}
            </div>

            {/* Navigation between dashboards */}
            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-between">
              {prevDashboard ? (
                <Link
                  href={`/dashboard/${prevDashboard.slug}`}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl border border-border hover:bg-accent/50 transition-colors no-underline group flex-1"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div>
                    <p className="text-xs text-muted-foreground">Предыдущий модуль</p>
                    <p className="text-sm font-semibold text-foreground">{prevDashboard.title}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextDashboard ? (
                <Link
                  href={`/dashboard/${nextDashboard.slug}`}
                  className="flex items-center justify-end gap-3 px-5 py-4 rounded-xl border border-border hover:bg-accent/50 transition-colors no-underline group flex-1 text-right"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">Следующий модуль</p>
                    <p className="text-sm font-semibold text-foreground">{nextDashboard.title}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
