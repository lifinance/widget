import { describe, expect, test } from 'vitest';
import { stringifyConfig } from './stringifyConfig';

const expected = `const config = {
  walletConfig: {
    async onConnect () {}
  },
  some: {
    loose: async ()=>{}
  },
  else: {
    loose: async function() {}
  },
  components: {
    MuiCard: {
      defaultProps: {
        variant: "elevation"
      }
    },
    MuiIconButton: {
      styleOverrides: {
        somethingElse: "here",
        root: ()=>({
          backgroundColor: \`#000000\`,
          color: 'inherit',
          borderRadius: 12,
          '&:hover': {
              backgroundColor: '#ffffff',
              color: 'inherit'
          }
        })
      }
    }
  }
}`;

describe('stringifyConfig', () => {
  test('should be able to add a string representation of a function', () => {
    const config = {
      walletConfig: { async onConnect() {} },
      some: { loose: async () => {} },
      else: { loose: async function () {} },
      components: {
        MuiCard: {
          defaultProps: { variant: 'elevation' },
        },
        MuiIconButton: {
          styleOverrides: {
            somethingElse: 'here',
            root: () => ({
              backgroundColor: `#000000`,
              color: 'inherit',
              borderRadius: 12,
              '&:hover': {
                backgroundColor: '#ffffff',
                color: 'inherit',
              },
            }),
          },
        },
      },
    };

    expect(stringifyConfig(config)).toEqual(expected);
  });
});
