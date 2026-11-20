import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarPlus, RotateCw, Share2 } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/weddingDefaults';
import { buildIcsContent, downloadIcsFile } from '../lib/weddingUtils';
import type { WeddingConfig } from '../types/wedding';

interface CollectorPostcardSectionProps {
  config: WeddingConfig;
  onShare: () => void;
}

export function CollectorPostcardSection({
  config,
  onShare,
}: CollectorPostcardSectionProps) {
  const prefersReduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 10,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const handleDownloadCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = buildIcsContent(config, config.schedule);
    downloadIcsFile(
      `${config.brideFirstName.toLowerCase()}-${config.groomFirstName.toLowerCase()}-miami-wedding.ics`,
      content
    );
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare();
  };

  return (
    <section
      id="postcard"
      className="relative py-20 sm:py-28 px-5 sm:px-8 border-b border-[#FAF3EA]/10 bg-[var(--bg-canvas)] overflow-hidden transition-colors duration-500"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              Transatlantic Keepsake
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FAF3EA] leading-[0.94] mt-1">
              Flip the Miami Postcard
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#FAF3EA]/18 text-[#FAF3EA] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] text-xs font-mono tracking-[0.16em] uppercase transition-colors min-h-[44px] self-start sm:self-auto whitespace-nowrap cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{flipped ? 'View Cover' : 'Flip for Note'}</span>
          </button>
        </div>

        {/* 3D Tilting + Tap-to-Flip Collector's Postcard */}
        <div
          className="perspective-1200 w-full max-w-3xl mx-auto"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            onClick={() => setFlipped((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label={
              flipped
                ? 'Showing back of Miami wedding postcard. Activate to flip to cover.'
                : 'Showing front of Miami wedding postcard. Activate to flip for personal note.'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((prev) => !prev);
              }
            }}
            animate={{
              rotateY: flipped ? 180 : tilt.ry,
              rotateX: flipped ? 0 : tilt.rx,
            }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative preserve-3d w-full aspect-[4/5] sm:aspect-[16/10] cursor-pointer select-none"
          >
            {/* FRONT FACE — Collectible Vice Sunset Cover Art */}
            <div className="absolute inset-0 backface-hidden border border-[#FAF3EA]/16 bg-[var(--bg-surface)] p-2.5 sm:p-3.5 shadow-[0_24px_65px_rgba(0,0,0,0.55)]">
              <div className="relative w-full h-full overflow-hidden bg-[var(--bg-canvas)]">
                <img
                  src={EDITORIAL_IMAGES.coupleSunsetWalk}
                  alt={`${config.displayNames} walking beneath palm trees in Miami at golden hour`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />

                <div
                  className="pointer-events-none absolute inset-0 opacity-35"
                  style={{
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(242,201,125,0.3), rgba(242,99,134,0.12) 38%, transparent 64%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0A090F]/90 via-[#0A090F]/42 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#FAF3EA]/88 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  <span>New York · London · Paris · Miami</span>
                  <span className="text-[var(--accent-3)]">19 · 06 · 27</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
                      Postcard from Miami Beach
                    </p>
                    <p className="font-display text-4xl sm:text-5xl tracking-[0.08em] vice-sunset-text leading-none mt-0.5">
                      {config.displayNames.toUpperCase()}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#FAF3EA]/85 border-b border-[var(--accent-3)]/60 pb-0.5 self-start sm:self-end">
                    <RotateCw className="w-3 h-3 text-[var(--accent-3)]" />
                    <span>Tap to Flip</span>
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE — Clean Luxury Transatlantic Airmail Postcard */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 border border-[var(--accent-3)]/35 bg-[var(--bg-surface)] text-[#FAF3EA] p-6 sm:p-8 flex flex-col justify-between shadow-[0_24px_65px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-[#FAF3EA]/12 pb-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--accent-3)]">
                    Par Avion · Transatlantic Edition
                  </p>
                  <p className="font-display text-2xl sm:text-3xl tracking-[0.1em] text-[#FAF3EA] mt-0.5">
                    {config.venueName.toUpperCase()}
                  </p>
                </div>

                <div className="w-16 h-20 sm:w-20 sm:h-24 border border-dashed border-[var(--accent-3)]/55 bg-[var(--bg-canvas)] p-1.5 flex flex-col justify-between shrink-0 text-center">
                  <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--accent-1)]">
                    US · EU
                  </span>
                  <span className="font-display text-2xl sm:text-3xl vice-sunset-text leading-none">
                    VI
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-[#FAF3EA]/70">
                    MIA 27
                  </span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 my-auto py-4">
                <div className="sm:col-span-7 sm:border-r sm:border-[#FAF3EA]/10 sm:pr-6">
                  <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
                    Dearest Friends &amp; Family,
                  </p>
                  <p className="text-xs sm:text-sm text-[#FAF3EA]/80 leading-relaxed mt-2">
                    Whether you are crossing the Atlantic from London, Paris, or Milan, or flying
                    south from New York — we cannot wait to welcome you beneath the palms of Miami
                    Beach.
                  </p>
                  <p className="font-editorial italic text-xl sm:text-2xl text-[var(--accent-1)] mt-3">
                    With all our love, {config.displayNames}
                  </p>
                </div>

                <div className="sm:col-span-5 flex flex-col justify-center space-y-2.5 text-xs">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#FAF3EA]/48">
                      Date
                    </p>
                    <p className="font-medium text-[#FAF3EA]">{config.displayDate}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#FAF3EA]/48">
                      Address
                    </p>
                    <p className="font-medium text-[#FAF3EA]">{config.venueAddress}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#FAF3EA]/48">
                      Coordinates
                    </p>
                    <p className="font-mono text-[11px] text-[var(--accent-cool)] tabular-nums">
                      25.8165° N · 80.1225° W
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 border-t border-[#FAF3EA]/12 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadCalendar}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 vice-cta-bg text-[#0A090F] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[40px] cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Save Date</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#FAF3EA]/20 text-[#FAF3EA] hover:border-[var(--accent-3)] text-[11px] font-mono tracking-[0.14em] uppercase min-h-[40px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#FAF3EA]/50">
                  Tap Card to Flip Back
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
