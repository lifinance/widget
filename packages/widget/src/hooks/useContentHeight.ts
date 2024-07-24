import type { MutableRefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { ElementId, createElementId } from '../utils/elements.js';
import { useDefaultElementId } from './useDefaultElementId.js';
import { getScrollableContainer } from './useScrollableContainer.js';

const getContentHeight = (
  elementId: string,
  listParentRef: MutableRefObject<HTMLUListElement | null>,
) => {
  const containerElement = document.getElementById(
    createElementId(ElementId.ScrollableContainer, elementId),
  );

  const listParentElement = listParentRef?.current;

  let oldHeight;

  // This covers the case where in full height flex mode when the browser height is reduced
  // - this allows the virtualised token list can be made smaller
  if (listParentElement) {
    oldHeight = listParentElement.style.height;
    listParentElement.style.height = '0';
  }

  const headerElement = document.getElementById(
    createElementId(ElementId.Header, elementId),
  );
  if (!containerElement || !headerElement) {
    console.warn(
      `Can't find ${ElementId.ScrollableContainer} or ${ElementId.Header} id.`,
    );
    return 0;
  }
  const { height: containerHeight } = containerElement.getBoundingClientRect();
  const { height: headerHeight } = headerElement.getBoundingClientRect();

  // This covers the case where in full height flex mode when the browser height is reduced the
  // - this allows the virtualised token list tobe set to minimum size
  if (listParentElement && oldHeight) {
    listParentElement.style.height = oldHeight;
  }

  return containerHeight - headerHeight;
};

interface UseContentHeightProps {
  listParentRef: MutableRefObject<HTMLUListElement | null>;
}

export const useContentHeight = ({ listParentRef }: UseContentHeightProps) => {
  const elementId = useDefaultElementId();
  const [contentHeight, setContentHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const handleResize = () => {
      setContentHeight(getContentHeight(elementId, listParentRef));
    };

    setContentHeight(getContentHeight(elementId, listParentRef));

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elementId, listParentRef]);

  return contentHeight;
};

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
