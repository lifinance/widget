import { SwapFormKey } from '@lifinance/widget/providers/SwapFormProvider';
import { Box, BoxProps, Theme, useMediaQuery } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { ReverseTokensButton } from '../components/ReverseTokensButton';
import { SelectTokenButton } from '../components/SelectTokenButton';

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const [fromChain, toChain, fromToken, toToken] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToToken,
    ],
  });
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
        m={-1.125}
      >
        <ReverseTokensButton vertical={!isCompact} />
      </Box>
      <SelectTokenButton formType="to" compact={isCompact} />
    </Box>
  );
};
