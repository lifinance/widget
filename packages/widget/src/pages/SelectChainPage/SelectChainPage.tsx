import type { ExtendedChain } from '@lifi/sdk';
import { Avatar, List, ListItemAvatar } from '@mui/material';
import { useHeaderTitle } from '../../stores/header/useHeaderStore.js';
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { PageContainer } from '../../components/PageContainer.js';
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import type { SelectChainPageProps } from './types.js';
import { useTranslation } from 'react-i18next';

export const SelectChainPage: React.FC<SelectChainPageProps> = ({
  formType,
  selectNativeToken,
}) => {
  const { navigateBack } = useNavigateBack();
  const { chains, setCurrentChain } = useChainSelect(formType);
  const selectToken = useTokenSelect(formType, navigateBack);

  const { t } = useTranslation();
  useHeaderTitle({ title: t('header.selectChain') });

  const handleClick = async (chain: ExtendedChain) => {
    if (selectNativeToken) {
      selectToken(chain.nativeToken.address, chain.id);
    } else {
      setCurrentChain(chain.id);
      navigateBack();
    }
  };

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {chains?.map((chain) => (
          <ListItemButton key={chain.id} onClick={() => handleClick(chain)}>
            <ListItemAvatar>
              <Avatar src={chain.logoURI} alt={chain.name}>
                {chain.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={chain.name} />
          </ListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
