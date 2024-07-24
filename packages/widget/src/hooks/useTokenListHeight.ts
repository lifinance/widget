import type { MutableRefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { ElementId, createElementId } from '../utils/elements.js';
import { useDefaultElementId } from './useDefaultElementId.js';

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
  // - this allows the virtualised token list to be made smaller
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
  // - this allows the virtualised token list to be set to minimum size
  if (listParentElement && oldHeight) {
    listParentElement.style.height = oldHeight;
  }

  return containerHeight - headerHeight;
};

interface UseContentHeightProps {
  listParentRef: MutableRefObject<HTMLUListElement | null>;
  headerRef: MutableRefObject<HTMLElement | null>;
}

const minTokenListHeight = 360;

export const useTokenListHeight = ({
  listParentRef,
  headerRef,
}: UseContentHeightProps) => {
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

  return Math.max(
    contentHeight - (headerRef.current?.offsetHeight ?? 0),
    minTokenListHeight,
  );
};
