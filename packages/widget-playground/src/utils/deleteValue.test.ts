import { expect, test } from 'vitest';
import { deleteValue } from './deleteValue';

test.each([
  [
    'object example 1',
    {
      theme: {
        palette: {
          primary: {
            main: 'red',
            light: 'white',
          },
        },
      },
    },
    ['theme', 'palette', 'primary', 'main'],
    {
      theme: {
        palette: {
          primary: {
            light: 'white',
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
          secondary: {},
        },
      },
    },
    ['theme', 'palette', 'primary', 'main'],
    {
      theme: {
        palette: {
          secondary: {},
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
        shape: {},
      },
    },
    ['theme', 'palette', 'primary', 'main'],
    {
      theme: {
        shape: {},
      },
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
      variant: 'drawer',
    },
    ['theme', 'palette', 'primary', 'main'],
    {
      variant: 'drawer',
    },
  ],
  [
    'object example 5',
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
    {},
  ],
  [
    'object example 6',
    {
      theme: {
        palette: {
          shape: {
            borderRadius: 12,
          },
          primary: {
            main: 'red',
          },
        },
      },
      variant: 'drawer',
    },
    ['theme', 'palette', 'primary'],
    {
      theme: {
        palette: {
          shape: {
            borderRadius: 12,
          },
        },
      },
      variant: 'drawer',
    },
  ],
  [
    'object example 7',
    {
      theme: {
        palette: {
          shape: {
            borderRadius: 12,
          },
          primary: {
            main: 'red',
          },
        },
        mode: 'dark',
      },
      variant: 'drawer',
    },
    ['theme', 'palette'],
    {
      theme: {
        mode: 'dark',
      },
      variant: 'drawer',
    },
  ],
  [
    'array example 1',
    {
      first: {
        second: [0, 1, 2],
      },
    },
    ['first', 'second', 0],
    {
      first: {
        second: [1, 2],
      },
    },
  ],
  [
    'array example 2',
    {
      first: {
        second: [0, 1, 2],
      },
    },
    ['first', 'second', 1],
    {
      first: {
        second: [0, 2],
      },
    },
  ],
  [
    'array example 3',
    {
      first: {
        second: [0, 1, 2],
      },
    },
    ['first', 'second', 2],
    {
      first: {
        second: [0, 1],
      },
    },
  ],
  [
    'array example 4',
    {
      first: {
        second: [[0, 1, 2]],
      },
    },
    ['first', 'second', 0, 0],
    {
      first: {
        second: [[1, 2]],
      },
    },
  ],
  [
    'array example 5',
    {
      first: {
        second: [[0, 1, 2]],
      },
    },
    ['first', 'second', 0, 1],
    {
      first: {
        second: [[0, 2]],
      },
    },
  ],
  [
    'array example 6',
    {
      first: {
        second: [[0, 1, 2]],
      },
    },
    ['first', 'second', 0, 2],
    {
      first: {
        second: [[0, 1]],
      },
    },
  ],
  [
    'array example 7',
    {
      first: {
        second: [0],
        third: '',
      },
    },
    ['first', 'second', 0],
    {
      first: {
        third: '',
      },
    },
  ],
  [
    'array example 8',
    {
      first: {
        second: [0],
      },
    },
    ['first', 'second', 0],
    {},
  ],
  [
    'array example 9',
    {
      first: {
        second: [[0]],
        third: '',
      },
    },
    ['first', 'second', 0, 0],
    {
      first: {
        third: '',
      },
    },
  ],
  [
    'array example 10',
    {
      first: {
        second: [[0], [1]],
        third: '',
      },
    },
    ['first', 'second', 0, 0],
    {
      first: {
        second: [[1]],
        third: '',
      },
    },
  ],
  [
    'array example 11',
    {
      first: {
        second: [[0, 2], [1]],
        third: '',
      },
    },
    ['first', 'second', 0, 0],
    {
      first: {
        second: [[2], [1]],
        third: '',
      },
    },
  ],
  [
    'array example 12',
    {
      first: {
        second: [[1, 2, 3], [0]],
        third: '',
      },
    },
    ['first', 'second', 0, 1],
    {
      first: {
        second: [[1, 3], [0]],
        third: '',
      },
    },
  ],
  [
    'array example 13',
    {
      first: {
        second: [[0], [1, 2, 3]],
        third: '',
      },
    },
    ['first', 'second', 1, 1],
    {
      first: {
        second: [[0], [1, 3]],
        third: '',
      },
    },
  ],
  [
    'array example 14',
    {
      first: {
        second: [[0], [1]],
        third: '',
      },
    },
    ['first', 'second', 0],
    {
      first: {
        second: [[1]],
        third: '',
      },
    },
  ],
  [
    'array example 15',
    {
      first: {
        second: [[0], [1], [2]],
        third: '',
      },
    },
    ['first', 'second', 1],
    {
      first: {
        second: [[0], [2]],
        third: '',
      },
    },
  ],
  [
    'array example 16',
    {
      first: {
        second: [[0]],
      },
    },
    ['first', 'second', 0, 0],
    {},
  ],
  [
    'nested arrays and objects example 1',
    {
      first: {
        second: [{ third: '', forth: [0, 1, 2] }],
      },
    },
    ['first', 'second', 0, 'forth', 1],
    {
      first: {
        second: [{ third: '', forth: [0, 2] }],
      },
    },
  ],
  [
    'nested arrays and objects example 2',
    {
      first: {
        second: [{ forth: [0] }],
      },
    },
    ['first', 'second', 0, 'forth', 0],
    {},
  ],
  [
    'nested arrays and objects example 3',
    {
      first: {
        second: [{ forth: [0] }],
      },
    },
    ['first', 'second', 0, 'forth'],
    {},
  ],
  [
    'nested arrays and objects example 4',
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [
              { ninth: [0, 1, 2] },
              { tenth: [3, 4, 5] },
              { eleventh: [6, 7, 8] },
            ],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
    ['first', 'second', 1, 'sixth', 1, 'tenth', 0],
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [
              { ninth: [0, 1, 2] },
              { tenth: [4, 5] },
              { eleventh: [6, 7, 8] },
            ],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
  ],
  [
    'nested arrays and objects example 5',
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [
              { ninth: [0, 1, 2] },
              { tenth: [0] },
              { eleventh: [6, 7, 8] },
            ],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
    ['first', 'second', 1, 'sixth', 1, 'tenth'],
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [{ ninth: [0, 1, 2] }, { eleventh: [6, 7, 8] }],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
  ],
  [
    'nested arrays and objects example 6',
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [
              { ninth: [0, 1, 2] },
              { tenth: [0] },
              { eleventh: [6, 7, 8] },
            ],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
    ['first', 'second', 1, 'sixth', 1, 'tenth', 0],
    {
      first: {
        second: [
          { third: '', forth: [0, 2] },
          {
            fifth: '',
            sixth: [{ ninth: [0, 1, 2] }, { eleventh: [6, 7, 8] }],
          },
          { seventh: '', eigth: [0, 2] },
        ],
      },
    },
  ],
  [
    'nested arrays and objects example 7',
    {
      first: {
        second: [
          {
            sixth: [{ tenth: [0] }],
          },
        ],
      },
    },
    ['first', 'second', 0, 'sixth', 0, 'tenth', 0],
    {},
  ],
])(
  'should remove any empty objects or arrays in the tree of the removed path: %s',
  // @ts-ignore
  (
    _: string,
    object: any,
    deletionPath: (string | number)[],
    expectedObject: any,
  ) => {
    const returnValue = deleteValue<any>(object, deletionPath);

    expect(returnValue).toEqual(expectedObject);
  },
);
