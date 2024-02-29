import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { DrawerHandleButton } from './DrawerControls.style';
import {
  defaultDrawerWidth,
  useEditToolsValues,
  useEditToolsActions,
} from '../../store';

export const DrawerHandle = () => {
  const [isDrawerResizing, setIsDrawerResizing] = useState(false);
  const [drawResizeStartX, setDrawResizeStartX] = useState(0);

  const { isDrawerOpen, visibleControls, codeDrawerWidth } =
    useEditToolsValues();
  const { setCodeDrawerWidth } = useEditToolsActions();

  const drawerWidth =
    visibleControls === 'code' ? codeDrawerWidth : defaultDrawerWidth;

  const drawerHandleOnMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsDrawerResizing(true);
    setDrawResizeStartX(e.clientX);
  };

  const drawerHandleOnMouseUp = () => {
    setIsDrawerResizing(false);
    setDrawResizeStartX(0);
  };

  useEffect(() => {
    const handleMousemove = (e: MouseEvent) => {
      if (!isDrawerResizing) {
        return;
      }

      const newDrawerWidth = drawResizeStartX + (e.clientX - drawResizeStartX);
      if (newDrawerWidth >= defaultDrawerWidth) {
        setCodeDrawerWidth(drawResizeStartX + (e.clientX - drawResizeStartX));
      }
    };
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', drawerHandleOnMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', drawerHandleOnMouseUp);
    };
  }, [isDrawerResizing, drawResizeStartX, setCodeDrawerWidth]);

  return visibleControls === 'code' && isDrawerOpen ? (
    <DrawerHandleButton
      drawerWidth={drawerWidth}
      onMouseDown={drawerHandleOnMouseDown}
    />
  ) : null;
};
