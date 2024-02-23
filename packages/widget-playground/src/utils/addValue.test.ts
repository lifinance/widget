import { expect, test } from 'vitest';
import { addValue } from './addValue';

test.each([
  [
    'override object example 1',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['theme', 'palette', 'primary', 'main'],
    'blue',
    {
      theme: {
        palette: {
          primary: {
            main: 'blue',
          },
        },
      },
    },
  ],
  [
    'override object example 2',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['theme', 'palette'],
    {
      secondary: {
        light: 'blue',
      },
    },
    {
      theme: {
        palette: {
          secondary: {
            light: 'blue',
          },
        },
      },
    },
  ],
  [
    'object example 1',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['theme', 'palette', 'primary', 'light'],
    'blue',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
            light: 'blue',
          },
        },
      },
    },
  ],
  [
    'object example 2',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['theme', 'shape', 'borderRadius'],
    12,
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
        shape: {
          borderRadius: 12,
        },
      },
    },
  ],
  [
    'object example 3',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['variant'],
    'drawer',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
      variant: 'drawer',
    },
  ],
  [
    'object example 4',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
        },
      },
    },
    ['theme', 'palette', 'secondary', 'main'],
    'pink',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
          },
          secondary: {
            main: 'pink',
          },
        },
      },
    },
  ],
  [
    'array example 1',
    {
      a: {
        b: {
          c: {
            d: [],
          },
        },
      },
    },
    ['a', 'b', 'c', 'd', 0],
    0,
    {
      a: {
        b: {
          c: {
            d: [0],
          },
        },
      },
    },
  ],
  [
    'array example 2',
    {
      a: {
        b: {
          c: {
            d: [0, 2],
          },
        },
      },
    },
    ['a', 'b', 'c', 'd', 1],
    1,
    {
      a: {
        b: {
          c: {
            d: [0, 1],
          },
        },
      },
    },
  ],
  [
    'array example 3',
    {
      a: {
        b: {
          c: {
            d: [0, 1],
          },
        },
      },
    },
    ['a', 'b', 'c', 'd', 2],
    2,
    {
      a: {
        b: {
          c: {
            d: [0, 1, 2],
          },
        },
      },
    },
  ],
  [
    'array example 4',
    {
      a: {
        b: {
          c: {
            d: [
              [0, 1, 2],
              [3, 4, 5],
            ],
          },
        },
      },
    },
    ['a', 'b', 'c', 'd', 1, 3],
    6,
    {
      a: {
        b: {
          c: {
            d: [
              [0, 1, 2],
              [3, 4, 5, 6],
            ],
          },
        },
      },
    },
  ],
  [
    'array example 5',
    {
      a: {
        b: {
          c: {
            d: [
              [
                [0, 1, 2],
                [3, 4, 5],
              ],
              [
                [6, 7, 8],
                [9, 10, 11, 12],
              ],
            ],
          },
        },
      },
    },
    ['a', 'b', 'c', 'd', 1, 1, 2],
    13,
    {
      a: {
        b: {
          c: {
            d: [
              [
                [0, 1, 2],
                [3, 4, 5],
              ],
              [
                [6, 7, 8],
                [9, 10, 13, 12],
              ],
            ],
          },
        },
      },
    },
  ],
  [
    'object and array nesting example 1',
    {
      a: {
        b: [{ c: 'red' }, { d: 'blue' }],
      },
    },
    ['a', 'b', 1, 'e'],
    'pink',
    {
      a: {
        b: [{ c: 'red' }, { d: 'blue', e: 'pink' }],
      },
    },
  ],
  [
    'object and array nesting example 2',
    {
      a: {
        b: [{ c: 'red' }, { d: 'blue' }],
      },
    },
    ['a', 'b', 1, 'd'],
    'pink',
    {
      a: {
        b: [{ c: 'red' }, { d: 'pink' }],
      },
    },
  ],
  [
    'object and array nesting example 3',
    {
      a: {
        b: [{ c: 'red' }, { d: 'blue' }],
      },
    },
    ['a', 'b', 2, 'e'],
    'pink',
    {
      a: {
        b: [{ c: 'red' }, { d: 'blue' }, { e: 'pink' }],
      },
    },
  ],
  [
    'object and array nesting example 4',
    {
      a: {
        b: [{ c: 'red' }, { d: [0, [1, 2]] }, { e: 'pink' }],
      },
    },
    ['a', 'b', 1, 'd', 1, 2],
    'pink',
    {
      a: {
        b: [{ c: 'red' }, { d: [0, [1, 2, 'pink']] }, { e: 'pink' }],
      },
    },
  ],
  [
    'object and array nesting example 5',
    {},
    ['a', 'b', 0, 'd', 0, 0],
    'pink',
    {
      a: {
        b: [
          {
            d: [['pink']],
          },
        ],
      },
    },
  ],
])(
  'should add a value to an object at the specified path: %s',
  // @ts-ignore
  (
    _: string,
    object: any,
    path: (string | number)[],
    value: any,
    expectedObject: any,
  ) => {
    const returnValue = addValue<any>(object, path, value);

    expect(returnValue).toEqual(expectedObject);
  },
);
