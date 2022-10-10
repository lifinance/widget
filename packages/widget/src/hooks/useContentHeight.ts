/* eslint-disable consistent-return */
import type { MutableRefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { ElementId } from '../utils';
import { getScrollableContainer } from './useScrollableContainer';

const getContentHeight = () => {
  const headerElement = document.getElementById(ElementId.Header);
  const containerElement = document.getElementById(
    ElementId.ScrollableContainer,
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
  const [contentHeight, setContentHeight] = useState<number>(getContentHeight);
  useLayoutEffect(() => {
    if (!contentHeight) {
      setContentHeight(getContentHeight());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return contentHeight;
};

export const useSetContentHeight = (
  ref: MutableRefObject<HTMLElement | undefined>,
) => {
  useLayoutEffect(() => {
    const scrollableContainer = getScrollableContainer();
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
  }, [ref]);
};
