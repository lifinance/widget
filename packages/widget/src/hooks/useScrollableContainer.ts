import { useLayoutEffect, useState } from 'react';
import { ElementId } from '../utils';

export const getScrollableContainer = () =>
  document.getElementById(ElementId.ScrollableContainer);

export const useScrollableContainer = () => {
  const [containerElement, setContainerElement] = useState(
    getScrollableContainer,
  );

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(getScrollableContainer());
    }
  }, [containerElement]);

  return containerElement;
};

export const useScrollableOverflowHidden = () => {
  useLayoutEffect(() => {
    const element = getScrollableContainer();
    if (element) {
      element.style.overflowY = 'hidden';
    }
    return () => {
      if (element) {
        element.style.overflowY = 'auto';
      }
    };
  }, []);
};
