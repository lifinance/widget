import type { ExtendedChain } from '@lifi/sdk';
import { Avatar, Box, List, ListItemAvatar } from '@mui/material';
import { type FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { PageContainer } from '../../components/PageContainer.js';
import { SearchInput } from '../../components/SearchInput/SearchInput.js';
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import type { SelectChainPageProps } from './types.js';

export const SelectChainPage: React.FC<SelectChainPageProps> = ({
  formType,
  selectNativeToken,
}) => {
  const { navigateBack } = useNavigateBack();
  const { chains, setCurrentChain } = useChainSelect(formType);
  const selectToken = useTokenSelect(formType, navigateBack);

  const { t } = useTranslation();

  useHeader(t('header.selectChain'));

  const handleClick = async (chain: ExtendedChain) => {
    if (selectNativeToken) {
      selectToken(chain.nativeToken.address, chain.id);
    } else {
      setCurrentChain(chain.id);
      navigateBack();
    }
  };

  const [filterChains, setFilterChains] = useState<ExtendedChain[]>(
    chains ?? [],
  );

  // TODO: no matches
  // TODO: set the pages minimum height?
  // TODO: try doing this with the header in mind - setting the headers children?
  //   this may also need to change the header adjustment code

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setFilterChains(chains ?? []);
    } else {
      setFilterChains(
        chains
          ? chains.filter((chain) =>
              chain.name.toLowerCase().includes(value.toLowerCase()),
            )
          : [], // TODO: display for no matches
      );
    }
  };

  return (
    <PageContainer
      disableGutters
      id="chains-page"
      // sx={{ minHeight: 686 - 108 }} // TODO: need to establish min height, might be a way to do this with header height
    >
      {/*TODO: sticky won't work in full height mode - needs a work around*/}
      <Box sx={{ position: 'sticky', top: 108, zIndex: 1 }}>
        <SearchInput onChange={handleSearchInputChange} />
      </Box>
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {filterChains?.map((chain) => (
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
