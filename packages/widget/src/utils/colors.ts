import type { Theme } from '@mui/material';
import { alpha, decomposeColor, recomposeColor } from '@mui/material';

export const getContrastAlphaColor = (theme: Theme, value: number) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.common.black, value)
    : alpha(theme.palette.common.white, value);

export const getWarningBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.warning.main, 0.32)
    : alpha(theme.palette.warning.main, 0.16);

export const getInfoBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.info.main, 0.12)
    : alpha(theme.palette.info.main, 0.16);

export const getCardFieldsetBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.common.black, 0.04)
    : theme.palette.grey[800];

/**
 * https://github.com/mui/material-ui/blob/next/packages/mui-system/src/colorManipulator/colorManipulator.js
 * Blend a transparent overlay color with a background color, resulting in a single
 * RGB color.
 * Remove in favor of MUI one once the next major version is released.
 * @param {string} background - CSS color
 * @param {string} overlay - CSS color
 * @param {number} opacity - Opacity multiplier in the range 0 - 1
 * @param {number} [gamma=1.0] - Gamma correction factor. For gamma-correct blending, 2.2 is usual.
 */
export function blend(
  background: string,
  overlay: string,
  opacity: number,
  gamma: number = 1.0,
) {
  const blendChannel = (b: number, o: number) =>
    Math.round(
      (b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma,
    );

  const backgroundColor = decomposeColor(background);
  const overlayColor = decomposeColor(overlay);

  const rgb: [number, number, number] = [
    blendChannel(backgroundColor.values[0], overlayColor.values[0]),
    blendChannel(backgroundColor.values[1], overlayColor.values[1]),
    blendChannel(backgroundColor.values[2], overlayColor.values[2]),
  ];

  return recomposeColor({
    type: 'rgb',
    values: rgb,
  });
}
