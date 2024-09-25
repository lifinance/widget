import type { ExtendedChain } from '@lifi/sdk';
import { Avatar, debounce, ListItemAvatar } from '@mui/material';
import { type FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js';
import { FullPageContainer } from '../../components/FullPageContainer.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { StickySearchInput } from '../../components/Search/SearchInput.js';
import { SearchList } from '../../components/Search/SearchInput.style.js';
import { SearchNotFound } from '../../components/Search/SearchNotFound.js';
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js';
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableContainer } from '../../hooks/useScrollableContainer.js';
import type { SelectChainPageProps } from './types.js';

export const SelectChainPage: React.FC<SelectChainPageProps> = ({
  formType,
  selectNativeToken,
}) => {
  const { navigateBack } = useNavigateBack();
  const { chains, setCurrentChain } = useChainSelect(formType);
  const selectToken = useTokenSelect(formType, navigateBack);
  const elementId = useDefaultElementId();
  const scrollableContainer = useScrollableContainer(elementId);

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

  const [filteredChains, setFilteredChains] = useState<ExtendedChain[]>(
    chains ?? [],
  );

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setFilteredChains(chains ?? []);
    } else {
      setFilteredChains(
        chains
          ? chains.filter((chain) =>
              chain.name.toLowerCase().includes(value.toLowerCase()),
            )
          : [],
      );
    }

    if (scrollableContainer) {
      scrollableContainer.scrollTop = 0;
    }
  };

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250);

  return (
    <FullPageContainer disableGutters>
      <StickySearchInput
        onChange={debouncedSearchInputChange}
        placeholder={t('main.searchChains')}
      />
      {filteredChains.length ? (
        <SearchList>
          {filteredChains.map((chain) => (
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
        <SearchNotFound
          message={t('info.message.emptyChainList')}
          adjustForStickySearchInput
        />
      )}
    </FullPageContainer>
  );
};
