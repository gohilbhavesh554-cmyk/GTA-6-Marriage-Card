export type ViceThemeId = 'vice' | 'golden' | 'midnight';

export interface ViceThemeDefinition {
  id: ViceThemeId;
  label: string;
  tagline: string;
  swatch: [string, string, string];
  foilStops: [string, string, string, string];
  foilText: string;
  petalColors: string[];
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
}

export const VICE_THEMES: Record<ViceThemeId, ViceThemeDefinition> = {
  vice: {
    id: 'vice',
    label: 'Vice Sunset',
    tagline: 'Miami Twilight',
    swatch: ['#F26386', '#F48C5E', '#F2C97D'],
    foilStops: ['#DF6B89', '#EC966C', '#EFC985', '#D46D8A'],
    foilText: '#0A090F',
    petalColors: ['#F26386', '#F69AB0', '#F4A261', '#F2C97D', '#FAF3EA'],
    accentPrimary: '#F26386',
    accentSecondary: '#F2C97D',
    accentTertiary: '#7AC8DB',
  },
  golden: {
    id: 'golden',
    label: 'Riviera Gold',
    tagline: 'Amalfi & Coral Dusk',
    swatch: ['#EBC06D', '#E87F58', '#FAF3EA'],
    foilStops: ['#CCA050', '#EBC06D', '#F7DFAA', '#DE835F'],
    foilText: '#100D0B',
    petalColors: ['#EBC06D', '#F2A37E', '#F7DFAA', '#E87F58', '#FAF3EA'],
    accentPrimary: '#EBC06D',
    accentSecondary: '#E87F58',
    accentTertiary: '#6BC5B8',
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight Coast',
    tagline: 'Ocean Drive After Dark',
    swatch: ['#6DD5ED', '#B584FF', '#F072A5'],
    foilStops: ['#6DD5ED', '#9A88F5', '#B584FF', '#E579A8'],
    foilText: '#070A12',
    petalColors: ['#6DD5ED', '#C5A3FF', '#F072A5', '#BCEEFF', '#F4F7FF'],
    accentPrimary: '#6DD5ED',
    accentSecondary: '#B584FF',
    accentTertiary: '#F072A5',
  },
};

export const VICE_THEME_LIST: ViceThemeDefinition[] = [
  VICE_THEMES.vice,
  VICE_THEMES.golden,
  VICE_THEMES.midnight,
];
