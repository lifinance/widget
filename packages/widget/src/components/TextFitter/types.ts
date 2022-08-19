import type { CSSProperties } from 'react';

export interface TextFitterProps {
  textStyle?: CSSProperties;
  svgStyle?: CSSProperties;
  onFit?(): void;
  maxHeight?: string | number;
  height?: string | number;
  width?: string | number;
  preserveAspectRatio?: string;
  cropTop?: number;
  cropBottom?: number;
}
