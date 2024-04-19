import { type Theme, Box, Skeleton, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import type { WidgetConfig, WidgetTheme } from '../../types/widget.js';
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

interface SkeletonComponentProps {
  skeletonTheme: Partial<WidgetTheme & Theme>;
}

const SkeletonIcon = () => (
  <Skeleton width={24} height={24} variant="rounded" />
);
const SkeletonWalletMenuButton = ({
  skeletonTheme,
}: SkeletonComponentProps) => (
  <SkeletonWalletMenuButtonContainer skeletonTheme={skeletonTheme}>
    <Skeleton width={98} height={19} variant="text" />
    <SkeletonIcon />
  </SkeletonWalletMenuButtonContainer>
);

interface SkeletonSelectCardProps extends SkeletonComponentProps {
  titleWidth?: number;
  placeholderWidth?: number;
}
const SkeletonSelectCard = ({
  skeletonTheme,
  titleWidth = 36,
  placeholderWidth = 195,
}: SkeletonSelectCardProps) => (
  <SkeletonCard skeletonTheme={skeletonTheme} elevation={0}>
    <Skeleton width={titleWidth} height={22} variant="text" />
    <SkeletonCardRow skeletonTheme={skeletonTheme}>
      <Skeleton width={40} height={40} variant="circular" />
      <Skeleton width={placeholderWidth} height={27} variant="text" />
    </SkeletonCardRow>
  </SkeletonCard>
);

const SkeletonYouPayCard = ({ skeletonTheme }: SkeletonComponentProps) => (
  <SkeletonInputCard skeletonTheme={skeletonTheme} elevation={0}>
    <Skeleton width={55} height={22} variant="text" />
    <SkeletonCardRow skeletonTheme={skeletonTheme}>
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
    <AppExpandedContainer>
      <SkeletonRelativeContainer skeletonTheme={theme}>
        <SkeletonHeaderContainer skeletonTheme={theme}>
          {!hiddenUI?.includes('walletMenu') ? (
            <SkeletonHeaderAppBar skeletonTheme={theme}>
              <SkeletonWalletMenuButton skeletonTheme={theme} />
            </SkeletonHeaderAppBar>
          ) : null}
          <SkeletonHeaderAppBar
            skeletonTheme={theme}
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
          <SkeletonSelectCard skeletonTheme={theme} />
          <SkeletonSelectCard skeletonTheme={theme} titleWidth={18} />
          <SkeletonYouPayCard skeletonTheme={theme} />
          {requiredUI?.includes('toAddress') ? (
            <SkeletonSelectCard
              skeletonTheme={theme}
              titleWidth={104}
              placeholderWidth={175}
            />
          ) : null}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              marginBottom: hiddenUI?.includes('poweredBy') ? 3 : 0,
            }}
          >
            <SkeletonReviewButton skeletonTheme={theme} fullWidth disabled>
              &nbsp;
            </SkeletonReviewButton>
            {!requiredUI?.includes('toAddress') ? (
              <SkeletonSendToWalletButton
                variant="text"
                skeletonTheme={theme}
                fullWidth
                disabled
              >
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
  );
};
