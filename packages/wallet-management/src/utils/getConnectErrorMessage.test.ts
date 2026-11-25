import { describe, expect, it } from 'vitest'
import { getConnectErrorMessage } from './getConnectErrorMessage.js'

const viemLike = (shortMessage: string, message: string) =>
  Object.assign(new Error(message), { shortMessage })

describe('getConnectErrorMessage', () => {
  it.each([
    [
      'a viem error, by its short message',
      viemLike(
        'User rejected the request.',
        'User rejected the request.\n\nDetails: MetaMask Tx Signature: User denied.\nVersion: viem@2.58.1'
      ),
      'User rejected the request.',
    ],
    ['an Error', new Error('boom'), 'boom'],
    [
      'a plain object from the Stellar kit',
      { code: -4, message: 'The user rejected this request.' },
      'The user rejected this request.',
    ],
    ['a string', 'plain text', 'plain text'],
    ['undefined', undefined, undefined],
    ['null', null, undefined],
    ['a number', 42, undefined],
    ['an empty object', {}, undefined],
    ['an Error with no message', new Error(''), undefined],
    ['a blank message', { message: '   ' }, undefined],
  ])('reads %s', (_label, input, expected) => {
    expect(getConnectErrorMessage(input)).toBe(expected)
  })
})
