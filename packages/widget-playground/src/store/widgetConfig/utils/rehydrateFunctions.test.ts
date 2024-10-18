import { describe, expect, test } from 'vitest'
import { rehydrateFunctions } from './rehydrateFunctions'

const elseFunc = () => {}
const moreFunc = () => {}
const againAgainFunc = () => {}
const wellThenFunc = () => {}
const anotherAnotherFunc = () => {}

describe('rehydrateFunctions', () => {
  test('should restore the path locations', () => {
    const inputObj = {
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
    }
    rehydrateFunctions(inputObj, [
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

    expect(inputObj).toEqual({
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
    })
  })

  test('should create the path locations if they do not exist', () => {
    const inputObj = {}

    rehydrateFunctions(inputObj, [
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

    expect(inputObj).toEqual({
      Something: {
        else: elseFunc,
      },
      more: moreFunc,
      againAgain: [undefined, againAgainFunc],
      another: [
        undefined,
        [
          undefined,
          {
            wellThen: wellThenFunc,
          },
        ],
      ],
      anotherAnother: [
        undefined,
        [
          undefined,
          [
            undefined,
            undefined,
            {
              anotherAnother: anotherAnotherFunc,
            },
          ],
        ],
      ],
    })
  })
})
