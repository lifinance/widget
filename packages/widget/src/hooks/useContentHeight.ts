import { useState } from 'react';
import { ElementId } from '../utils/elements';

export const useContentHeight = () => {
  const [contentHeight] = useState<number>(() => {
    const headerElement = document.getElementById(ElementId.Header);
    const containerElement = document.getElementById(
      ElementId.ScrollableContainer,
    );
    if (!containerElement || !headerElement) {
      throw Error(
        `Can't find ${ElementId.ScrollableContainer} or ${ElementId.Header} id.`,
      );
    }
    const { height: containerHeight } =
      containerElement.getBoundingClientRect();
    const { height: headerHeight } = headerElement.getBoundingClientRect();
    return containerHeight - headerHeight;
  });
  return contentHeight;
};
