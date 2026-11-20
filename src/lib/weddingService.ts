import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { DEFAULT_WEDDING_CONFIG } from '../data/weddingDefaults';
import { generateDeterministicRsvpId } from './weddingUtils';
import type {
  GuestbookEntry,
  InvitationRecord,
  RsvpRecord,
  WeddingConfig,
} from '../types/wedding';

const CONFIG_PATH = 'weddingConfig/main';

export async function fetchWeddingConfig(): Promise<WeddingConfig> {
  try {
    const snap = await getDoc(doc(db, 'weddingConfig', 'main'));
    if (!snap.exists()) {
      return DEFAULT_WEDDING_CONFIG;
    }
    return {
      ...DEFAULT_WEDDING_CONFIG,
      ...(snap.data() as Partial<WeddingConfig>),
    };
  } catch (error) {
    console.warn('Using default wedding config because live fetch failed:', error);
    return DEFAULT_WEDDING_CONFIG;
  }
}

export async function saveWeddingConfig(config: WeddingConfig): Promise<void> {
  const payload = {
    brideFirstName: config.brideFirstName.trim().slice(0, 60),
    brideLastName: config.brideLastName.trim().slice(0, 60),
    groomFirstName: config.groomFirstName.trim().slice(0, 60),
    groomLastName: config.groomLastName.trim().slice(0, 60),
    displayNames: config.displayNames.trim().slice(0, 120),
    weddingTagline: config.weddingTagline.trim().slice(0, 180),
    storyTitle: config.storyTitle.trim().slice(0, 180),
    brideParents: config.brideParents.trim().slice(0, 120),
    groomParents: config.groomParents.trim().slice(0, 120),
    weddingDate: config.weddingDate.trim().slice(0, 10),
    ceremonyTime: (config.ceremonyTime || '16:30').trim().slice(0, 20),
    displayDate: config.displayDate.trim().slice(0, 80),
    timezone: config.timezone.trim().slice(0, 64),
    city: config.city.trim().slice(0, 80),
    state: config.state.trim().slice(0, 80),
    country: config.country.trim().slice(0, 80),
    venueName: config.venueName.trim().slice(0, 120),
    venueAddress: config.venueAddress.trim().slice(0, 260),
    dressCode: config.dressCode.trim().slice(0, 80),
    dressCodeDescription: config.dressCodeDescription.trim().slice(0, 400),
    dressCodeAvoidNote: config.dressCodeAvoidNote.trim().slice(0, 260),
    rsvpDeadline: config.rsvpDeadline.trim().slice(0, 20),
    rsvpContact: config.rsvpContact.trim().slice(0, 160),
    nearestAirport: config.nearestAirport.trim().slice(0, 140),
    airportCode: config.airportCode.trim().slice(0, 10),
    hotelInformation: config.hotelInformation.trim().slice(0, 1000),
    transportation: config.transportation.trim().slice(0, 1000),
    parkingInformation: config.parkingInformation.trim().slice(0, 600),
    plusOnePolicy: config.plusOnePolicy.trim().slice(0, 300),
    childrenPolicy: config.childrenPolicy.trim().slice(0, 300),
    accessibilityInformation: config.accessibilityInformation.trim().slice(0, 600),
    giftInformation: config.giftInformation.trim().slice(0, 600),
    schedule: config.schedule.slice(0, 10),
    storyChapters: config.storyChapters.slice(0, 10),
    galleryItems: config.galleryItems.slice(0, 24),
    faqs: config.faqs.slice(0, 20),
    hotels: config.hotels.slice(0, 8),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'weddingConfig', 'main'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CONFIG_PATH);
  }
}

export async function fetchInvitationByCode(code: string): Promise<InvitationRecord | null> {
  const cleanCode = code.trim();
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(cleanCode)) {
    return null;
  }
  const path = `invitations/${cleanCode}`;
  try {
    const snap = await getDoc(doc(db, 'invitations', cleanCode));
    if (!snap.exists()) return null;
    return snap.data() as InvitationRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export interface SubmitRsvpInput {
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
}

export async function submitRsvp(input: SubmitRsvpInput): Promise<{ id: string }> {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanInvite = input.inviteCode.trim();
  const rsvpId = await generateDeterministicRsvpId(cleanEmail, cleanInvite || undefined);
  const path = `rsvps/${rsvpId}`;

  const payload = {
    fullName: input.fullName.trim().slice(0, 120),
    email: cleanEmail.slice(0, 160),
    attendance: input.attendance,
    guestCount: input.attendance === 'Joyfully Accepts' ? Math.max(1, Math.min(10, Math.round(input.guestCount))) : 0,
    guestNames: input.guestNames.trim().slice(0, 300),
    mealPreference: input.attendance === 'Joyfully Accepts' ? input.mealPreference : '',
    dietaryRequirements: input.dietaryRequirements.trim().slice(0, 500),
    songRequest: input.songRequest.trim().slice(0, 180),
    message: input.message.trim().slice(0, 800),
    inviteCode: cleanInvite.slice(0, 64),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'rsvps', rsvpId), payload);
    return { id: rsvpId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
      throw new Error('DUPLICATE_OR_INVALID_RSVP');
    }
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchApprovedGuestbook(): Promise<GuestbookEntry[]> {
  const path = 'guestbook';
  try {
    const q = query(
      collection(db, path),
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GuestbookEntry, 'id'>),
    }));
  } catch {
    // Fallback without composite index if index is still building
    try {
      const q = query(collection(db, path), where('approved', '==', true));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GuestbookEntry, 'id'>),
        }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    } catch (innerError) {
      handleFirestoreError(innerError, OperationType.LIST, path);
    }
  }
}

export async function submitGuestbookEntry(input: {
  authorName: string;
  relationship: string;
  message: string;
  inviteCode: string;
  isAdmin?: boolean;
}): Promise<{ id: string }> {
  const entryId = `gb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `guestbook/${entryId}`;
  const payload = {
    authorName: input.authorName.trim().slice(0, 100),
    relationship: input.relationship.trim().slice(0, 80),
    message: input.message.trim().slice(0, 600),
    inviteCode: input.inviteCode.trim().slice(0, 64),
    approved: Boolean(input.isAdmin),
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'guestbook', entryId), payload);
    return { id: entryId };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// --- Admin-only real-time subscriptions and mutations ---

export function subscribeAllRsvps(
  onData: (rsvps: RsvpRecord[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'rsvps';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const rows = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<RsvpRecord, 'id'>),
        }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      onData(rows);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeAllInvitations(
  onData: (invitations: InvitationRecord[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'invitations';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const rows = snap.docs
        .map((d) => d.data() as InvitationRecord)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      onData(rows);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeAllGuestbook(
  onData: (entries: GuestbookEntry[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'guestbook';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const rows = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GuestbookEntry, 'id'>),
        }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      onData(rows);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function createInvitation(input: {
  code: string;
  guestName: string;
  partyLabel: string;
  maxGuests: number;
  plusOneAllowed: boolean;
  childrenAllowed: boolean;
  personalNote: string;
}): Promise<void> {
  const cleanCode = input.code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

  if (cleanCode.length < 3) {
    throw new Error('Invitation code must be at least 3 alphanumeric characters.');
  }

  const path = `invitations/${cleanCode}`;
  const payload = {
    code: cleanCode,
    guestName: input.guestName.trim().slice(0, 120),
    partyLabel: input.partyLabel.trim().slice(0, 140),
    maxGuests: Math.max(1, Math.min(10, Math.round(input.maxGuests))),
    plusOneAllowed: Boolean(input.plusOneAllowed),
    childrenAllowed: Boolean(input.childrenAllowed),
    personalNote: input.personalNote.trim().slice(0, 500),
    status: 'pending' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'invitations', cleanCode), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateInvitationStatus(
  code: string,
  status: 'pending' | 'accepted' | 'declined'
): Promise<void> {
  const path = `invitations/${code}`;
  try {
    await updateDoc(doc(db, 'invitations', code), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInvitation(code: string): Promise<void> {
  const path = `invitations/${code}`;
  try {
    await deleteDoc(doc(db, 'invitations', code));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteRsvp(rsvpId: string): Promise<void> {
  const path = `rsvps/${rsvpId}`;
  try {
    await deleteDoc(doc(db, 'rsvps', rsvpId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function setGuestbookApproval(entryId: string, approved: boolean): Promise<void> {
  const path = `guestbook/${entryId}`;
  try {
    await updateDoc(doc(db, 'guestbook', entryId), { approved });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteGuestbookEntry(entryId: string): Promise<void> {
  const path = `guestbook/${entryId}`;
  try {
    await deleteDoc(doc(db, 'guestbook', entryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
