import { describe, expect, it } from 'vitest'
import { unavailableRoutesFromError } from './fromError.js'

const reasons = {
  filteredOut: [
    { overallPath: '1:ETH-1:USDC', reason: 'Pod is currently overloaded.' },
  ],
  failed: [],
}

const errorWith = (responseBody: unknown): unknown => ({
  cause: { responseBody },
})

describe('reading the diagnostics off a quote error', () => {
  it('prefers the documented errors field', () => {
    expect(unavailableRoutesFromError(errorWith({ errors: reasons }))).toEqual(
      reasons
    )
  })

  // Observed on the develop backend: the same payload arrives serialised into
  // `message` instead. Reading only `errors` left the user the generic sentence.
  it('reads a payload serialised into message', () => {
    const error = errorWith({ message: JSON.stringify(reasons), code: 1002 })
    expect(unavailableRoutesFromError(error)).toEqual(reasons)
  })

  it('reads a message that wraps the payload under errors', () => {
    const error = errorWith({ message: JSON.stringify({ errors: reasons }) })
    expect(unavailableRoutesFromError(error)).toEqual(reasons)
  })

  // The SDK appends the body message to the error message, so prose can lead.
  it('reads a payload that trails prose', () => {
    const error = errorWith({
      message: `No available quotes for the requested transfer ${JSON.stringify(reasons)}`,
    })
    expect(unavailableRoutesFromError(error)).toEqual(reasons)
  })

  it('accepts a payload carrying only failed routes', () => {
    const failedOnly = { failed: [{ overallPath: 'p', subpaths: {} }] }
    expect(
      unavailableRoutesFromError(errorWith({ errors: failedOnly }))
    ).toEqual(failedOnly)
  })

  // Without diagnostics the caller must rethrow, so the error state and its
  // retry affordance stand. Anything unreadable has to read as "nothing here".
  it.each([
    ['no cause', {}],
    ['no body', { cause: {} }],
    ['prose only', errorWith({ message: 'No available quotes' })],
    ['unparseable braces', errorWith({ message: 'oops {not json' })],
    ['json of the wrong shape', errorWith({ message: '{"code":1002}' })],
    ['errors of the wrong shape', errorWith({ errors: { nope: true } })],
    ['a null body', errorWith(null)],
    ['a string body', errorWith('nope')],
    ['undefined', undefined],
  ])('returns nothing for %s', (_label, error) => {
    expect(unavailableRoutesFromError(error)).toBeUndefined()
  })
})
