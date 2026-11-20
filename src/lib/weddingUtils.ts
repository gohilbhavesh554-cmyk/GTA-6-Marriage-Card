import type { WeddingConfig, WeddingEventItem } from '../types/wedding';

export function isPlaceholderText(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    !value.trim() ||
    lower.includes('replace with') ||
    lower.includes('add recommended') ||
    lower.includes('add confirmed') ||
    lower.includes('add shuttle') ||
    lower.includes('add venue')
  );
}

/**
 * Computes live countdown components to the wedding date & ceremony time in the target IANA timezone.
 */
export function getWeddingTargetTimestamp(
  weddingDate: string,
  ceremonyTime: string,
  timezone: string
): number {
  const [year, month, day] = weddingDate.split('-').map(Number);
  const [hour = 16, minute = 30] = (ceremonyTime || '16:30').split(':').map(Number);
  if (!year || !month || !day) {
    return Date.UTC(2027, 5, 19, 20, 30, 0);
  }

  // Approximate UTC date then refine with Intl.DateTimeFormat offset in target timezone
  const guessUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    const parts = formatter.formatToParts(guessUtc);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') map[p.type] = Number(p.value);
    }
    const asIfUtc = Date.UTC(
      map.year,
      map.month - 1,
      map.day,
      map.hour,
      map.minute,
      map.second
    );
    const offsetMs = asIfUtc - guessUtc.getTime();
    return Date.UTC(year, month - 1, day, hour, minute, 0) - offsetMs;
  } catch {
    return Date.UTC(year, month - 1, day, hour + 4, minute, 0);
  }
}

export interface CountdownSnapshot {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export function calculateCountdown(targetMs: number, nowMs = Date.now()): CountdownSnapshot {
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, completed: false };
}

/**
 * Generates deterministic valid Firestore doc ID from guest email (or inviteCode)
 * to prevent duplicate RSVP submissions without exposing existing records.
 */
export async function generateDeterministicRsvpId(email: string, inviteCode?: string): Promise<string> {
  const normalized = (inviteCode ? `invite_${inviteCode}` : `email_${email.trim().toLowerCase()}`);
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
    return `rsvp_${hashHex}`;
  } catch {
    const safe = normalized.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
    return `rsvp_${safe}`;
  }
}

function parseTime12hTo24h(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hours: 16, minutes: 30 };
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function formatIcsLocalDateTime(dateStr: string, hours: number, minutes: number, addDay = false): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + (addDay ? 1 : 0), hours, minutes, 0));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
}

export function buildIcsContent(config: WeddingConfig, events: WeddingEventItem[]): string {
  const tz = config.timezone || 'America/New_York';
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const venueAddr = isPlaceholderText(config.venueAddress)
    ? `${config.venueName}, ${config.city}, ${config.state}, ${config.country}`
    : `${config.venueName}, ${config.venueAddress}`;

  const vevents = events.map((ev) => {
    const start = parseTime12hTo24h(ev.time);
    const end = parseTime12hTo24h(ev.endTime || '11:30 PM');
    const rollsOverMidnight = end.hours < start.hours;
    const dtStart = formatIcsLocalDateTime(config.weddingDate, start.hours, start.minutes, false);
    const dtEnd = formatIcsLocalDateTime(config.weddingDate, end.hours, end.minutes, rollsOverMidnight);
    const locationText = ev.location ? `${ev.location} — ${venueAddr}` : venueAddr;

    return [
      'BEGIN:VEVENT',
      `UID:${ev.id}-${config.weddingDate}@loveinthecity.wedding`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;TZID=${tz}:${dtStart}`,
      `DTEND;TZID=${tz}:${dtEnd}`,
      `SUMMARY:${escapeIcsText(`${config.displayNames} Wedding — ${ev.title} (${ev.subtitle})`)}`,
      `DESCRIPTION:${escapeIcsText(`${ev.description} Dress code: ${config.dressCode}.`)}`,
      `LOCATION:${escapeIcsText(locationText)}`,
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Love In The City//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(`${config.displayNames} — Miami Wedding`)}`,
    `X-WR-TIMEZONE:${tz}`,
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getGoogleMapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function buildInvitationUrl(inviteCode?: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  if (!inviteCode) return base;
  return `${base}?invite=${encodeURIComponent(inviteCode)}`;
}

export function exportRsvpsToCsv(
  rows: Array<{
    fullName: string;
    email: string;
    attendance: string;
    guestCount: number;
    guestNames: string;
    mealPreference: string;
    dietaryRequirements: string;
    songRequest: string;
    message: string;
    inviteCode: string;
  }>
): void {
  const headers = [
    'Full Name',
    'Email',
    'Attendance',
    'Guest Count',
    'Additional Guests',
    'Meal Preference',
    'Dietary Requirements',
    'Song Request',
    'Message',
    'Invite Code',
  ];
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.fullName,
        r.email,
        r.attendance,
        r.guestCount,
        r.guestNames,
        r.mealPreference,
        r.dietaryRequirements,
        r.songRequest,
        r.message,
        r.inviteCode,
      ]
        .map(escapeCsv)
        .join(',')
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ava-and-noah-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
