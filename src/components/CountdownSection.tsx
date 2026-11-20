import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { calculateCountdown, getWeddingTargetTimestamp } from '../lib/weddingUtils';
import type { WeddingConfig } from '../types/wedding';

interface CountdownSectionProps {
  config: WeddingConfig;
}

const TRANSATLANTIC_TIMES = [
  { city: 'Miami & New York', zone: 'EDT', time: '4:30 PM' },
  { city: 'London', zone: 'BST', time: '9:30 PM' },
  { city: 'Paris · Milan · Berlin', zone: 'CEST', time: '10:30 PM' },
];

export function CountdownSection({ config }: CountdownSectionProps) {
  const prefersReduced = useReducedMotion();
  const targetMs = useMemo(
    () => getWeddingTargetTimestamp(config.weddingDate, config.ceremonyTime, config.timezone),
    [config.weddingDate, config.ceremonyTime, config.timezone]
  );

  const [snapshot, setSnapshot] = useState(() => calculateCountdown(targetMs));

  useEffect(() => {
    setSnapshot(calculateCountdown(targetMs));
    const interval = window.setInterval(() => {
      setSnapshot(calculateCountdown(targetMs));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetMs]);

  const units = [
    { label: 'Days', value: String(snapshot.days).padStart(2, '0') },
    { label: 'Hours', value: String(snapshot.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(snapshot.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(snapshot.seconds).padStart(2, '0') },
  ];

  return (
    <section
      id="countdown"
      className="relative py-20 sm:py-26 px-5 sm:px-8 border-b border-[#FAF3EA]/10 bg-[var(--bg-canvas)] overflow-hidden transition-colors duration-500"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {(config.brideParents || config.groomParents) && (
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#FAF3EA]/55 mb-5">
            Together with {config.brideParents} &amp; {config.groomParents}
          </p>
        )}

        <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
          Counting Down to Sunset
        </p>

        <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FAF3EA] mt-1">
          {config.displayDate.toUpperCase()}
        </h2>

        {snapshot.completed ? (
          <div className="mt-10 border border-[var(--accent-3)]/35 bg-[var(--bg-surface)] px-6 py-10 max-w-2xl mx-auto">
            <p className="font-display text-5xl sm:text-6xl tracking-[0.08em] vice-sunset-text">
              Just Married in Miami
            </p>
            <p className="text-sm sm:text-base text-[#FAF3EA]/75 mt-3">
              Thank you for celebrating {config.displayNames} at {config.venueName}.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-4 border-y border-[#FAF3EA]/12 divide-x divide-[#FAF3EA]/12">
            {units.map((unit) => (
              <div key={unit.label} className="py-7 sm:py-10 px-2 flex flex-col items-center">
                <div className="h-12 sm:h-20 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={unit.value}
                      initial={prefersReduced ? { opacity: 1 } : { y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={prefersReduced ? { opacity: 0 } : { y: -12, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display text-5xl sm:text-7xl tracking-[0.04em] tabular-nums vice-sunset-text block"
                    >
                      {unit.value}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="mt-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#FAF3EA]/55">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Transatlantic Ceremony Hour Strip for US & European Guests */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-[0.16em] uppercase text-[#FAF3EA]/62">
          {TRANSATLANTIC_TIMES.map((item, idx) => (
            <div key={item.city} className="inline-flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden="true" className="hidden sm:inline text-[#FAF3EA]/20 mr-4">
                  ·
                </span>
              )}
              <span>{item.city}</span>
              <span className="text-[var(--accent-3)] tabular-nums">
                {item.time} {item.zone}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
