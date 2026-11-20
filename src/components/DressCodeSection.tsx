import { DRESS_CODE_SWATCHES, EDITORIAL_IMAGES } from '../data/weddingDefaults';
import { EditorialImage } from './EditorialImage';
import type { WeddingConfig } from '../types/wedding';

interface DressCodeSectionProps {
  config: WeddingConfig;
}

export function DressCodeSection({ config }: DressCodeSectionProps) {
  return (
    <section
      id="dress-code"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-canvas)] transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        {/* Left: Editorial Styling Photography */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="p-2.5 sm:p-3 border border-[#FFF4E8]/15 bg-[var(--bg-surface)] flex-1 flex flex-col">
            <div className="relative flex-1 min-h-[320px] overflow-hidden bg-[var(--bg-canvas)]">
              <EditorialImage
                src={EDITORIAL_IMAGES.tropicalFormal}
                alt="Tropical Formal wedding attire styling featuring coral silk gown and tailored cream linen dinner jacket"
                fallbackTitle="Tropical Formal Attire"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-3 px-1 flex items-center justify-between text-[11px] font-mono tracking-[0.16em] uppercase text-[#FFF4E8]/55">
              <span>Style Lookbook</span>
              <span className="text-[var(--accent-3)]">{config.dressCode}</span>
            </div>
          </div>
        </div>

        {/* Right: Fashion Guidance & Color Palette */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-7">
          <div>
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              Evening Attire Guide
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
              {config.dressCode}
            </h2>
            <p className="text-sm sm:text-base text-[#FFF4E8]/80 leading-relaxed mt-4">
              {config.dressCodeDescription}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#FFF4E8]/60 mb-4">
              Suggested Evening Palette
            </p>
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
              {DRESS_CODE_SWATCHES.map((swatch) => (
                <div key={swatch.name} className="space-y-2">
                  <div
                    className="h-14 sm:h-16 w-full border border-[#FFF4E8]/15"
                    style={{ backgroundColor: swatch.hex }}
                    title={`${swatch.name} — ${swatch.note}`}
                  />
                  <p className="text-[11px] font-medium text-[#FFF4E8]/85 leading-tight">
                    {swatch.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#FFF4E8]/10">
            <div>
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--accent-3)] mb-2">
                For Women
              </h3>
              <p className="text-sm text-[#FFF4E8]/78 leading-relaxed">
                Floor-length or midi silk gowns, sculptural cocktail dresses in warm sunset,
                coastal, or evening tones, paired with block heels or dressy sandals.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--accent-3)] mb-2">
                For Men
              </h3>
              <p className="text-sm text-[#FFF4E8]/78 leading-relaxed">
                Lightweight wool or tailored linen suits in midnight navy, sand, charcoal, or
                classic dinner jackets with crisp shirts and loafers.
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-[#FFF4E8]/10 text-xs sm:text-sm text-[#FFF4E8]/65 leading-relaxed">
            <span className="font-medium text-[#FFF4E8]/90">A gentle note: </span>
            {config.dressCodeAvoidNote}
          </div>
        </div>
      </div>
    </section>
  );
}
