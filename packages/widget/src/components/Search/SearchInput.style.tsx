import { Box, List, styled } from '@mui/material';
import { Input as InputBase } from '../../components/Input.js';

export const Input = styled(InputBase)(({ theme }) => ({
  paddingRight: theme.spacing(1.5),
}));

interface SearchStickyContainerProps {
  headerHeight: number;
}

export const searchContainerHeight = 64;

// When the widget is in Full Height mode the
export const SearchStickyContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'headerHeight',
})<SearchStickyContainerProps>(({ theme, headerHeight }) => ({
  position: 'sticky',
  top: headerHeight,
  zIndex: 1,
  height: searchContainerHeight,
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  ...(theme.header?.position === 'fixed'
    ? {
        position: 'fixed',
        minWidth: theme.breakpoints.values.xs,
        maxWidth: theme.breakpoints.values.sm,
        width: '100%',
      }
    : {}),
}));

// When in full height mode the list needs make an addition to the paddingTop of the SearchStickyContainer height
// this compensations for SearchStickyContainer being fixed position and compensates for it no long being in the document flow
export const SearchList = styled(List)(({ theme }) => ({
  paddingTop:
    theme.header?.position === 'fixed' ? `${searchContainerHeight}px` : 0,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));
