import type { MutableRefObject } from 'react';
import { useLayoutEffect } from 'react';
import { getRelativeContainer } from '../utils/elements.js';
import { useDefaultElementId } from './useDefaultElementId.js';

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
