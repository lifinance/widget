import { useCallback, useLayoutEffect, useState } from 'react';
import { createElementId, ElementId } from '../utils';
import { useDefaultElementId } from './useDefaultElementId';

export const getScrollableContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.ScrollableContainer, elementId),
  );

export const useGetScrollableContainer = () => {
  const elementId = useDefaultElementId();
  const getContainer = useCallback(
    () => getScrollableContainer(elementId),
    [elementId],
  );

  return getContainer;
};

export const useScrollableContainer = (elementId: string) => {
  const [containerElement, setContainerElement] = useState(() =>
    getScrollableContainer(elementId),
  );

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(getScrollableContainer(elementId));
    }
  }, [containerElement, elementId]);

  return containerElement;
};

export const useScrollableOverflowHidden = () => {
  const elementId = useDefaultElementId();
  useLayoutEffect(() => {
    const element = getScrollableContainer(elementId);
    if (element) {
      element.style.overflowY = 'hidden';
    }
    return () => {
      if (element) {
        element.style.overflowY = 'auto';
      }
    };
  }, [elementId]);
};
