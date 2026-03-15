import { Link, useLocation } from 'wouter';
import { dashboards } from '@/lib/dashboardData';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-display)] text-lg font-bold text-foreground tracking-tight hidden sm:block">
            AI Learning
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {dashboards.map((d) => {
            const isActive = location === `/dashboard/${d.slug}`;
            return (
              <Link
                key={d.id}
                href={`/dashboard/${d.slug}`}
                className={`
                  relative px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline
                  ${isActive
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }
                `}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: d.color }}
                />
                {d.title}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border/60 bg-background"
          >
            <div className="container py-3 flex flex-col gap-1">
              {dashboards.map((d) => {
                const isActive = location === `/dashboard/${d.slug}`;
                return (
                  <Link
                    key={d.id}
                    href={`/dashboard/${d.slug}`}
                    className={`
                      px-3 py-2.5 text-sm font-medium rounded-md transition-colors no-underline
                      ${isActive
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: d.color }}
                    />
                    {d.title}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
