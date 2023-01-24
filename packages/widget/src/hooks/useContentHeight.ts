/* eslint-disable consistent-return */
import type { MutableRefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { createElementId, ElementId } from '../utils';
import { useDefaultElementId } from './useDefaultElementId';
import { getScrollableContainer } from './useScrollableContainer';

const getContentHeight = (elementId: string) => {
  const headerElement = document.getElementById(
    createElementId(ElementId.Header, elementId),
  );
  const containerElement = document.getElementById(
    createElementId(ElementId.ScrollableContainer, elementId),
  );
  if (!containerElement || !headerElement) {
    console.warn(
      `Can't find ${ElementId.ScrollableContainer} or ${ElementId.Header} id.`,
    );
    return 0;
  }
  const { height: containerHeight } = containerElement.getBoundingClientRect();
  const { height: headerHeight } = headerElement.getBoundingClientRect();
  return containerHeight - headerHeight;
};

export const useContentHeight = () => {
  const elementId = useDefaultElementId();
  const [contentHeight, setContentHeight] = useState<number>(() =>
    getContentHeight(elementId),
  );
  useLayoutEffect(() => {
    if (!contentHeight) {
      setContentHeight(getContentHeight(elementId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
