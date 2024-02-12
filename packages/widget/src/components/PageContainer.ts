import { Container, styled } from '@mui/material';

export interface PageContainerProps {
  halfGutters?: boolean;
  topBottomGutters?: boolean;
}

export const PageContainer = styled(Container, {
  shouldForwardProp: (prop) =>
    !['halfGutters', 'topBottomGutters'].includes(prop as string),
})<PageContainerProps>(
  ({ theme, disableGutters, halfGutters, topBottomGutters }) => ({
    padding: disableGutters
      ? 0
      : theme.spacing(topBottomGutters ? 1 : 0, halfGutters ? 1.5 : 3),
  }),
);
