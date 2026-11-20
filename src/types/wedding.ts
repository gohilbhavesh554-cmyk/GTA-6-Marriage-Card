import type { Timestamp } from 'firebase/firestore';

export interface WeddingEventItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  endTime: string;
  description: string;
  location: string;
  dressHint: string;
  icon: 'ceremony' | 'cocktail' | 'reception' | 'afterparty';
}

export interface StoryChapter {
  id: string;
  year: string;
  title: string;
  location: string;
  description: string;
  photo: string;
  caption: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  aspect: 'wide' | 'portrait' | 'standard';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  neighborhood: string;
  distance: string;
  notes: string;
  bookingUrl: string;
}

export interface WeddingConfig {
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  displayNames: string;
  weddingTagline: string;
  storyTitle: string;
  brideParents: string;
  groomParents: string;
  weddingDate: string; // YYYY-MM-DD
  ceremonyTime: string; // HH:mm (24h in wedding timezone)
  displayDate: string;
  timezone: string;
  city: string;
  state: string;
  country: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  dressCodeDescription: string;
  dressCodeAvoidNote: string;
  rsvpDeadline: string;
  rsvpContact: string;
  nearestAirport: string;
  airportCode: string;
  hotelInformation: string;
  transportation: string;
  parkingInformation: string;
  plusOnePolicy: string;
  childrenPolicy: string;
  accessibilityInformation: string;
  giftInformation: string;
  schedule: WeddingEventItem[];
  storyChapters: StoryChapter[];
  galleryItems: GalleryItem[];
  faqs: FaqItem[];
  hotels: HotelRecommendation[];
  updatedAt?: Timestamp;
}

export interface InvitationRecord {
  code: string;
  guestName: string;
  partyLabel: string;
  maxGuests: number;
  plusOneAllowed: boolean;
  childrenAllowed: boolean;
  personalNote: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RsvpRecord {
  id: string;
  fullName: string;
  email: string;
  attendance: 'Joyfully Accepts' | 'Regretfully Declines';
  guestCount: number;
  guestNames: string;
  mealPreference: '' | 'Standard' | 'Vegetarian' | 'Vegan' | 'Other';
  dietaryRequirements: string;
  songRequest: string;
  message: string;
  inviteCode: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  relationship: string;
  message: string;
  inviteCode: string;
  approved: boolean;
  createdAt?: Timestamp;
}
