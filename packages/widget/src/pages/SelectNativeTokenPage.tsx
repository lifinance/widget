import { List, ListItemAvatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TokenAvatar } from '../components/Avatar/TokenAvatar.js';
import { ListItemButton } from '../components/ListItemButton.js';
import { ListItemText } from '../components/ListItemText.js';
import { PageContainer } from '../components/PageContainer.js';
import { useTokenSelect } from '../components/TokenList/useTokenSelect.js';
import { useChains } from '../hooks/useChains.js';
import { useNavigateBack } from '../hooks/useNavigateBack.js';
import type { FormTypeProps } from '../stores/form/types.js';

export const SelectNativeTokenPage: React.FC<FormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { chains } = useChains();
  const selectToken = useTokenSelect(formType, navigateBack);

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
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
              secondary={t('main.onChain', { chainName: chain.name })}
            />
          </ListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
