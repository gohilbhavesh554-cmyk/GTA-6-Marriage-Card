import { motion, useReducedMotion } from 'motion/react';
import { CalendarPlus } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/weddingDefaults';
import { buildIcsContent, downloadIcsFile } from '../lib/weddingUtils';
import type { WeddingConfig } from '../types/wedding';

interface ClosingSectionProps {
  config: WeddingConfig;
}

export function ClosingSection({ config }: ClosingSectionProps) {
  const prefersReduced = useReducedMotion();

  const handleSaveCalendar = () => {
    const ics = buildIcsContent(config, config.schedule);
    downloadIcsFile(
      `${config.brideFirstName.toLowerCase()}-${config.groomFirstName.toLowerCase()}-miami-wedding.ics`,
      ics
    );
  };

  return (
    <footer className="relative overflow-hidden bg-[var(--bg-canvas)] text-[#FAF3EA] transition-colors duration-500">
      <div className="absolute inset-0 vice-ambient-glow opacity-45 pointer-events-none" />

      {/* Clean Framed Finale: Unobstructed Couple Portrait Frame + All Text Cleanly Separated */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-14 items-center"
        >
          {/* Dedicated Gallery Frame for Couple Portrait — Zero Text Overlapping Photo */}
          <div className="lg:col-span-6">
            <div className="p-2.5 sm:p-3 border border-[#FAF3EA]/16 bg-[var(--bg-surface)] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--bg-canvas)]">
                <img
                  src={EDITORIAL_IMAGES.coupleMiamiNight}
                  alt={`${config.displayNames} raising a champagne toast beneath illuminated Miami palms`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="pt-2.5 px-1 flex items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#FAF3EA]/58">
                <span>After Dark · Biscayne Bay</span>
                <span className="text-[var(--accent-3)]">Miami Beach · 2027</span>
              </div>
            </div>
          </div>

          {/* Dedicated Clean Typography Column Below Frame on Phone / Beside Frame on Desktop */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              See You in {config.city}
            </p>
            <h2 className="font-display text-5xl sm:text-7xl tracking-[0.06em] vice-sunset-text leading-[0.92] mt-1.5">
              Our Forever Starts With You
            </h2>
            <p className="text-sm sm:text-base text-[#FAF3EA]/78 mt-4 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Thank you for travelling from near and far to celebrate this unforgettable evening
              with us.
            </p>

            <div className="w-20 h-px sunset-hairline mx-auto lg:mx-0 my-7" />

            <p className="font-display text-3xl sm:text-4xl tracking-[0.16em] text-[var(--accent-3)]">
              WITH LOVE, {config.displayNames.toUpperCase()}
            </p>
            <p className="font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#FAF3EA]/65 mt-2.5 leading-relaxed">
              {config.displayDate} · {config.venueName} · {config.city}, {config.state}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleSaveCalendar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 vice-cta-bg text-[#0A090F] text-xs font-semibold tracking-[0.2em] uppercase min-h-[50px] whitespace-nowrap cursor-pointer active:scale-[0.985] transition-transform"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Save Date to Calendar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quiet Editorial Footer */}
      <div className="border-t border-[#FAF3EA]/10 bg-[var(--bg-canvas)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono tracking-[0.18em] uppercase text-[#FAF3EA]/50">
          <span>
            Love in the City · {config.displayNames}
          </span>
          <span>
            New York · London · Paris · {config.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
