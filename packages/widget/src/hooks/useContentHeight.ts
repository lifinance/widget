import { useLayoutEffect, useState } from 'react';
import { ElementId } from '../utils/elements';

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
