import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { EditorialImage } from './EditorialImage';
import type { WeddingConfig } from '../types/wedding';

interface GallerySectionProps {
  config: WeddingConfig;
}

export function GallerySection({ config }: GallerySectionProps) {
  const prefersReduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const items = config.galleryItems;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + items.length) % items.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxIndex === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        setLightboxIndex((lightboxIndex + 1) % items.length);
      } else {
        setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
      }
    }
    touchStartX.current = null;
  };

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-surface-alt)] transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
          <div className="max-w-2xl">
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              35mm Editorial Film Roll
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
              Moments That Made Us
            </h2>
          </div>
          <p className="text-sm text-[#FFF4E8]/65 max-w-xs">
            Tap any frame to open the full-screen cinema viewer and swipe through our Miami story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {items.map((item, idx) => {
            const colSpan =
              idx === 0 || idx === 3 || idx === 5 ? 'md:col-span-7' : 'md:col-span-5';
            const aspectClass =
              idx === 0 || idx === 3 || idx === 5
                ? 'aspect-[16/10]'
                : 'aspect-[4/3] md:aspect-[16/14]';

            return (
              <motion.button
                key={item.id}
                type="button"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: (idx % 3) * 0.06 }}
                onClick={() => setLightboxIndex(idx)}
                className={`${colSpan} group text-left border border-[#FFF4E8]/12 bg-[var(--bg-surface)] overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--accent-3)] cursor-pointer`}
              >
                <div className={`relative w-full ${aspectClass} overflow-hidden bg-[var(--bg-canvas)]`}>
                  <EditorialImage
                    src={item.src}
                    alt={item.alt}
                    fallbackTitle={item.caption}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0914]/88 via-[#0B0914]/35 to-transparent" />
                  <div className="absolute top-3 right-3 w-9 h-9 bg-[#0B0914]/72 border border-[#FFF4E8]/20 flex items-center justify-center text-[#FFF4E8] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm sm:text-base font-medium text-[#FFF4E8]">
                        {item.caption}
                      </p>
                      <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent-3)] mt-0.5">
                        {item.location}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-[#FFF4E8]/60 tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with Keyboard & Touch Swipe */}
      {activeItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0914]/96 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between text-xs font-mono tracking-[0.18em] uppercase text-[#FFF4E8]/75">
            <span>
              Frame {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
              {String(items.length).padStart(2, '0')} · {activeItem.location}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              className="w-11 h-11 border border-[#FFF4E8]/20 inline-flex items-center justify-center text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
              }
              aria-label="Previous image"
              className="hidden sm:inline-flex w-12 h-12 border border-[#FFF4E8]/20 bg-[#0B0914]/70 items-center justify-center text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors mr-4 shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                referrerPolicy="no-referrer"
                className="max-h-[74vh] max-w-full object-contain border border-[#FFF4E8]/15"
              />
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
              aria-label="Next image"
              className="hidden sm:inline-flex w-12 h-12 border border-[#FFF4E8]/20 bg-[#0B0914]/70 items-center justify-center text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors ml-4 shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#FFF4E8]/10 pt-4">
            <div>
              <p className="font-editorial italic text-2xl text-[var(--accent-3)]">{activeItem.caption}</p>
              <p className="text-xs text-[#FFF4E8]/60">{activeItem.alt}</p>
            </div>
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
                }
                className="flex-1 py-2.5 border border-[#FFF4E8]/20 text-xs uppercase tracking-widest cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                className="flex-1 py-2.5 border border-[#FFF4E8]/20 text-xs uppercase tracking-widest cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
