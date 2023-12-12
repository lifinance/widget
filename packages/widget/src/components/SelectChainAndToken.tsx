import type { BoxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReverseTokensButton } from '../components/ReverseTokensButton';
import { SelectTokenButton } from '../components/SelectTokenButton';
import { useWidgetConfig } from '../providers';
import { DisabledUI, HiddenUI } from '../types';
import { useFieldValues } from '../stores/form';

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const { disabledUI, hiddenUI, subvariant } = useWidgetConfig();

  const [fromChain, toChain, fromToken, toToken] = useFieldValues(
    'fromChain',
    'toChain',
    'fromToken',
    'toToken',
  );

  const hiddenReverse =
    subvariant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ToToken);

  const hiddenToToken =
    subvariant === 'nft' || hiddenUI?.includes(HiddenUI.ToToken);

  const isCompact =
    !!fromChain &&
    !!toChain &&
    !!fromToken &&
    !!toToken &&
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
