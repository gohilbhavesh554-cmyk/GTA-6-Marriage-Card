import { useState } from 'react';
import {
  Car,
  ChevronDown,
  ExternalLink,
  Gift,
  Hotel,
  Navigation,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../lib/weddingUtils';
import type { WeddingConfig } from '../types/wedding';

interface TravelFaqSectionProps {
  config: WeddingConfig;
}

export function TravelFaqSection({ config }: TravelFaqSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(config.faqs[0]?.id ?? null);

  const airportDirectionsUrl = getGoogleMapsDirectionsUrl(
    `${config.nearestAirport}, ${config.city}, ${config.state}`
  );
  const venueDirectionsUrl = getGoogleMapsDirectionsUrl(
    `${config.venueName}, ${config.venueAddress}`
  );

  return (
    <>
      <section
        id="travel"
        className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-canvas)] transition-colors duration-500"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
                Travel &amp; Stay · U.S. &amp; Europe
              </p>
              <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FAF3EA] leading-[0.94] mt-1">
                Your Miami Weekend
              </h2>
              <p className="text-sm sm:text-base text-[#FAF3EA]/72 mt-3">
                Joining us from New York, California, London, Paris, or across Europe? Here is
                everything for a seamless oceanfront stay.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={airportDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#FFF4E8]/20 text-xs font-mono tracking-[0.14em] uppercase text-[#FFF4E8]/85 hover:border-[var(--accent-cool)] hover:text-[var(--accent-cool)] transition-colors min-h-[42px] whitespace-nowrap"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Airport Route</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={venueDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#FFF4E8]/20 text-xs font-mono tracking-[0.14em] uppercase text-[#FFF4E8]/85 hover:border-[var(--accent-3)] hover:text-[var(--accent-3)] transition-colors min-h-[42px] whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Venue Route</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="border border-[#FFF4E8]/12 bg-[var(--bg-surface)] p-6 sm:p-7">
              <Plane className="w-5 h-5 text-[var(--accent-cool)] mb-4" strokeWidth={1.5} />
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)]">
                Air Arrival · {config.airportCode}
              </p>
              <h3 className="font-display text-3xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                {config.nearestAirport}
              </h3>
              <p className="text-sm text-[#FAF3EA]/74 leading-relaxed mt-3">
                Daily nonstop connections into {config.airportCode} from London Heathrow, Paris
                CDG, Frankfurt, Madrid, New York JFK, and Los Angeles.
              </p>
            </div>

            <div className="border border-[#FFF4E8]/12 bg-[var(--bg-surface)] p-6 sm:p-7">
              <Hotel className="w-5 h-5 text-[var(--accent-2)] mb-4" strokeWidth={1.5} />
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)]">
                Where to Stay
              </p>
              <h3 className="font-display text-3xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                Oceanfront Hotels
              </h3>
              <p className="text-sm text-[#FFF4E8]/75 leading-relaxed mt-3">
                {config.hotelInformation}
              </p>
            </div>

            <div className="border border-[#FFF4E8]/12 bg-[var(--bg-surface)] p-6 sm:p-7">
              <Car className="w-5 h-5 text-[var(--accent-1)] mb-4" strokeWidth={1.5} />
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)]">
                Getting Around
              </p>
              <h3 className="font-display text-3xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                Shuttle &amp; Valet
              </h3>
              <p className="text-sm text-[#FFF4E8]/75 leading-relaxed mt-3">
                {config.transportation}
              </p>
              <p className="text-xs text-[#FFF4E8]/60 mt-3 pt-3 border-t border-[#FFF4E8]/10">
                {config.parkingInformation}
              </p>
            </div>
          </div>

          {config.hotels.length > 0 && (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              {config.hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border border-[#FFF4E8]/14 bg-[var(--bg-surface)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-3)]">
                      {hotel.neighborhood}
                      {hotel.distance ? ` · ${hotel.distance}` : ''}
                    </p>
                    <h4 className="font-display text-2xl tracking-[0.06em] text-[#FFF4E8] mt-1">
                      {hotel.name}
                    </h4>
                    {hotel.notes && (
                      <p className="text-sm text-[#FFF4E8]/70 mt-1">{hotel.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 pt-10 border-t border-[#FFF4E8]/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)] mb-2">
                Invitations &amp; Guests
              </p>
              <p className="text-[#FFF4E8]/75 leading-relaxed">
                <strong className="text-[#FFF4E8] font-medium">Plus Ones:</strong>{' '}
                {config.plusOnePolicy}
              </p>
              <p className="text-[#FFF4E8]/75 leading-relaxed mt-1.5">
                <strong className="text-[#FFF4E8] font-medium">Children:</strong>{' '}
                {config.childrenPolicy}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)] mb-2 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Accessibility</span>
              </p>
              <p className="text-[#FFF4E8]/75 leading-relaxed">
                {config.accessibilityInformation}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent-3)] mb-2 inline-flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                <span>Gifts</span>
              </p>
              <p className="text-[#FFF4E8]/75 leading-relaxed">{config.giftInformation}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative py-20 sm:py-26 px-4 sm:px-8 border-b border-[#FFF4E8]/10 bg-[var(--bg-surface-alt)] transition-colors duration-500"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--accent-3)]">
              Good to Know
            </p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-[0.06em] text-[#FFF4E8] leading-[0.94] mt-1">
              Guest Details &amp; FAQ
            </h2>
          </div>

          <div className="divide-y divide-[#FFF4E8]/12 border-y border-[#FFF4E8]/12">
            {config.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-5 flex items-center justify-between gap-6 text-left group cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-medium text-[#FFF4E8] group-hover:text-[var(--accent-3)] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--accent-3)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-8 text-sm sm:text-base text-[#FFF4E8]/75 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
