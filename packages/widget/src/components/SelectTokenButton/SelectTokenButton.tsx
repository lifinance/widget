import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Avatar, CardHeader, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { routes } from '../../utils/routes';
import { SwapInput } from '../SwapInput';
import { Card } from './SelectTokenButton.style';
import { SelectTokenButtonProps } from './types';

export const SelectTokenButton: React.FC<SelectTokenButtonProps> = ({
  onClick,
  formType,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { chain } = useChain(chainId);
  const { token } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(formType === 'from' ? routes.fromToken : routes.toToken);
  };

  const isSelected = chain && token;

  return (
    <>
      <Card onClick={handleClick} elevation={0}>
        <Typography variant="body2" fontWeight="bold" pt={2} pl={2}>
          {t(`swap.${formType}`)}
        </Typography>
        <CardHeader
          avatar={
            isSelected ? (
              <Avatar src={token.logoURI} alt={token.symbol}>
                {token.symbol[0]}
              </Avatar>
            ) : null
          }
          action={<KeyboardArrowRightIcon />}
          title={isSelected ? token.symbol : t(`swap.selectChainAndToken`)}
          subheader={isSelected ? `on ${chain.name}` : null}
          titleTypographyProps={
            !isSelected
              ? {
                  variant: 'body1',
                  color: isSelected ? 'text.primary' : 'text.secondary',
                }
              : undefined
          }
        />
      </Card>
      {isSelected && formType === 'from' ? (
        <SwapInput formType={formType} />
      ) : null}
    </>
  );
};
