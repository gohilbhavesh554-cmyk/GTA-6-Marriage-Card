# Security Specification — LOVE IN THE CITY

## 1. Data Invariants
1. **Default Deny**: Any collection not explicitly matched is denied for all operations.
2. **PII Isolation (`rsvps`)**: Guest RSVP documents contain personal emails, dietary notes, and messages. Only verified admins may `get`, `list`, `update`, or `delete` RSVPs. Non-admin guests may strictly `create` a new RSVP document with a deterministic ID (preventing overwrite duplicates) and valid schema.
3. **Invitation Guest-Count Enforcement**: When an RSVP supplies a non-empty `inviteCode`, that invitation MUST exist in `/invitations/{inviteCode}` and `guestCount` MUST NOT exceed the invitation's `maxGuests`.
4. **Anti-Enumeration (`invitations`)**: Public users may `get` a single invitation only when they possess its exact `inviteCode`. Listing all invitations is restricted exclusively to verified admins.
5. **Guestbook Moderation (`guestbook`)**: Public guests may only create entries with `approved == false`. Public `get` and `list` queries strictly enforce `resource.data.approved == true`. Only verified admins may approve or delete entries.
6. **Admin Verification**: Admin access strictly requires `request.auth != null && request.auth.token.email_verified == true` paired with either the bootstrapped admin email or existence in `/admins/{uid}`. Users can never self-register into `/admins/{uid}`.
7. **Temporal & Structural Integrity**: All `createdAt` and `updatedAt` fields MUST equal `request.time`, all strings enforce `.size()` limits, all arrays enforce `.size() <= MAX`, and all writes enforce strict `keys().hasAll()` / `keys().hasOnly()` and `affectedKeys().hasOnly()` gates.

## 2. The "Dirty Dozen" Attack Payloads
1. **Shadow Field Injection on RSVP**: Submitting an RSVP with extra ghost field `isAdmin: true` -> DENIED.
2. **Email Spoofing Admin Bypass**: Authenticated user with admin email but `email_verified: false` attempting to list `/rsvps` -> DENIED.
3. **PII Blanket Read on RSVPs**: Unauthenticated or non-admin signed-in user calling `get` or `list` on `/rsvps` -> DENIED.
4. **Invitation Enumeration**: Non-admin user calling `list` on `/invitations` -> DENIED.
5. **Guest Count Overflow**: Guest submitting RSVP with `inviteCode: "miller-2027"` (`maxGuests: 2`) and `guestCount: 5` -> DENIED.
6. **Orphaned Invite Reference**: Guest submitting RSVP with non-existent `inviteCode: "fake-code-999"` -> DENIED.
7. **Guestbook Self-Approval**: Public guest creating a `/guestbook/{id}` document with `approved: true` -> DENIED.
8. **Unapproved Guestbook Scraping**: Public user running `list` on `/guestbook` without filtering `approved == true` -> DENIED.
9. **Resource Poisoning via Oversized ID**: Creating an RSVP or guestbook doc with a 200-char ID or invalid characters (`../admin`) -> DENIED.
10. **Client Timestamp Forgery**: Creating an RSVP with backdated `createdAt` not equal to `request.time` -> DENIED.
11. **Self-Assigned Admin Escalation**: Authenticated user writing `/admins/{theirUid}` -> DENIED.
12. **Value Poisoning on Update**: Admin attempting to update `/guestbook/{id}` by mutating `message` or setting `approved: "yes"` (non-boolean) -> DENIED.
