import { useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Navigation, Plane } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../lib/weddingUtils';
import type { WeddingConfig } from '../types/wedding';

interface LocationSectionProps {
  config: WeddingConfig;
}

export function LocationSection({ config }: LocationSectionProps) {
  const [copied, setCopied] = useState(false);
  const [activePin, setActivePin] = useState<'venue' | 'airport' | 'coast'>('venue');

  const mapQuery = `${config.venueName}, ${config.venueAddress}`;

  const copyAddress = async () => {
    const text = `${config.venueName}, ${config.venueAddress}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const pinDetails = {
    venue: {
      title: config.venueName,
      subtitle: config.venueAddress,
      coords: '25.8165° N · 80.1225° W',
    },
    airport: {
      title: `${config.nearestAirport} (${config.airportCode})`,
      subtitle:
        'Nonstop flights from New York (JFK), London (LHR), Paris (CDG), Frankfurt & Milan · 22 min drive.',
      coords: 'TRANSATLANTIC HUB · MIA',
    },
    coast: {
      title: 'Biscayne Bay & Ocean Drive',
      subtitle: 'Scenic twilight coastal route linking Downtown Miami to Collins Avenue.',
      coords: 'COASTAL ROUTE · GOLDEN HOUR',
    },
  };

  return (
    <section
      id="location"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-surface-alt)] transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
            Destination · {config.city}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
            Meet Us by the Ocean
          </h2>
          <p className="text-sm sm:text-base text-[#FFF4E8]/75 mt-3">
            Interactive Miami Beach coastal map and direct navigation to {config.venueName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* Left: Stylized Interactive Miami Coastal Map */}
          <div className="lg:col-span-7 border border-[#FFF4E8]/15 bg-[var(--bg-surface)] flex flex-col overflow-hidden min-h-[380px]">
            <div className="relative flex-1 min-h-[380px] bg-[var(--bg-canvas)] overflow-hidden flex flex-col justify-between p-5 sm:p-6">
              <svg
                viewBox="0 0 800 500"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              >
                <defs>
                  <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0E1426" />
                    <stop offset="100%" stopColor="#1B2A42" />
                  </linearGradient>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,244,232,0.05)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="500" fill="url(#oceanGrad)" />
                <rect width="800" height="500" fill="url(#grid)" />

                <path
                  d="M 0 0 L 420 0 L 395 110 L 415 215 L 365 320 L 390 420 L 345 500 L 0 500 Z"
                  fill="#151226"
                  stroke="rgba(255,244,232,0.12)"
                  strokeWidth="1.5"
                />

                <path
                  d="M 555 20 C 575 110, 585 215, 560 355 C 550 405, 520 445, 515 470 L 555 475 C 585 390, 620 220, 600 20 Z"
                  fill="#1C1832"
                  stroke="rgba(255,135,73,0.45)"
                  strokeWidth="1.5"
                />

                <path
                  d="M 380 185 Q 475 170 572 195"
                  fill="none"
                  stroke="#FF8749"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
                <path
                  d="M 372 285 Q 465 305 562 290"
                  fill="none"
                  stroke="rgba(56,217,245,0.55)"
                  strokeWidth="1.5"
                />

                <path d="M 110 0 L 110 500" stroke="rgba(255,244,232,0.06)" strokeWidth="1.5" />
                <path d="M 240 0 L 240 500" stroke="rgba(255,244,232,0.08)" strokeWidth="1.5" />
                <path d="M 0 210 L 410 210" stroke="rgba(255,244,232,0.08)" strokeWidth="1.5" />
                <path d="M 0 340 L 375 340" stroke="rgba(255,244,232,0.06)" strokeWidth="1.5" />

                <text
                  x="435"
                  y="390"
                  fill="rgba(56,217,245,0.45)"
                  fontSize="11"
                  letterSpacing="4"
                  fontFamily="monospace"
                >
                  BISCAYNE BAY
                </text>
                <text
                  x="640"
                  y="255"
                  fill="rgba(56,217,245,0.38)"
                  fontSize="11"
                  letterSpacing="4"
                  fontFamily="monospace"
                >
                  ATLANTIC
                </text>
              </svg>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-[#FFF4E8]/70">
                <span>Miami Beach Coastal Map</span>
                <span className="text-[var(--accent-3)]">Tap Pins to Explore</span>
              </div>

              <div className="relative z-10 flex-1 my-4">
                <button
                  type="button"
                  onClick={() => setActivePin('airport')}
                  className={`absolute left-[19%] top-[40%] -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 border text-[11px] font-mono uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    activePin === 'airport'
                      ? 'bg-[var(--accent-cool)] text-[#0B0914] border-[var(--accent-cool)] font-semibold'
                      : 'bg-[#0B0914]/90 text-[#FFF4E8] border-[#FFF4E8]/25 hover:border-[var(--accent-cool)]'
                  }`}
                >
                  MIA Airport
                </button>

                <button
                  type="button"
                  onClick={() => setActivePin('coast')}
                  className={`absolute left-[56%] top-[33%] -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 border text-[11px] font-mono uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    activePin === 'coast'
                      ? 'bg-[var(--accent-2)] text-[#0B0914] border-[var(--accent-2)] font-semibold'
                      : 'bg-[#0B0914]/90 text-[#FFF4E8] border-[#FFF4E8]/25 hover:border-[var(--accent-2)]'
                  }`}
                >
                  Bay Causeway
                </button>

                <button
                  type="button"
                  onClick={() => setActivePin('venue')}
                  className={`absolute left-[72%] top-[58%] -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs font-mono uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    activePin === 'venue'
                      ? 'bg-[var(--accent-1)] text-[#0B0914] border-[var(--accent-1)] font-semibold'
                      : 'bg-[#0B0914]/90 text-[var(--accent-3)] border-[var(--accent-3)]/50 hover:border-[var(--accent-1)]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{config.venueName}</span>
                </button>
              </div>

              <div className="relative z-10 border border-[#FFF4E8]/15 bg-[#0B0914]/90 p-4 backdrop-blur-sm">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-3)]">
                  {pinDetails[activePin].coords}
                </p>
                <p className="font-display text-2xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                  {pinDetails[activePin].title}
                </p>
                <p className="text-xs sm:text-sm text-[#FFF4E8]/75 mt-1">
                  {pinDetails[activePin].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Structured Venue & Navigation Card */}
          <div className="lg:col-span-5 border border-[#FFF4E8]/14 bg-[var(--bg-surface)] p-6 sm:p-9 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--accent-2)]">
                  Wedding Venue
                </p>
                <h3 className="font-display text-4xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                  {config.venueName}
                </h3>
                <p className="text-sm sm:text-base text-[#FFF4E8]/85 mt-2 leading-relaxed">
                  {config.venueAddress}
                </p>
                <p className="text-xs font-mono tracking-[0.16em] uppercase text-[#FFF4E8]/55 mt-2">
                  {config.city}, {config.state} · {config.country}
                </p>
              </div>

              <div className="border-t border-[#FFF4E8]/10 pt-5 space-y-4 text-sm">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-3)] mb-1">
                    Nearest Airport
                  </p>
                  <p className="text-[#FFF4E8]/82 inline-flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[var(--accent-cool)] shrink-0" />
                    <span>
                      {config.nearestAirport} ({config.airportCode})
                    </span>
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-3)] mb-1">
                    Valet &amp; Arrival
                  </p>
                  <p className="text-[#FFF4E8]/75 leading-relaxed">{config.parkingInformation}</p>
                </div>

                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-3)] mb-1">
                    Partner Hotels
                  </p>
                  <p className="text-[#FFF4E8]/75 leading-relaxed">{config.hotelInformation}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#FFF4E8]/10 flex flex-col sm:flex-row gap-3">
              <a
                href={getGoogleMapsDirectionsUrl(mapQuery)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFF4E8] text-[#0B0914] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[var(--accent-3)] transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#FFF4E8]/25 text-[#FFF4E8] hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] text-xs font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px] whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent-3)]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
