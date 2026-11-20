import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, CalendarPlus, Compass } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/weddingDefaults';
import { buildIcsContent, downloadIcsFile } from '../lib/weddingUtils';
import type { InvitationRecord, WeddingConfig } from '../types/wedding';

interface HeroSectionProps {
  config: WeddingConfig;
  personalInvite: InvitationRecord | null;
}

export function HeroSection({ config, personalInvite }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const ceremonyTime = config.schedule[0]?.time || '4:30 PM EDT';

  const handleDownloadAllCalendar = () => {
    const content = buildIcsContent(config, config.schedule);
    downloadIcsFile(
      `${config.brideFirstName.toLowerCase()}-${config.groomFirstName.toLowerCase()}-miami-wedding.ics`,
      content
    );
  };

  const scrollTo3DCruise = () => {
    const el = document.querySelector('#ocean-drive-3d');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToScratch = () => {
    const el = document.querySelector('#wedding-events');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePosterMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 9,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handlePosterLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[var(--bg-canvas)] border-b border-[#FAF3EA]/10 transition-colors duration-500"
    >
      {/* Subtle Desktop Twilight Horizon Backdrop */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <img
          src={EDITORIAL_IMAGES.coupleConvertibleDrive}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-16"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(108deg, var(--bg-canvas) 26%, rgba(10,9,15,0.78) 58%, var(--bg-canvas) 100%)',
          }}
        />
      </div>
      <div className="absolute inset-0 vice-ambient-glow pointer-events-none opacity-80" />
      <div className="absolute inset-0 film-grain opacity-35 pointer-events-none" />

      {/* ============================================================
          MOBILE-FIRST GTA VI HERO (Unobstructed Portrait + Crystal-Clear Date & Venue)
          ============================================================ */}
      <div className="lg:hidden relative z-10 flex flex-col min-h-[100svh]">
        {/* Top ~48%: Crisp, Unobstructed GTA VI Ocean Drive Couple Portrait */}
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[47svh] min-h-[300px] max-h-[460px] overflow-hidden bg-[var(--bg-surface)]"
        >
          <img
            src={EDITORIAL_IMAGES.couplePosterHero}
            alt={`${config.displayNames} Miami Beach sunset wedding portrait`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_16%] animate-ken-burns"
          />

          {/* Feather only the bottom seam into canvas */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, var(--bg-canvas) 6%, rgba(10,9,15,0.32) 55%, transparent 100%)',
            }}
          />

          {/* Subtle GTA VI Corner Frame Reticles */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t border-l border-[#FAF3EA]/70"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t border-r border-[#FAF3EA]/70"
          />

          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#FAF3EA]/92 drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
            <span>Miami Beach · Edition VI</span>
            <span>19 · 06 · 27</span>
          </div>
        </motion.div>

        {/* Bottom ~53%: High-Contrast GTA VI Poster Typography + Unmistakable Date Spec Strip */}
        <div className="relative z-10 flex-1 flex flex-col justify-between px-5 pt-2 pb-6 text-center">
          <div>
            {personalInvite && (
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-3)] mb-1.5">
                Reserved For {personalInvite.partyLabel || personalInvite.guestName}
              </p>
            )}

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-editorial italic text-2xl text-[var(--accent-3)] tracking-wide"
            >
              The Wedding Celebration of
            </motion.p>

            <motion.h1
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[4.4rem] sm:text-[5.4rem] leading-[0.85] tracking-[0.07em] vice-sunset-text mt-1"
            >
              {config.displayNames.toUpperCase()}
            </motion.h1>

            {/* Crystal-Clear GTA VI Mission Date, Time & Venue Spec Card */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mt-4 border border-[#FAF3EA]/18 bg-[var(--bg-surface)]/92 grid grid-cols-3 divide-x divide-[#FAF3EA]/12 text-center"
            >
              <div className="py-2.5 px-2">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--accent-3)]">
                  Date
                </p>
                <p className="font-display text-lg sm:text-xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-0.5">
                  19 JUNE 2027
                </p>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#FAF3EA]/60">
                  Saturday
                </p>
              </div>
              <div className="py-2.5 px-2">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--accent-1)]">
                  Ceremony
                </p>
                <p className="font-display text-lg sm:text-xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-0.5">
                  {ceremonyTime.replace(' EDT', '')}
                </p>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#FAF3EA]/60">
                  Miami EDT
                </p>
              </div>
              <div className="py-2.5 px-2">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--accent-cool)]">
                  Venue
                </p>
                <p className="font-display text-lg sm:text-xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-0.5 truncate">
                  PALMS ESTATE
                </p>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#FAF3EA]/60">
                  Miami Beach
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 0.28 }}
            className="mt-5 space-y-2.5"
          >
            <button
              type="button"
              onClick={scrollTo3DCruise}
              className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 vice-cta-bg text-[#0A090F] text-xs font-semibold tracking-[0.2em] uppercase min-h-[48px] whitespace-nowrap cursor-pointer active:scale-[0.985] transition-transform"
            >
              <span className="pointer-events-none absolute inset-y-0 w-16 bg-white/30 blur-sm animate-light-sweep" />
              <Compass className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Launch 3D Ocean Drive</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5 text-[10px] font-mono tracking-[0.16em] uppercase text-[#FAF3EA]/78">
              <button
                type="button"
                onClick={scrollToScratch}
                className="inline-flex items-center justify-center gap-1.5 border border-[#FAF3EA]/16 bg-[var(--bg-surface)]/70 hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors min-h-[42px] px-2 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-3)]" />
                <span>Scratch Timings</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadAllCalendar}
                className="inline-flex items-center justify-center gap-1.5 border border-[#FAF3EA]/16 bg-[var(--bg-surface)]/70 hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors min-h-[42px] px-2 cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                <span>Save Date</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          DESKTOP 1440px VOGUE x GTA VI EDITORIAL & GAMING POSTER SPREAD
          ============================================================ */}
      <div className="hidden lg:flex relative z-10 max-w-7xl mx-auto w-full px-12 py-14 flex-1 items-center">
        <div className="grid grid-cols-12 gap-14 items-center w-full">
          {/* Left Typographic & Mission Date Column */}
          <div className="col-span-7 text-left">
            <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.24em] uppercase text-[#FAF3EA]/62 mb-6">
              <span>New York</span>
              <span aria-hidden="true">·</span>
              <span>London</span>
              <span aria-hidden="true">·</span>
              <span>Paris</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--accent-3)]">Miami Beach · Edition VI</span>
            </div>

            {personalInvite && (
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--accent-cool)] mb-3">
                Personally Reserved for {personalInvite.partyLabel || personalInvite.guestName}
              </p>
            )}

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="font-editorial italic text-4xl xl:text-[2.75rem] text-[var(--accent-3)] leading-tight"
            >
              The Wedding Celebration of
            </motion.p>

            <motion.h1
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[6.6rem] xl:text-[8.4rem] leading-[0.84] tracking-[0.06em] vice-sunset-text mt-2"
            >
              {config.displayNames.toUpperCase()}
            </motion.h1>

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.16 }}
              className="text-base xl:text-lg text-[#FAF3EA]/78 mt-5 max-w-lg leading-relaxed"
            >
              {config.weddingTagline} An intimate oceanfront ceremony, golden-hour aperitivo, and
              candlelit evening beneath the palms.
            </motion.p>

            {/* Unmistakable GTA VI Date, Ceremony Time & Venue Mission Bar */}
            <div className="mt-7 grid grid-cols-3 border border-[#FAF3EA]/18 bg-[var(--bg-surface)]/90 divide-x divide-[#FAF3EA]/14 max-w-2xl">
              <div className="px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-3)]">
                  Wedding Date
                </p>
                <p className="font-display text-3xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-1">
                  19 JUNE 2027
                </p>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#FAF3EA]/60 mt-0.5">
                  Saturday Evening
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-1)]">
                  Ceremony Time
                </p>
                <p className="font-display text-3xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-1">
                  {ceremonyTime}
                </p>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#FAF3EA]/60 mt-0.5">
                  9:30 PM BST · 10:30 CEST
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-cool)]">
                  Destination
                </p>
                <p className="font-display text-3xl tracking-[0.06em] text-[#FAF3EA] leading-tight mt-1 truncate">
                  THE PALMS
                </p>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#FAF3EA]/60 mt-0.5">
                  4400 Collins Ave, Miami
                </p>
              </div>
            </div>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={scrollTo3DCruise}
                className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-4 vice-cta-bg text-[#0A090F] text-xs font-semibold tracking-[0.2em] uppercase min-h-[52px] whitespace-nowrap cursor-pointer active:scale-[0.985] transition-transform"
              >
                <span className="pointer-events-none absolute inset-y-0 w-16 bg-white/30 blur-sm animate-light-sweep" />
                <Compass className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Launch 3D Ocean Drive</span>
              </button>

              <button
                type="button"
                onClick={scrollToScratch}
                className="inline-flex items-center gap-2 px-5 py-4 border border-[#FAF3EA]/22 text-[#FAF3EA] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] text-xs font-mono tracking-[0.16em] uppercase transition-colors min-h-[52px] whitespace-nowrap cursor-pointer"
              >
                <span>Scratch Timings</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadAllCalendar}
                className="inline-flex items-center gap-2 px-4 py-4 border border-[#FAF3EA]/16 text-[#FAF3EA]/85 hover:border-[var(--accent-1)] hover:text-[var(--accent-3)] text-xs font-mono tracking-[0.16em] uppercase transition-colors min-h-[52px] whitespace-nowrap cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Save Date</span>
              </button>
            </motion.div>
          </div>

          {/* Right Framed 3D Pointer-Reactive Unobstructed Poster */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-5 perspective-1200"
          >
            <div
              onPointerMove={handlePosterMove}
              onPointerLeave={handlePosterLeave}
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative p-3 border border-[#FAF3EA]/18 bg-[var(--bg-surface)] shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
            >
              {/* Crisp GTA VI Architectural Corner Brackets */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[var(--accent-3)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[var(--accent-3)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-[var(--accent-1)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[var(--accent-1)]"
              />

              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-canvas)]">
                <img
                  src={EDITORIAL_IMAGES.couplePosterHero}
                  alt={`${config.displayNames} Ocean Drive twilight wedding poster`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-28 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(250,243,234,0.28), transparent 55%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A090F]/90 via-[#0A090F]/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-editorial italic text-xl text-[var(--accent-3)]">
                      Love in the City
                    </p>
                    <p className="font-display text-3xl tracking-[0.1em] text-[#FAF3EA] leading-none">
                      {config.displayNames.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-3)]">
                      19 June 2027
                    </span>
                    <span className="block font-mono text-[9px] tracking-[0.18em] uppercase text-[#FAF3EA]/72">
                      Miami Beach
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

