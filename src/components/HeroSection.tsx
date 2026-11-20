import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, CalendarPlus, Share2 } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/weddingDefaults';
import { buildIcsContent, downloadIcsFile } from '../lib/weddingUtils';
import type { InvitationRecord, WeddingConfig } from '../types/wedding';

interface HeroSectionProps {
  config: WeddingConfig;
  personalInvite: InvitationRecord | null;
  onShare: () => void;
}

export function HeroSection({
  config,
  personalInvite,
  onShare,
}: HeroSectionProps) {
  const prefersReduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleDownloadAllCalendar = () => {
    const content = buildIcsContent(config, config.schedule);
    downloadIcsFile(
      `${config.brideFirstName.toLowerCase()}-${config.groomFirstName.toLowerCase()}-miami-wedding.ics`,
      content
    );
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
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 8,
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
          MOBILE-FIRST CLEAN EDITORIAL HERO (Unobstructed Image + Crisp Content)
          ============================================================ */}
      <div className="lg:hidden relative z-10 flex flex-col min-h-[100svh]">
        {/* Top ~54%: Crisp, Unobstructed GTA VI Ocean Drive Couple Portrait */}
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[54svh] min-h-[345px] max-h-[530px] overflow-hidden bg-[var(--bg-surface)]"
        >
          <img
            src={EDITORIAL_IMAGES.couplePosterHero}
            alt={`${config.displayNames} Miami Beach sunset wedding portrait`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_16%] animate-ken-burns"
          />

          {/* Feather only the bottom seam into canvas */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, var(--bg-canvas) 4%, rgba(10,9,15,0.35) 55%, transparent 100%)',
            }}
          />

          <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#FAF3EA]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
            <span>New York · London · Miami</span>
            <span>19 · 06 · 27</span>
          </div>
        </motion.div>

        {/* Bottom ~46%: Refined Vogue x GTA VI Typography */}
        <div className="relative z-10 flex-1 flex flex-col justify-between px-6 pt-3 pb-7 text-center">
          <div>
            {personalInvite && (
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-3)] mb-2">
                For {personalInvite.partyLabel || personalInvite.guestName}
              </p>
            )}

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)] tracking-wide"
            >
              Together in the Sunset
            </motion.p>

            <motion.h1
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[4.5rem] sm:text-[5.5rem] leading-[0.86] tracking-[0.07em] vice-sunset-text mt-1.5"
            >
              {config.displayNames.toUpperCase()}
            </motion.h1>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-3 space-y-1.5"
            >
              <p className="text-[13px] text-[#FAF3EA]/78 max-w-xs mx-auto leading-relaxed">
                {config.weddingTagline}
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#FAF3EA]/58 pt-1">
                {config.displayDate} · {config.venueName}, {config.city}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 0.28 }}
            className="mt-6 space-y-3"
          >
            <button
              type="button"
              onClick={scrollToScratch}
              className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 vice-cta-bg text-[#0A090F] text-xs font-semibold tracking-[0.2em] uppercase min-h-[50px] whitespace-nowrap cursor-pointer active:scale-[0.985] transition-transform"
            >
              <span className="pointer-events-none absolute inset-y-0 w-16 bg-white/30 blur-sm animate-light-sweep" />
              <span className="relative z-10">Scratch to Reveal Timings</span>
              <ArrowDown className="w-4 h-4 relative z-10" />
            </button>

            <div className="flex items-center justify-center gap-6 text-[11px] font-mono tracking-[0.18em] uppercase text-[#FAF3EA]/70">
              <button
                type="button"
                onClick={handleDownloadAllCalendar}
                className="inline-flex items-center gap-1.5 hover:text-[var(--accent-3)] transition-colors min-h-[40px] cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[var(--accent-3)]" />
                <span>Save Date</span>
              </button>
              <span aria-hidden="true" className="text-[#FAF3EA]/20">
                /
              </span>
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 hover:text-[var(--accent-3)] transition-colors min-h-[40px] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--accent-cool)]" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          DESKTOP 1440px VOGUE x GTA VI EDITORIAL SPREAD
          ============================================================ */}
      <div className="hidden lg:flex relative z-10 max-w-7xl mx-auto w-full px-12 py-16 flex-1 items-center">
        <div className="grid grid-cols-12 gap-14 items-center w-full">
          {/* Left Typographic Column */}
          <div className="col-span-7 text-left">
            <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.24em] uppercase text-[#FAF3EA]/58 mb-7">
              <span>New York</span>
              <span aria-hidden="true">·</span>
              <span>London</span>
              <span aria-hidden="true">·</span>
              <span>Paris</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--accent-3)]">Miami Beach</span>
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
              className="font-display text-[6.8rem] xl:text-[8.6rem] leading-[0.84] tracking-[0.06em] vice-sunset-text mt-2"
            >
              {config.displayNames.toUpperCase()}
            </motion.h1>

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.16 }}
              className="text-base xl:text-lg text-[#FAF3EA]/78 mt-6 max-w-lg leading-relaxed"
            >
              {config.weddingTagline} An intimate oceanfront ceremony, golden-hour aperitivo, and
              candlelit evening beneath the palms.
            </motion.p>

            <div className="w-20 h-px sunset-hairline my-8" />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono tracking-[0.18em] uppercase text-[#FAF3EA]/72">
              <span className="text-[var(--accent-3)]">{config.displayDate}</span>
              <span aria-hidden="true" className="text-[#FAF3EA]/25">
                ·
              </span>
              <span>{config.venueName}</span>
              <span aria-hidden="true" className="text-[#FAF3EA]/25">
                ·
              </span>
              <span>{config.dressCode}</span>
            </div>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-10 flex items-center gap-5"
            >
              <button
                type="button"
                onClick={scrollToScratch}
                className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 vice-cta-bg text-[#0A090F] text-xs font-semibold tracking-[0.2em] uppercase min-h-[52px] whitespace-nowrap cursor-pointer active:scale-[0.985] transition-transform"
              >
                <span className="pointer-events-none absolute inset-y-0 w-16 bg-white/30 blur-sm animate-light-sweep" />
                <span className="relative z-10">Scratch to Reveal Timings</span>
                <ArrowDown className="w-4 h-4 relative z-10" />
              </button>

              <button
                type="button"
                onClick={handleDownloadAllCalendar}
                className="inline-flex items-center gap-2 px-5 py-4 border border-[#FAF3EA]/20 text-[#FAF3EA] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] text-xs font-mono tracking-[0.16em] uppercase transition-colors min-h-[52px] whitespace-nowrap cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Save Date</span>
              </button>

              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 px-3 py-4 text-[#FAF3EA]/70 hover:text-[var(--accent-cool)] text-xs font-mono tracking-[0.16em] uppercase transition-colors min-h-[52px] whitespace-nowrap cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
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
              className="relative p-3 border border-[#FAF3EA]/14 bg-[var(--bg-surface)] shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
            >
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
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(250,243,234,0.26), transparent 55%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A090F]/86 via-[#0A090F]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-editorial italic text-xl text-[var(--accent-3)]">
                      Love in the City
                    </p>
                    <p className="font-display text-3xl tracking-[0.1em] text-[#FAF3EA] leading-none">
                      {config.displayNames.toUpperCase()}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#FAF3EA]/75">
                    Miami · 2027
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
