import { Skeleton } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { TokenAvatar, TokenAvatarDefault } from '../TokenAvatar';
import { SelectTokenCardHeader } from './SelectTokenButton.style';

export const SelectTokenButton: React.FC<
  SwapFormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, variant } = useWidgetConfig();
  const tokenKey = SwapFormKeyHelper.getTokenKey(formType);
  const [chainId, tokenAddress] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType), tokenKey],
  });
  const { chain, isLoading: isChainLoading } = useChain(chainId);
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(
      formType === 'from'
        ? navigationRoutes.fromToken
        : variant === 'refuel'
        ? navigationRoutes.toTokenNative
        : navigationRoutes.toToken,
    );
  };

  const isSelected = !!(chain && token);
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
  const defaultPlaceholder =
    formType === 'to' && variant === 'refuel'
      ? t(`header.selectChain`)
      : t(`swap.selectChainAndToken`);
  const cardTitle =
    formType === 'from' && variant === 'nft'
      ? t(`swap.payWith`)
      : t(`swap.${formType}`);
  return (
    <Card flex={1} onClick={onClick}>
      <CardTitle>{cardTitle}</CardTitle>
      {chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (
        <SelectTokenCardHeader
          avatar={<Skeleton variant="circular" width={32} height={32} />}
          title={<Skeleton variant="text" width={64} height={24} />}
          subheader={<Skeleton variant="text" width={64} height={16} />}
          compact={compact}
        />
      ) : (
        <SelectTokenCardHeader
          avatar={
            isSelected ? (
              <TokenAvatar token={token} chain={chain} />
            ) : (
              <TokenAvatarDefault />
            )
          }
          title={isSelected ? token.symbol : defaultPlaceholder}
          subheader={
            isSelected ? t(`swap.onChain`, { chainName: chain.name }) : null
          }
          selected={isSelected}
          compact={compact}
        />
      )}
    </Card>
  );
};
