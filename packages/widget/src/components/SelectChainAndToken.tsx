import type { BoxProps, Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { ReverseTokensButton } from '../components/ReverseTokensButton';
import { SelectTokenButton } from '../components/SelectTokenButton';
import { SwapFormKey, useWidgetConfig } from '../providers';
import { DisabledUI, HiddenUI } from '../types';

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const { disabledUI, hiddenUI, variant } = useWidgetConfig();
  const [fromChain, toChain, fromToken, toToken] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToToken,
    ],
  });

  const hiddenReverse =
    variant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ToToken);

  const hiddenToToken =
    variant === 'nft' || hiddenUI?.includes(HiddenUI.ToToken);

  const isCompact =
    fromChain &&
    toChain &&
    fromToken &&
    toToken &&
    !prefersNarrowView &&
    !hiddenToToken;
  return (
    <Box
      sx={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column' }}
      {...props}
    >
      <SelectTokenButton formType="from" compact={isCompact} />
      {!hiddenToToken ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          m={!hiddenReverse ? -1.125 : 1}
        >
          {!hiddenReverse ? (
            <ReverseTokensButton vertical={!isCompact} />
          ) : null}
        </Box>
      ) : null}
      {!hiddenToToken ? (
        <SelectTokenButton formType="to" compact={isCompact} />
      ) : null}
    </Box>
  );
};
