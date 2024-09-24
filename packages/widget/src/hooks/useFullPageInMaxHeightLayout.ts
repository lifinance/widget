import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { defaultMaxHeight } from '../config/constants.js';
import { getRelativeContainer } from '../utils/elements.js';
import { useDefaultElementId } from './useDefaultElementId.js';

// When the Widgets layout is set to use max height or in its default height mode the default behaviour
// is for pages to use only the minimum height that they need to show their content.
// On some pages you might want to always ensure that the page always up the maximum height available.
// To do this just add this hook at the page level.
// The other height layout will by default always occupy the maximum space available.
// NOTE: this hook is implicitly tied to the widget height functionality in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components as defined in AppContainer.ts
//   CSS changes in those components can have implications for the functionality in this hook
export const useFullPageInMaxHeightLayout = () => {
  const theme = useTheme();
  const elementId = useDefaultElementId();
  const relativeContainer = getRelativeContainer(elementId);

  // note that maxHeight mode is also used as the widgets default layout
  const isMaxHeightLayout = !theme.container?.height;

  const maxHeight = theme.container?.maxHeight || defaultMaxHeight;

  useEffect(() => {
    if (isMaxHeightLayout && relativeContainer) {
      relativeContainer.style.height = `${maxHeight}px`;
    }

    return () => {
      if (isMaxHeightLayout && relativeContainer) {
        relativeContainer.style.removeProperty('height');
      }
    };
  }, [isMaxHeightLayout, maxHeight, relativeContainer]);
};
