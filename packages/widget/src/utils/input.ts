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
    // scrollWidth has different rounding than clientWidth, remove 1px for consistency
    const scrollWidth = element.scrollWidth - 1;
    if (scrollWidth <= element.clientWidth) {
      size = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  const fontSize = `${size}px`;
  element.style.fontSize = fontSize;
};
