import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { TokenAvatar } from '../TokenAvatar';
import { SelectTokenCardHeader } from './SelectTokenButton.style';

export const SelectTokenButton: React.FC<
  SwapFormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { chain, isLoading: isChainLoading } = useChain(chainId);
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(
      formType === 'from'
        ? navigationRoutes.fromToken
        : navigationRoutes.toToken,
    );
  };

  const isSelected = !!(chain && token);

  return (
    <Card flex={1} onClick={handleClick}>
      <CardTitle>{t(`swap.${formType}`)}</CardTitle>
      {chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (
        <SelectTokenCardHeader
          avatar={<Skeleton variant="circular" width={32} height={32} />}
          title={<Skeleton variant="text" width={64} height={24} />}
          subheader={<Skeleton variant="text" width={64} height={16} />}
          compact={compact}
        />
      ) : (
        <SelectTokenCardHeader
          avatar={isSelected ? <TokenAvatar token={token} /> : null}
          action={!compact ? <KeyboardArrowRightIcon /> : null}
          title={isSelected ? token.symbol : t(`swap.selectChainAndToken`)}
          subheader={isSelected ? `on ${chain.name}` : null}
          selected={isSelected}
          compact={compact}
        />
      )}
    </Card>
  );
};
