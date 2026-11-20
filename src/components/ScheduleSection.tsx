import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CalendarPlus,
  Clock,
  Download,
  Eye,
  Heart,
  MapPin,
  Music,
  RotateCcw,
  Wine,
} from 'lucide-react';
import { buildIcsContent, downloadIcsFile } from '../lib/weddingUtils';
import { ScratchCard } from './ScratchCard';
import type { ViceThemeId } from '../types/theme';
import type { WeddingConfig, WeddingEventItem } from '../types/wedding';

interface ScheduleSectionProps {
  config: WeddingConfig;
  theme: ViceThemeId;
}

function EventLineIcon({ icon }: { icon: WeddingEventItem['icon'] }) {
  const props = { className: 'w-5 h-5 text-[var(--accent-3)]', strokeWidth: 1.5 };
  switch (icon) {
    case 'ceremony':
      return <Heart {...props} />;
    case 'cocktail':
      return <Wine {...props} />;
    case 'afterparty':
      return <Music {...props} />;
    default:
      return <Clock {...props} />;
  }
}

export function ScheduleSection({ config, theme }: ScheduleSectionProps) {
  const prefersReduced = useReducedMotion();
  const [masterRevealed, setMasterRevealed] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [resetCounter, setResetCounter] = useState(0);

  const allRevealed =
    masterRevealed && config.schedule.every((ev) => Boolean(revealedIds[ev.id]));

  const handleRevealOne = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleRevealAll = () => {
    setMasterRevealed(true);
    const next: Record<string, boolean> = {};
    for (const ev of config.schedule) {
      next[ev.id] = true;
    }
    setRevealedIds(next);
  };

  const handleResetFoil = () => {
    setMasterRevealed(false);
    setRevealedIds({});
    setResetCounter((c) => c + 1);
  };

  const handleDownloadSingle = (ev: WeddingEventItem) => {
    const ics = buildIcsContent(config, [ev]);
    const slug = ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadIcsFile(`ava-and-noah-${slug}.ics`, ics);
  };

  const handleDownloadAll = () => {
    const ics = buildIcsContent(config, config.schedule);
    downloadIcsFile(
      `${config.brideFirstName.toLowerCase()}-${config.groomFirstName.toLowerCase()}-full-schedule.ics`,
      ics
    );
  };

  return (
    <section
      id="wedding-events"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-surface-alt)] overflow-hidden transition-colors duration-500"
    >
      <div className="absolute inset-0 vice-ambient-glow pointer-events-none opacity-70" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              Interactive Foil Reveal
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
              Scratch to Reveal Timings
            </h2>
            <p className="text-sm sm:text-base text-[#FFF4E8]/75 mt-3">
              Rub the metallic foil with your finger or cursor to unveil our wedding date and every
              hour of the Miami evening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {allRevealed ? (
              <button
                type="button"
                onClick={handleResetFoil}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#FFF4E8]/25 text-[#FFF4E8]/85 hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] text-xs font-mono tracking-[0.14em] uppercase transition-colors min-h-[44px] whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scratch Again</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRevealAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--accent-3)]/50 text-[var(--accent-3)] hover:bg-[var(--accent-3)] hover:text-[#0B0914] text-xs font-mono tracking-[0.14em] uppercase transition-colors min-h-[44px] whitespace-nowrap cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal All</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFF4E8] text-[#0B0914] hover:bg-[var(--accent-3)] text-xs font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px] whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Calendar</span>
            </button>
          </div>
        </div>

        {/* MASTER DATE & CEREMONY SCRATCH FOIL CARD */}
        <div className="mb-8 border border-[#FFF4E8]/18 bg-[var(--bg-surface)] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-3 text-[11px] font-mono tracking-[0.2em] uppercase">
            <span className="text-[var(--accent-3)]">Main Ceremony Date</span>
            <span className="text-[#FFF4E8]/58">
              {masterRevealed ? 'Revealed' : 'Rub Metallic Foil Below'}
            </span>
          </div>

          <div className="border border-[#FFF4E8]/14 bg-[var(--bg-canvas)]">
            <ScratchCard
              theme={theme}
              revealed={masterRevealed}
              onReveal={() => setMasterRevealed(true)}
              resetCounter={resetCounter}
              promptTitle="Scratch to Reveal the Date"
              promptSubtitle="Rub finger across metallic foil"
              heightClass="min-h-[155px] sm:min-h-[175px]"
              brushRadius={30}
            >
              <div className="px-5 py-7 sm:py-8 text-center">
                <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
                  Save the Sunset
                </p>
                <p className="font-display text-4xl sm:text-6xl tracking-[0.08em] vice-sunset-text mt-1">
                  {config.displayDate.toUpperCase()}
                </p>
                <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#FFF4E8]/85 mt-2">
                  Ceremony Begins {config.schedule[0]?.time || '4:30 PM'} EDT · {config.venueName} ·{' '}
                  {config.city}
                </p>
              </div>
            </ScratchCard>
          </div>
        </div>

        {/* 4 EVENT CHAPTER CARDS WITH INDIVIDUAL SCRATCH-OFF TIMINGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {config.schedule.map((ev, index) => {
            const isUnlocked = Boolean(revealedIds[ev.id]);
            return (
              <motion.div
                key={ev.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="border border-[#FFF4E8]/14 bg-[var(--bg-surface)] p-5 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-cool)]">
                        0{index + 1}. {ev.subtitle}
                      </p>
                      <h3 className="font-display text-3xl sm:text-4xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                        {ev.title}
                      </h3>
                    </div>
                    <div className="w-11 h-11 border border-[#FFF4E8]/14 bg-[var(--bg-canvas)] flex items-center justify-center shrink-0">
                      <EventLineIcon icon={ev.icon} />
                    </div>
                  </div>

                  {/* Interactive Scratch-Off Window Over the Event Timing */}
                  <div className="mt-4 border border-[#FFF4E8]/16 bg-[var(--bg-canvas)]">
                    <ScratchCard
                      theme={theme}
                      revealed={isUnlocked}
                      onReveal={() => handleRevealOne(ev.id)}
                      resetCounter={resetCounter}
                      promptTitle="Scratch Timing"
                      promptSubtitle={`Chapter 0${index + 1} · Rub Here`}
                      heightClass="min-h-[88px]"
                      brushRadius={22}
                      compact
                    >
                      <div className="px-4 py-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--accent-2)]">
                            Confirmed Hour
                          </p>
                          <p className="font-display text-3xl sm:text-4xl tracking-[0.06em] text-[var(--accent-3)] tabular-nums leading-none mt-1">
                            {ev.time}
                            {ev.endTime ? ` – ${ev.endTime}` : ''}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent-cool)]">
                          EDT · Miami
                        </span>
                      </div>
                    </ScratchCard>
                  </div>

                  <p className="text-sm text-[#FFF4E8]/78 leading-relaxed mt-4">
                    {ev.description}
                  </p>
                  {ev.dressHint && (
                    <p className="text-xs text-[#FFF4E8]/55 mt-2">{ev.dressHint}</p>
                  )}
                </div>

                {/* Card Bottom Bar */}
                <div className="mt-5 pt-4 border-t border-[#FFF4E8]/10 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-[0.12em] uppercase text-[#FFF4E8]/75 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-1)] shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isUnlocked && (
                      <button
                        type="button"
                        onClick={() => handleRevealOne(ev.id)}
                        className="px-3 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--accent-3)] hover:text-[#FFF4E8] min-h-[40px] cursor-pointer"
                      >
                        Reveal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(ev)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#FFF4E8]/18 hover:border-[var(--accent-1)] text-[11px] font-mono uppercase tracking-[0.12em] text-[#FFF4E8] hover:text-[var(--accent-1)] transition-colors min-h-[40px] whitespace-nowrap cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
