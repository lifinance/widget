import { Box, Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import { ElementId } from '../utils/elements';

const Container = styled(MuiContainer)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'clip',
  marginRight: 0,
  [theme.breakpoints.up('xs')]: {
    maxWidth: 480,
  },
}));

const RelativeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '480px',
  background: theme.palette.common.white,
}));

const ScrollableContainer = styled(Box)({
  position: 'fixed',
  overflowY: 'scroll',
  height: '100%',
});

export const MainContainer: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <RelativeContainer>
      <ScrollableContainer id={ElementId.ScrollableContainer}>
        <Container maxWidth={false} disableGutters>
          {children}
        </Container>
      </ScrollableContainer>
    </RelativeContainer>
  );
};
