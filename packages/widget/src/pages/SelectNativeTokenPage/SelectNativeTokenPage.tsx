import { Container, List, ListItemAvatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { TokenAvatar } from '../../components/TokenAvatar';
import { useTokenSelect } from '../../components/TokenList';
import { useChains, useNavigateBack } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';

export const SelectNativeTokenPage: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { chains } = useChains();
  const selectToken = useTokenSelect(formType, navigateBack);

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {chains?.map((chain) => (
          <ListItemButton
            key={chain.id}
            onClick={() => selectToken(chain.nativeToken.address, chain.id)}
          >
            <ListItemAvatar>
              <TokenAvatar token={chain.nativeToken} chain={chain} />
            </ListItemAvatar>
            <ListItemText
              primary={chain.nativeToken.symbol}
              secondary={t('swap.onChain', { chainName: chain.name })}
            />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
};
