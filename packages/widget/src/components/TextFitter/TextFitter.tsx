import { useTheme } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { TextFitterProps } from './types';

const initialState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const TextFitter: React.FC<PropsWithChildren<TextFitterProps>> = ({
  children,
  width = '100%',
  height,
  maxHeight,
  preserveAspectRatio = 'xMinYMid meet',
  textStyle,
  svgStyle,
  cropTop,
  cropBottom,
  onFit,
}) => {
  const theme = useTheme();
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState<Partial<DOMRect>>(initialState);

  const [ref] = useInView({
    onChange(inView) {
      if (inView) {
        calculateBox();
      }
    },
  });

  const calculateBox = useCallback(() => {
    if (!textRef.current) {
      return;
    }
    const box = textRef.current.getBBox();
    if (cropTop) {
      box.y += box.height * cropTop;
      box.height -= box.height * cropTop;
    }
    if (cropBottom) {
      box.height -= box.height * cropBottom;
    }
    setViewBox(box);
    onFit?.();
  }, [cropBottom, cropTop, onFit]);

  useLayoutEffect(() => {
    calculateBox();
  }, [calculateBox, children]);

  useLayoutEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        calculateBox();
      });
    }
  }, [calculateBox]);

  return (
    <svg
      style={svgStyle}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      width={width}
      height={height}
      // height={
      //   textRect.height && maxHeight && textRect.height >= maxHeight
      //     ? maxHeight
      //     : height
      // }
      preserveAspectRatio={preserveAspectRatio}
      fill={theme.palette.text.primary}
      ref={ref}
    >
      <text x={0} y={0} style={textStyle} ref={textRef}>
        {children}
      </text>
    </svg>
  );
};
