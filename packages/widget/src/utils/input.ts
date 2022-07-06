export const fitInputText = (
  maxFontSize: number,
  minFontSize: number,
  element: HTMLElement,
) => {
  if (!element) {
    return;
  }
  let high = maxFontSize;
  let low = minFontSize;
  let size = minFontSize;
  let mid = 0;
  // Binary search for highest font size best fit
  while (low <= high) {
    mid = (high + low) >> 1;
    const fontSize = `${mid + 1}px`;
    element.style.fontSize = fontSize;
    if (element.scrollWidth <= element.clientWidth) {
      size = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  const fontSize = `${size}px`;
  element.style.fontSize = fontSize;
};
