import type { MutableRefObject } from 'react';
import { useLayoutEffect } from 'react';
import { useDefaultElementId } from './useDefaultElementId.js';
import { getScrollableContainer } from './useScrollableContainer.js';

export const useSetContentHeight = (
  ref: MutableRefObject<HTMLElement | undefined>,
) => {
  const elementId = useDefaultElementId();
  useLayoutEffect(() => {
    const scrollableContainer = getScrollableContainer(elementId);
    if (
      !scrollableContainer ||
      !ref.current ||
      ref.current?.clientHeight <= scrollableContainer?.clientHeight
    ) {
      return;
    }
    scrollableContainer.style.height = `${ref.current.clientHeight}px`;
    return () => {
      scrollableContainer.style.removeProperty('height');
    };
  }, [elementId, ref]);
};
