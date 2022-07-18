import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Avatar, Skeleton } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { navigationRoutes } from '../../utils';
import { CardTitle } from '../Card';
import { CardContainer } from '../Card/CardContainer';
import { Card, SelectTokenCardHeader } from './SelectTokenButton.style';

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
    <CardContainer flex={1}>
      <Card onClick={handleClick} elevation={0}>
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
            avatar={
              isSelected ? (
                <Avatar src={token.logoURI} alt={token.symbol}>
                  {token.symbol[0]}
                </Avatar>
              ) : null
            }
            action={!compact ? <KeyboardArrowRightIcon /> : null}
            title={isSelected ? token.symbol : t(`swap.selectChainAndToken`)}
            subheader={isSelected ? `on ${chain.name}` : null}
            selected={isSelected}
            compact={compact}
          />
        )}
      </Card>
    </CardContainer>
  );
};
