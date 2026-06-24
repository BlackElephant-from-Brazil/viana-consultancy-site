import { isSpam, MIN_FILL_MS } from '@/lib/spam'

const validTiming = { startedAt: 1_000_000, company: '' }
const now = 1_000_000 + MIN_FILL_MS + 1000

describe('isSpam', () => {
  it('flags submissions where the honeypot field is filled', () => {
    expect(isSpam({ ...validTiming, company: 'Acme Bots Ltd' }, now)).toBe(true)
  })

  it('ignores whitespace-only honeypot values as empty', () => {
    expect(isSpam({ ...validTiming, company: '   ' }, now)).toBe(false)
  })

  it('flags submissions with no startedAt timestamp', () => {
    expect(isSpam({ company: '' }, now)).toBe(true)
  })

  it('flags submissions sent faster than the minimum fill time', () => {
    const startedAt = now - (MIN_FILL_MS - 1)
    expect(isSpam({ company: '', startedAt }, now)).toBe(true)
  })

  it('accepts submissions with empty honeypot and realistic timing', () => {
    expect(isSpam(validTiming, now)).toBe(false)
  })

  it('flags submissions whose timestamp is in the future', () => {
    expect(isSpam({ company: '', startedAt: now + 5000 }, now)).toBe(true)
  })
})
