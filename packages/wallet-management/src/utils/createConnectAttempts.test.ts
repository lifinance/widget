import { describe, expect, it } from 'vitest'
import { createConnectAttempts } from './createConnectAttempts.js'

describe('createConnectAttempts', () => {
  it('does not supersede an attempt that never started', () => {
    const attempts = createConnectAttempts()
    const connected = attempts.create()
    attempts.create().start()

    expect(connected.isSuperseded()).toBe(false)
  })

  it('keeps the newest attempt current', () => {
    const attempt = createConnectAttempts().create()
    attempt.start()

    expect(attempt.isSuperseded()).toBe(false)
  })

  it('supersedes an older attempt when a newer one starts', () => {
    const attempts = createConnectAttempts()
    const older = attempts.create()
    const newer = attempts.create()

    older.start()
    newer.start()

    expect(older.isSuperseded()).toBe(true)
    expect(newer.isSuperseded()).toBe(false)
  })

  it('makes an attempt current again when it starts again', () => {
    const attempts = createConnectAttempts()
    const first = attempts.create()
    const second = attempts.create()

    first.start()
    second.start()
    first.start()

    expect(first.isSuperseded()).toBe(false)
    expect(second.isSuperseded()).toBe(true)
  })

  it('keeps the attempts of separate menus apart', () => {
    const attempt = createConnectAttempts().create()
    attempt.start()
    createConnectAttempts().create().start()

    expect(attempt.isSuperseded()).toBe(false)
  })
})
