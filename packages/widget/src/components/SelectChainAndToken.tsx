import type { BoxProps, Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { ReverseTokensButton } from '../components/ReverseTokensButton';
import { SelectTokenButton } from '../components/SelectTokenButton';
import { SwapFormKey, useWidgetConfig } from '../providers';
import { DisabledUI } from '../types';

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const { disabledUI, variant } = useWidgetConfig();
  const [fromChain, toChain, fromToken, toToken] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToToken,
    ],
  });

  const disabledReverse =
    variant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken);

  const isCompact =
    fromChain && toChain && fromToken && toToken && !prefersNarrowView;
  return (
    <Box
      sx={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column' }}
      {...props}
    >
      <SelectTokenButton formType="from" compact={isCompact} />
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        m={!disabledReverse ? -1.25 : 1}
      >
        {!disabledReverse ? (
          <ReverseTokensButton vertical={!isCompact} />
        ) : null}
      </Box>
      <SelectTokenButton formType="to" compact={isCompact} />
    </Box>
  );
};
