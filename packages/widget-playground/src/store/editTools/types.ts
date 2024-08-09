import type { WidgetTheme } from '@lifi/widget';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { Font } from '../../providers';

type ControlType = 'design' | 'code';
type CodeControlTab = 'config' | 'examples';
export type Layout =
  | 'default'
  | 'restricted-height'
  | 'restricted-max-height'
  | 'full-height';

export type ThemeAppearances =
  | {
      light: WidgetTheme;
    }
  | {
      dark: WidgetTheme;
    }
  | {
      light: WidgetTheme;
      dark: WidgetTheme;
    };

interface ThemeAppearancesIndexable {
  [key: string]: WidgetTheme;
}

export interface ThemeItem {
  id: string;
  name: string;
  theme: ThemeAppearances & ThemeAppearancesIndexable;
}
export interface EditToolsValues {
  drawer: {
    open: boolean;
    visibleControls: ControlType;
    codeDrawerWidth: number;
  };
  codeControl: {
    openTab: CodeControlTab;
  };
  fontControl: {
    selectedFont: Font | undefined; // move to config
  };
  playgroundSettings: {
    viewportColor?: string | undefined;
  };
  skeletonControl: {
    show: boolean;
    sideBySide: boolean;
  };
  headerAndFooterControl: {
    showMockHeader: boolean;
    showMockFooter: boolean;
    isFooterFixed: boolean;
  };
  layoutControl: {
    selectedLayoutId: Layout;
  };
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
  setCodeDrawerWidth: (width: number) => void;
  setVisibleControls: (controls: ControlType) => void;
  setCodeControlTab: (tab: CodeControlTab) => void;
  resetEditTools: () => void;
  setSelectedFont: (font: Font) => void;
  setViewportBackgroundColor: (color: string | undefined) => void;
  setSkeletonShow: (show: boolean) => void;
  setSkeletonSideBySide: (sideBySide: boolean) => void;
  setHeaderShow: (show: boolean) => void;
  setFooterShow: (show: boolean) => void;
  setFooterFixed: (isFixed: boolean) => void;
  setSelectedLayoutId: (layoutId: Layout) => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
