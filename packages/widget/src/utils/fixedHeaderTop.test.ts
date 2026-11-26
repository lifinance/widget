import { describe, expect, it } from 'vitest'
import { fixedHeaderTopOffset } from './fixedHeaderTop.js'

describe('fixedHeaderTopOffset', () => {
  it('reads a numeric top', () => {
    expect(fixedHeaderTopOffset(48)).toBe(48)
  })

  it('reads a pixel string', () => {
    expect(fixedHeaderTopOffset('48px')).toBe(48)
  })

  it('treats a missing or negative top as zero', () => {
    expect(fixedHeaderTopOffset(undefined)).toBe(0)
    expect(fixedHeaderTopOffset(-8)).toBe(0)
    expect(fixedHeaderTopOffset('auto')).toBe(0)
  })
})
