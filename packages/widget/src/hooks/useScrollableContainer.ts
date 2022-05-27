import { useLayoutEffect, useState } from 'react';
import { ElementId } from '../utils/elements';

export const useScrollableContainer = () => {
  const [containerElement, setContainerElement] = useState(() =>
    document.getElementById(ElementId.ScrollableContainer),
  );

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(
        document.getElementById(ElementId.ScrollableContainer),
      );
    }
  }, [containerElement]);

  return containerElement;
};

export const useScrollableOverflowHidden = () => {
  useLayoutEffect(() => {
    const element = document.getElementById(ElementId.ScrollableContainer);
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
