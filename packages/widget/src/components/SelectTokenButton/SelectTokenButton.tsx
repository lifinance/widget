import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { Avatar, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { routes } from '../../utils/routes';
import { CardContainer } from '../CardContainer';
import { Card, CardHeader } from './SelectTokenButton.style';

export const SelectTokenButton: React.FC<SwapFormTypeProps> = ({
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

  const isSelected = !!(chain && token);

  return (
    <CardContainer>
      <Card onClick={handleClick} elevation={0}>
        <Typography
          variant="body2"
          fontWeight="bold"
          lineHeight={1}
          pt={2}
          px={2}
        >
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
          selected={isSelected}
        />
      </Card>
      {/* {isSelected && formType === 'from' ? (
        <SwapInput formType={formType} />
      ) : null} */}
    </CardContainer>
  );
};
