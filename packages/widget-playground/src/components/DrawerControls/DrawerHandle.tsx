import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import {
  defaultDrawerWidth,
  useDrawerToolValues,
  useEditToolsActions,
} from '../../store';
import { DrawerHandleButton } from './DrawerControls.style';

export const DrawerHandle = () => {
  const [isDrawerResizing, setIsDrawerResizing] = useState(false);
  const [drawResizeStartX, setDrawResizeStartX] = useState(0);

  const { isDrawerOpen, drawerWidth, visibleControls, codeControlTab } =
    useDrawerToolValues();
  const { setCodeDrawerWidth } = useEditToolsActions();

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

      setCodeDrawerWidth(
        newDrawerWidth >= defaultDrawerWidth
          ? drawResizeStartX + (e.clientX - drawResizeStartX)
          : defaultDrawerWidth,
      );
    };
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', drawerHandleOnMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', drawerHandleOnMouseUp);
    };
  }, [isDrawerResizing, drawResizeStartX, setCodeDrawerWidth]);

  return visibleControls === 'code' &&
    codeControlTab === 'config' &&
    isDrawerOpen ? (
    <DrawerHandleButton
      onMouseDown={drawerHandleOnMouseDown}
      sx={{
        width: isDrawerResizing ? 400 : 16,
        left: isDrawerResizing ? drawerWidth - 200 : drawerWidth,
      }}
    />
  ) : null;
};
