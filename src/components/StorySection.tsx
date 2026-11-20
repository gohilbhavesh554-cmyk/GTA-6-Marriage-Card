import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialImage } from './EditorialImage';
import type { WeddingConfig } from '../types/wedding';

interface StorySectionProps {
  config: WeddingConfig;
}

export function StorySection({ config }: StorySectionProps) {
  const prefersReduced = useReducedMotion();
  const [viewMode, setViewMode] = useState<'reel' | 'spread'>('reel');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const chapters = config.storyChapters;
  const current = chapters[activeIndex] || chapters[0];

  const goTo = (nextIdx: number) => {
    const normalized = (nextIdx + chapters.length) % chapters.length;
    setDirection(nextIdx >= activeIndex ? 1 : -1);
    setActiveIndex(normalized);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(delta < 0 ? activeIndex + 1 : activeIndex - 1);
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="story"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-canvas)] transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header & Mode Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              Our Story · New York to London to Miami
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
              Every Chapter Led to Miami
            </h2>
            <p className="text-sm sm:text-base text-[#FFF4E8]/75 mt-3">
              {config.storyTitle}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface)] border border-[#FFF4E8]/14 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('reel')}
              className={`px-4 py-2 text-xs font-mono tracking-[0.14em] uppercase transition-colors min-h-[40px] whitespace-nowrap cursor-pointer ${
                viewMode === 'reel'
                  ? 'bg-[#FFF4E8] text-[#0B0914] font-semibold'
                  : 'text-[#FFF4E8]/70 hover:text-[#FFF4E8]'
              }`}
            >
              Story Reel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spread')}
              className={`px-4 py-2 text-xs font-mono tracking-[0.14em] uppercase transition-colors min-h-[40px] whitespace-nowrap cursor-pointer ${
                viewMode === 'spread'
                  ? 'bg-[#FFF4E8] text-[#0B0914] font-semibold'
                  : 'text-[#FFF4E8]/70 hover:text-[#FFF4E8]'
              }`}
            >
              All Chapters
            </button>
          </div>
        </div>

        {/* Interactive Swipeable / Tap-Through Cinema Story Reel (Default!) */}
        {viewMode === 'reel' && current ? (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="border border-[#FFF4E8]/16 bg-[var(--bg-surface)] p-4 sm:p-7"
          >
            {/* Chapter Story Progress Bars */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Jump to chapter ${idx + 1}: ${ch.title}`}
                  className="py-2 group cursor-pointer text-left"
                >
                  <div className="h-1 w-full bg-[#FFF4E8]/15 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: idx <= activeIndex ? '100%' : '0%',
                        backgroundColor:
                          idx === activeIndex ? 'var(--accent-1)' : 'var(--accent-3)',
                      }}
                    />
                  </div>
                  <p
                    className={`mt-1.5 font-mono text-[10px] tracking-[0.14em] uppercase truncate transition-colors ${
                      idx === activeIndex
                        ? 'text-[var(--accent-3)]'
                        : 'text-[#FFF4E8]/45 group-hover:text-[#FFF4E8]/75'
                    }`}
                  >
                    {ch.year} · {ch.title}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              {/* Unobstructed Swipeable Couple Frame */}
              <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-[#FFF4E8]/14 bg-[var(--bg-canvas)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id}
                    initial={
                      prefersReduced
                        ? { opacity: 1 }
                        : { opacity: 0, x: direction * 28, scale: 1.03 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -24 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <EditorialImage
                      src={current.photo}
                      alt={`${current.title} — ${current.year}`}
                      fallbackTitle={`${current.year} · ${current.title}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Invisible Tap Left / Right Zones for Mobile Reel Feel */}
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous story chapter"
                  className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next story chapter"
                  className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                />
              </div>

              {/* Right Narrative Column */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id}
                    initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent-cool)]">
                      Chapter 0{activeIndex + 1} · {current.year} · {current.location}
                    </p>
                    <h3 className="font-display text-4xl sm:text-5xl tracking-[0.06em] vice-sunset-text mt-2 leading-none">
                      {current.title}
                    </h3>
                    <div className="w-16 h-0.5 sunset-hairline my-4" />
                    <p className="text-sm sm:text-base text-[#FFF4E8]/85 leading-relaxed">
                      {current.description}
                    </p>
                    <p className="text-xs font-mono text-[var(--accent-3)]/85 mt-4">
                      {current.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 pt-5 border-t border-[#FFF4E8]/12 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goTo(activeIndex - 1)}
                      aria-label="Previous chapter"
                      className="w-11 h-11 border border-[#FFF4E8]/20 inline-flex items-center justify-center text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo(activeIndex + 1)}
                      aria-label="Next chapter"
                      className="w-11 h-11 border border-[#FFF4E8]/20 inline-flex items-center justify-center text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => goTo(activeIndex + 1)}
                    className="text-xs font-mono tracking-[0.18em] uppercase text-[var(--accent-1)] hover:text-[var(--accent-3)] transition-colors min-h-[44px] cursor-pointer"
                  >
                    Next Chapter →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editorial Film-Frame Spread View */
          <div className="space-y-12 sm:space-y-20">
            {chapters.map((chapter, idx) => {
              const isReversed = idx % 2 === 1;
              return (
                <motion.article
                  key={chapter.id}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
                >
                  <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="p-2.5 sm:p-3 border border-[#FFF4E8]/15 bg-[var(--bg-surface)]">
                      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[var(--bg-canvas)]">
                        <EditorialImage
                          src={chapter.photo}
                          alt={`${chapter.year} — ${chapter.title}`}
                          fallbackTitle={`${chapter.year} · ${chapter.title}`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </div>
                      <div className="pt-2.5 px-1 flex items-center justify-between gap-4 text-[11px] font-mono tracking-[0.16em] uppercase text-[#FFF4E8]/60">
                        <span className="truncate">{chapter.caption}</span>
                        <span className="shrink-0 text-[var(--accent-3)]">{chapter.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center gap-3 text-xs font-mono tracking-[0.22em] uppercase text-[var(--accent-cool)] mb-2">
                      <span>0{idx + 1}.</span>
                      <span>{chapter.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--accent-3)]">{chapter.location}</span>
                    </div>

                    <h3 className="font-display text-4xl sm:text-5xl tracking-[0.06em] text-[#FFF4E8] leading-none">
                      {chapter.title}
                    </h3>

                    <div className="w-16 h-0.5 sunset-hairline my-4" />

                    <p className="text-sm sm:text-base text-[#FFF4E8]/80 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
