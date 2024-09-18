import type { MutableRefObject } from 'react';
import { useLayoutEffect } from 'react';
import { getRelativeContainer } from '../utils/elements.js';
import { useDefaultElementId } from './useDefaultElementId.js';

// NOTE: this hook is implicitly tied to the widgets height functionality in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components defined AppContainer.ts
//   CSS changes in those components could have implications for the functionality in this hook

export const useSetContentHeight = (
  ref: MutableRefObject<HTMLElement | undefined>,
) => {
  const elementId = useDefaultElementId();
  useLayoutEffect(() => {
    const relativeContainer = getRelativeContainer(elementId);
    if (
      !relativeContainer ||
      !ref.current ||
      ref.current?.clientHeight <= relativeContainer?.clientHeight
    ) {
      return;
    }
    relativeContainer.style.minHeight = `${ref.current.clientHeight}px`;
    return () => {
      relativeContainer.style.removeProperty('min-height');
    };
  }, [elementId, ref]);
};
