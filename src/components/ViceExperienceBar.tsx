import { Pause, Play, Radio, Sun } from 'lucide-react';
import { VICE_STATIONS, type ViceStationId } from '../lib/ambientAudio';
import { VICE_THEME_LIST, type ViceThemeId } from '../types/theme';

interface ViceExperienceBarProps {
  activeTheme: ViceThemeId;
  onSelectTheme: (theme: ViceThemeId) => void;
  audioPlaying: boolean;
  activeStation: ViceStationId;
  onToggleAudio: () => void;
  onSelectStation: (station: ViceStationId) => void;
}

export function ViceExperienceBar({
  activeTheme,
  onSelectTheme,
  audioPlaying,
  activeStation,
  onToggleAudio,
  onSelectStation,
}: ViceExperienceBarProps) {
  const currentStation =
    VICE_STATIONS.find((s) => s.id === activeStation) || VICE_STATIONS[0];

  return (
    <section
      aria-label="Atmosphere Lighting and Vice FM Soundtrack"
      className="relative z-10 border-b border-[#FAF3EA]/10 bg-[var(--bg-surface-alt)] transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Live Atmosphere Switcher */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#FAF3EA]/65">
              <Sun className="w-3.5 h-3.5 text-[var(--accent-3)]" />
              <span>Atmosphere</span>
            </p>
            <span className="font-editorial italic text-sm text-[var(--accent-3)]">
              {VICE_THEME_LIST.find((t) => t.id === activeTheme)?.tagline}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Select invitation lighting theme"
            className="grid grid-cols-3 gap-2"
          >
            {VICE_THEME_LIST.map((theme) => {
              const selected = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`px-3 py-2.5 border text-left transition-colors min-h-[50px] cursor-pointer ${
                    selected
                      ? 'border-[var(--accent-3)]/80 bg-[var(--bg-surface)] text-[#FAF3EA]'
                      : 'border-[#FAF3EA]/10 bg-transparent text-[#FAF3EA]/62 hover:border-[#FAF3EA]/28 hover:text-[#FAF3EA]'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    {theme.swatch.map((hex) => (
                      <span
                        key={hex}
                        className="w-2.5 h-1 block"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium tracking-wide whitespace-nowrap truncate">
                    {theme.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vice FM Live Soundtrack */}
        <div className="lg:col-span-6 lg:border-l lg:border-[#FAF3EA]/10 lg:pl-10">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#FAF3EA]/65">
              <Radio className="w-3.5 h-3.5 text-[var(--accent-1)]" />
              <span>Vice FM</span>
            </p>
            <div className="flex items-center gap-2">
              {audioPlaying && (
                <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
                  <span className="w-0.5 h-full bg-[var(--accent-1)] origin-bottom animate-eq-1" />
                  <span className="w-0.5 h-full bg-[var(--accent-2)] origin-bottom animate-eq-2" />
                  <span className="w-0.5 h-full bg-[var(--accent-3)] origin-bottom animate-eq-3" />
                  <span className="w-0.5 h-full bg-[var(--accent-cool)] origin-bottom animate-eq-4" />
                </div>
              )}
              <span className="font-editorial italic text-sm text-[#FAF3EA]/70">
                {audioPlaying ? `${currentStation.freq} · ${currentStation.name}` : 'Tap to listen'}
              </span>
            </div>
          </div>

          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={onToggleAudio}
              aria-label={audioPlaying ? 'Pause Vice FM soundtrack' : 'Play Vice FM soundtrack'}
              className={`w-12 shrink-0 inline-flex items-center justify-center border transition-colors min-h-[50px] cursor-pointer ${
                audioPlaying
                  ? 'border-[var(--accent-1)] bg-[var(--accent-1)] text-[#0A090F]'
                  : 'border-[#FAF3EA]/18 bg-[var(--bg-surface)] text-[#FAF3EA] hover:border-[var(--accent-3)]'
              }`}
            >
              {audioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="grid grid-cols-3 gap-2 flex-1 min-w-0">
              {VICE_STATIONS.map((station) => {
                const isSelected = activeStation === station.id;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => onSelectStation(station.id)}
                    className={`px-2.5 py-2 border text-left transition-colors min-h-[50px] cursor-pointer min-w-0 ${
                      isSelected && audioPlaying
                        ? 'border-[var(--accent-1)]/80 bg-[var(--bg-surface)] text-[#FAF3EA]'
                        : isSelected
                        ? 'border-[#FAF3EA]/26 bg-[var(--bg-surface)]/70 text-[#FAF3EA]'
                        : 'border-[#FAF3EA]/10 bg-transparent text-[#FAF3EA]/60 hover:border-[#FAF3EA]/26 hover:text-[#FAF3EA]'
                    }`}
                  >
                    <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--accent-3)] whitespace-nowrap">
                      {station.freq}
                    </p>
                    <p className="text-xs font-medium truncate mt-0.5">{station.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
