import { describe, expect, test } from 'vitest'
import { substituteFunctions } from './substituteFunctions'

describe('substituteFunctions', () => {
  const elseFunc = () => {}
  const moreFunc = () => {}
  const againAgainFunc = () => {}
  const wellThenFunc = () => {}
  const anotherAnotherFunc = () => {}

  describe('for object substitution', () => {
    const inputObject = {
      Something: {
        else: elseFunc,
      },
      more: moreFunc,
      random: 1,
      somethingAgain: 'hello',
      againAgain: [0, againAgainFunc],
      another: [
        0,
        [
          0,
          {
            wellThen: wellThenFunc,
          },
        ],
      ],
      anotherAnother: [
        0,
        [
          0,
          [
            0,
            1,
            {
              anotherAnother: anotherAnotherFunc,
            },
          ],
        ],
      ],
    }

    test('gets the list of functions with paths and function references', () => {
      expect(substituteFunctions(inputObject)).toEqual([
        {
          path: ['more'],
          funcRef: moreFunc,
        },
        {
          path: ['Something', 'else'],
          funcRef: elseFunc,
        },
        {
          path: ['againAgain', 1],
          funcRef: againAgainFunc,
        },
        {
          path: ['another', 1, 1, 'wellThen'],
          funcRef: wellThenFunc,
        },
        {
          path: ['anotherAnother', 1, 1, 2, 'anotherAnother'],
          funcRef: anotherAnotherFunc,
        },
      ])

      expect(inputObject).toEqual({
        Something: {
          else: {},
        },
        more: {},
        random: 1,
        somethingAgain: 'hello',
        againAgain: [0, {}],
        another: [
          0,
          [
            0,
            {
              wellThen: {},
            },
          ],
        ],
        anotherAnother: [
          0,
          [
            0,
            [
              0,
              1,
              {
                anotherAnother: {},
              },
            ],
          ],
        ],
      })
    })
  })

  describe('for id substitution', () => {
    const inputObjectForIds = {
      Something: {
        else: elseFunc,
      },
      more: moreFunc,
      random: 1,
      somethingAgain: 'hello',
      againAgain: [0, againAgainFunc],
      another: [
        0,
        [
          0,
          {
            wellThen: wellThenFunc,
          },
        ],
      ],
      anotherAnother: [
        0,
        [
          0,
          [
            0,
            1,
            {
              anotherAnother: anotherAnotherFunc,
            },
          ],
        ],
      ],
    }

    test('gets the list of functions with paths, function references and ids', () => {
      expect(substituteFunctions(inputObjectForIds, 'id')).toEqual([
        {
          path: ['more'],
          funcRef: moreFunc,
          substituteId: 'substitution::id::1',
        },
        {
          path: ['Something', 'else'],
          funcRef: elseFunc,
          substituteId: 'substitution::id::2',
        },
        {
          path: ['againAgain', 1],
          funcRef: againAgainFunc,
          substituteId: 'substitution::id::3',
        },
        {
          path: ['another', 1, 1, 'wellThen'],
          funcRef: wellThenFunc,
          substituteId: 'substitution::id::4',
        },
        {
          path: ['anotherAnother', 1, 1, 2, 'anotherAnother'],
          funcRef: anotherAnotherFunc,
          substituteId: 'substitution::id::5',
        },
      ])

      expect(inputObjectForIds).toEqual({
        Something: {
          else: 'substitution::id::2',
        },
        more: 'substitution::id::1',
        random: 1,
        somethingAgain: 'hello',
        againAgain: [0, 'substitution::id::3'],
        another: [
          0,
          [
            0,
            {
              wellThen: 'substitution::id::4',
            },
          ],
        ],
        anotherAnother: [
          0,
          [
            0,
            [
              0,
              1,
              {
                anotherAnother: 'substitution::id::5',
              },
            ],
          ],
        ],
      })
    })
  })
})
