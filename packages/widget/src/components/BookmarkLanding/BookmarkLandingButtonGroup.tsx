import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonGroupContainer,
  SelectButton,
} from './BookmarkLandingButtonGroup.styled';

export const BookmarkLandingButtonGroup = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('custom');

  return (
    <ButtonGroupContainer>
      <SelectButton
        isSelected={selected === 'custom'}
        onClick={() => setSelected('custom')}
      >
        {t('button.custom')}
      </SelectButton>

      <SelectButton
        isSelected={selected === 'bookmarks'}
        onClick={() => setSelected('bookmarks')}
      >
        {t('button.bookmarks')}
      </SelectButton>
    </ButtonGroupContainer>
  );
};
