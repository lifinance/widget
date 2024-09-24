import { useLayoutEffect, useState } from 'react';
import { useDefaultElementId } from '../hooks/useDefaultElementId.js';
import { getHeaderElement } from '../utils/elements.js';

// We use fixed position on the header when Widget is in Full Height layout.
// We do this to get it to work like the sticky header does in the other layout modes.
// As the header is position fixed its not in the document flow anymore.
// To prevent the remaining page content from appearing behind the header we need to
// pass the headers height so that the position of the page content can be adjusted
export const useHeaderHeight = () => {
  const elementId = useDefaultElementId();
  const headerElement = getHeaderElement(elementId);
  const [headerHeight, setHeaderHeight] = useState(
    headerElement?.getBoundingClientRect().height ?? 0,
  );

  useLayoutEffect(() => {
    const handleHeaderResize = () => {
      const height = headerElement?.getBoundingClientRect().height;

      if (height) {
        setHeaderHeight(height);
      }
    };

    let resizeObserver: ResizeObserver;
    if (headerElement) {
      resizeObserver = new ResizeObserver(handleHeaderResize);
      resizeObserver.observe(headerElement);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [elementId, headerHeight, headerElement, setHeaderHeight]);

  return {
    headerHeight,
  };
};
