/**
 * Invisible spam protection for the contact form.
 *
 * Two checks, both validated server-side so a bot can't bypass them by
 * skipping the page's JavaScript:
 *   - Honeypot: a hidden field humans never see. If it's filled, it's a bot.
 *   - Time-trap: the form records when it loaded. A submission that arrives
 *     too fast (or with no/invalid timestamp) is automated, not a human.
 *
 * Neither check requires any interaction from the user.
 */

/** Minimum time (ms) a real person needs to fill out the form. */
export const MIN_FILL_MS = 3000

export type SpamSignals = {
  /** Honeypot field — must stay empty for real users. */
  company?: unknown
  /** Timestamp (ms) captured when the form mounted in the browser. */
  startedAt?: unknown
}

export function isSpam(data: SpamSignals, now: number = Date.now()): boolean {
  // Honeypot: any real content means a bot filled the hidden field.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return true
  }

  // Time-trap: a missing or non-numeric timestamp means the submission
  // didn't come from our form (e.g. a bot POSTing straight to the API).
  if (typeof data.startedAt !== 'number' || !Number.isFinite(data.startedAt)) {
    return true
  }

  const elapsed = now - data.startedAt

  // Submitted too fast, or with a timestamp in the future (clock spoofing).
  if (elapsed < MIN_FILL_MS) {
    return true
  }

  return false
}
