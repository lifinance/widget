import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks/useChain.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import { useToken } from '../../hooks/useToken.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { Card } from '../Card/Card.js';
import { CardTitle } from '../Card/CardTitle.js';
import {
  TokenAvatar,
  TokenAvatarDefault,
  TokenAvatarSkeleton,
} from '../TokenAvatar/TokenAvatar.js';
import { SelectTokenCardHeader } from './SelectTokenButton.style.js';

export const SelectTokenButton: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, subvariant } = useWidgetConfig();
  const swapOnly = useSwapOnly();
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    tokenKey,
  );
  const { chain, isLoading: isChainLoading } = useChain(chainId);
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(
      formType === 'from'
        ? navigationRoutes.fromToken
        : subvariant === 'refuel'
          ? navigationRoutes.toTokenNative
          : navigationRoutes.toToken,
    );
  };

  const isSelected = !!(chain && token);
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
  const defaultPlaceholder =
    formType === 'to' && subvariant === 'refuel'
      ? t('main.selectChain')
      : formType === 'to' && swapOnly
        ? t('main.selectToken')
        : t('main.selectChainAndToken');
  const cardTitle: string =
    formType === 'from' && subvariant === 'nft'
      ? t(`header.payWith`)
      : t(`main.${formType}`);
  return (
    <Card flex={1} onClick={onClick}>
      <CardTitle>{cardTitle}</CardTitle>
      {chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (
        <SelectTokenCardHeader
          avatar={<TokenAvatarSkeleton />}
          title={<Skeleton variant="text" width={64} height={24} />}
          subheader={<Skeleton variant="text" width={72} height={16} />}
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
          titleTypographyProps={{
            title: isSelected ? token.symbol : defaultPlaceholder,
          }}
          subheader={isSelected ? chain.name : null}
          subheaderTypographyProps={
            isSelected
              ? {
                  title: chain.name,
                }
              : undefined
          }
          selected={isSelected}
          compact={compact}
        />
      )}
    </Card>
  );
};
