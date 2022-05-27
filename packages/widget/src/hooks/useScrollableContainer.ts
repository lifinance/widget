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
