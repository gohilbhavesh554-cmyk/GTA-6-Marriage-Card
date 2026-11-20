import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { DEFAULT_WEDDING_CONFIG } from './data/weddingDefaults';
import { ambientSunsetAudio, type ViceStationId } from './lib/ambientAudio';
import { fetchInvitationByCode, fetchWeddingConfig } from './lib/weddingService';
import { buildInvitationUrl } from './lib/weddingUtils';
import type { ViceThemeId } from './types/theme';
import type { InvitationRecord, WeddingConfig } from './types/wedding';
import { FallingPetals } from './components/FallingPetals';
import { HeroSection } from './components/HeroSection';
import { ViceExperienceBar } from './components/ViceExperienceBar';
import { CollectorPostcardSection } from './components/CollectorPostcardSection';
import { ScheduleSection } from './components/ScheduleSection';
import { CountdownSection } from './components/CountdownSection';
import { StorySection } from './components/StorySection';
import { LocationSection } from './components/LocationSection';
import { DressCodeSection } from './components/DressCodeSection';
import { GallerySection } from './components/GallerySection';
import { TravelFaqSection } from './components/TravelFaqSection';
import { ClosingSection } from './components/ClosingSection';

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_WEDDING_CONFIG);
  const [personalInvite, setPersonalInvite] = useState<InvitationRecord | null>(null);
  const [activeTheme, setActiveTheme] = useState<ViceThemeId>('vice');

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activeStation, setActiveStation] = useState<ViceStationId>('ocean');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? '' : curr));
    }, 2800);
  }, []);

  // Load saved wedding configuration from Firestore if present, otherwise use curated defaults
  useEffect(() => {
    let active = true;
    fetchWeddingConfig().then((loaded) => {
      if (active) setConfig(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync theme attribute on <html> so root canvas and all sections transition smoothly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Sync document title
  useEffect(() => {
    document.title = `${config.displayNames} | Love in the City — ${config.city}`;
  }, [config.displayNames, config.city]);

  // Optional personalized guest URL (?invite=<code>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (!code) return;
    fetchInvitationByCode(code)
      .then((inv) => {
        if (inv) setPersonalInvite(inv);
      })
      .catch(() => {
        // Gracefully ignore unknown invite codes
      });
  }, []);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      ambientSunsetAudio.stop();
    };
  }, []);

  const handleToggleAudio = async () => {
    const nextState = await ambientSunsetAudio.toggle();
    setAudioPlaying(nextState);
  };

  const handleSelectStation = async (station: ViceStationId) => {
    setActiveStation(station);
    const playing = await ambientSunsetAudio.selectStation(station, true);
    setAudioPlaying(playing);
  };

  const handleShareInvitation = useCallback(async () => {
    const url = buildInvitationUrl(personalInvite?.code);
    const shareData = {
      title: `${config.displayNames} | Love in the City`,
      text: `${config.weddingTagline} Join ${config.displayNames} on ${config.displayDate} in ${config.city}, ${config.state}.`,
      url,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('Invitation link copied to clipboard.');
    } catch {
      showToast('Ready to share from your browser address bar.');
    }
  }, [
    config.city,
    config.displayDate,
    config.displayNames,
    config.state,
    config.weddingTagline,
    personalInvite?.code,
    showToast,
  ]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-theme={activeTheme}
        className="min-h-screen bg-[var(--bg-canvas)] text-[#FFF4E8] relative transition-colors duration-500"
      >
        {/* Tropical Flowers & Petals Drifting Gently From Top (Theme-Synced) */}
        <FallingPetals theme={activeTheme} />

        {/* Pure Full-Bleed GTA VI Marriage Card — Zero Navbar, Zero Scrollbar, Zero Clutter */}
        <main>
          <HeroSection
            config={config}
            personalInvite={personalInvite}
            onShare={() => void handleShareInvitation()}
          />

          {/* Live Atmosphere Theme Switcher + 3-Station Vice FM Soundtrack */}
          <ViceExperienceBar
            activeTheme={activeTheme}
            onSelectTheme={setActiveTheme}
            audioPlaying={audioPlaying}
            activeStation={activeStation}
            onToggleAudio={() => void handleToggleAudio()}
            onSelectStation={(st) => void handleSelectStation(st)}
          />

          {/* Viral 3D Tilt & Tap-to-Flip Collectible Miami Postcard */}
          <CollectorPostcardSection
            config={config}
            onShare={() => void handleShareInvitation()}
          />

          {/* Interactive Metallic Foil Scratch-to-Reveal Date & Event Timings */}
          <ScheduleSection config={config} theme={activeTheme} />

          {/* Live Architectural Countdown */}
          <CountdownSection config={config} />

          {/* Swipeable / Tap-Through Cinema Story Reel */}
          <StorySection config={config} />

          {/* Interactive Miami Beach Coastal Map & Venue Details */}
          <LocationSection config={config} />

          {/* Editorial Miami Evening Dress Code Lookbook */}
          <DressCodeSection config={config} />

          {/* 35mm Editorial Film Roll & Lightbox */}
          <GallerySection config={config} />

          {/* US & UK Guest Travel Guide & FAQ */}
          <TravelFaqSection config={config} />
        </main>

        {/* Minimalist Cinematic Night Couple Finale */}
        <ClosingSection config={config} />

        {/* Subtle Floating Quick Sound Toggle (Only shows cleanly in bottom-right, zero nav chrome) */}
        <button
          type="button"
          onClick={() => void handleToggleAudio()}
          aria-pressed={audioPlaying}
          aria-label={audioPlaying ? 'Mute Vice FM soundtrack' : 'Play Vice FM soundtrack'}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center w-11 h-11 bg-[var(--bg-surface)]/92 border border-[#FFF4E8]/22 hover:border-[var(--accent-3)] text-[#FFF4E8] backdrop-blur-md transition-colors cursor-pointer shadow-lg"
        >
          {audioPlaying ? (
            <Volume2 className="w-4 h-4 text-[var(--accent-3)]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#FFF4E8]/60" />
          )}
        </button>

        {/* Subtle Share Toast */}
        {toastMessage && (
          <div
            role="status"
            className="fixed bottom-18 right-4 z-40 border border-[var(--accent-3)]/45 bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-[#FFF4E8] shadow-lg"
          >
            {toastMessage}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
