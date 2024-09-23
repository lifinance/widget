import type { ExtendedChain } from '@lifi/sdk';
import { Avatar, debounce, ListItemAvatar } from '@mui/material';
import { type FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { PageContainer } from '../../components/PageContainer.js';
import { StickySearchInput } from '../../components/Search/SearchInput.js';
import { SearchList } from '../../components/Search/SearchInput.style.js';
import { SearchNotFound } from '../../components/Search/SearchNotFound.js';
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js';
import { useFullPageAtMaxHeight } from '../../hooks/useFullPageAtMaxHeight.js';
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

  useFullPageAtMaxHeight();

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
          : [],
      );
    }
  };

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250);

  return (
    <PageContainer disableGutters>
      <StickySearchInput
        onChange={debouncedSearchInputChange}
        placeholder={t('main.chainSearch')}
      />
      {filterChains.length ? (
        <SearchList>
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
        </SearchList>
      ) : (
        <SearchNotFound message={t('info.message.emptyChainList')} />
      )}
    </PageContainer>
  );
};
