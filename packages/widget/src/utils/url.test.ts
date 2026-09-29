/** @vitest-environment happy-dom */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { isHttpUrl, openInNewTab } from './url.js'

describe('isHttpUrl', () => {
  it.each([
    'https://etherscan.io/tx/0xabc',
    'http://localhost:3000/tx/0xabc',
    'HTTPS://ETHERSCAN.IO/tx/0xabc',
    'https://tronscan.org/#/transaction/abc',
  ])('accepts %s', (url) => {
    expect(isHttpUrl(url)).toBe(true)
  })

  it.each([
    'javascript:alert(document.domain)',
    'JavaScript:alert(1)',
    ' \tjavascript:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'etherscan.io/tx/0xabc',
    '/tx/0xabc',
    '//evil.example/tx/0xabc',
    '',
    undefined,
  ])('rejects %j', (url) => {
    expect(isHttpUrl(url)).toBe(false)
  })
})

describe('openInNewTab', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens an http(s) URL in a new tab without an opener or referrer', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    openInNewTab('https://etherscan.io/tx/0xabc')
    expect(open).toHaveBeenCalledWith(
      'https://etherscan.io/tx/0xabc',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('does not open a URL that is not http(s)', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    openInNewTab('javascript:alert(document.domain)')
    openInNewTab(undefined)
    expect(open).not.toHaveBeenCalled()
  })
})
