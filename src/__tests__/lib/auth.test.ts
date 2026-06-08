import { verifyPassword, hashPassword } from '@/lib/auth'

describe('auth', () => {
  it('hashPassword returns a bcrypt hash', async () => {
    const hash = await hashPassword('mypassword')
    expect(hash).toMatch(/^\$2b\$/)
  })

  it('verifyPassword returns true for correct password', async () => {
    const hash = await hashPassword('correct')
    expect(await verifyPassword('correct', hash)).toBe(true)
  })

  it('verifyPassword returns false for wrong password', async () => {
    const hash = await hashPassword('correct')
    expect(await verifyPassword('wrong', hash)).toBe(false)
  })
})
