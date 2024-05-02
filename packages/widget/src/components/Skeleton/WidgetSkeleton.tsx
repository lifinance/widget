import { Box, Skeleton, useMediaQuery, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import type { WidgetConfig } from '../../types/widget.js';
import { AppExpandedContainer, FlexContainer } from '../AppContainer.js';
import { createTheme } from '../../themes/createTheme.js';
import {
  SkeletonCard,
  SkeletonCardRow,
  SkeletonHeaderAppBar,
  SkeletonHeaderContainer,
  SkeletonInputCard,
  SkeletonRelativeContainer,
  SkeletonReviewButton,
  SkeletonSendToWalletButton,
  SkeletonWalletMenuButtonContainer,
} from './WidgetSkeleton.style.js';

const SkeletonIcon = () => (
  <Skeleton width={24} height={24} variant="rounded" />
);
const SkeletonWalletMenuButton = () => (
  <SkeletonWalletMenuButtonContainer>
    <Skeleton width={98} height={19} variant="text" />
    <SkeletonIcon />
  </SkeletonWalletMenuButtonContainer>
);

interface SkeletonSelectCardProps {
  titleWidth?: number;
  placeholderWidth?: number;
}
const SkeletonSelectCard = ({
  titleWidth = 36,
  placeholderWidth = 195,
}: SkeletonSelectCardProps) => (
  <SkeletonCard elevation={0}>
    <Skeleton width={titleWidth} height={22} variant="text" />
    <SkeletonCardRow>
      <Skeleton width={40} height={40} variant="circular" />
      <Skeleton width={placeholderWidth} height={27} variant="text" />
    </SkeletonCardRow>
  </SkeletonCard>
);

const SkeletonYouPayCard = () => (
  <SkeletonInputCard elevation={0}>
    <Skeleton width={55} height={22} variant="text" />
    <SkeletonCardRow>
      <Skeleton width={40} height={40} variant="circular" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: 40,
          overflowY: 'hidden',
        }}
      >
        <Skeleton
          width={16}
          height={37}
          variant="text"
          sx={{ marginTop: -0.75 }}
        />
        <Skeleton width={30} height={12} variant="text" />
      </Box>
    </SkeletonCardRow>
  </SkeletonInputCard>
);

interface WidgetSkeletonProps {
  config: Partial<WidgetConfig>;
}

export const WidgetSkeleton = ({ config }: WidgetSkeletonProps) => {
  const { appearance, hiddenUI, requiredUI, subvariant } = config;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const appearanceMode =
    !appearance || appearance === 'auto'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : appearance;

  const theme = useMemo(
    () => createTheme(appearanceMode, config.theme),
    [appearanceMode, config.theme],
  );

  return (
    <ThemeProvider theme={theme}>
      <AppExpandedContainer>
        <SkeletonRelativeContainer>
          <SkeletonHeaderContainer>
            {!hiddenUI?.includes('walletMenu') ? (
              <SkeletonHeaderAppBar>
                <SkeletonWalletMenuButton />
              </SkeletonHeaderAppBar>
            ) : null}
            <SkeletonHeaderAppBar
              sx={{ justifyContent: 'space-between', height: 40 }}
            >
              <Skeleton
                width={subvariant === 'refuel' ? 42 : 126}
                height={34}
                variant="text"
              />
              <SkeletonIcon />
            </SkeletonHeaderAppBar>
          </SkeletonHeaderContainer>
          <FlexContainer sx={{ gap: 2 }}>
            <SkeletonSelectCard />
            <SkeletonSelectCard titleWidth={18} />
            <SkeletonYouPayCard />
            {requiredUI?.includes('toAddress') ? (
              <SkeletonSelectCard titleWidth={104} placeholderWidth={175} />
            ) : null}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                marginBottom: hiddenUI?.includes('poweredBy') ? 3 : 0,
              }}
            >
              <SkeletonReviewButton variant="contained" fullWidth>
                &nbsp;
              </SkeletonReviewButton>
              {!requiredUI?.includes('toAddress') ? (
                <SkeletonSendToWalletButton variant="text" fullWidth>
                  &nbsp;
                </SkeletonSendToWalletButton>
              ) : null}
            </Box>
            {!hiddenUI?.includes('poweredBy') ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: 2,
                }}
              >
                <Skeleton width={96} height={18} variant="text" />
              </Box>
            ) : null}
          </FlexContainer>
        </SkeletonRelativeContainer>
      </AppExpandedContainer>
    </ThemeProvider>
  );
};
