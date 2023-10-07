import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonGroupContainer,
  SelectButton,
} from './BookmarkLandingButtonGroup.styled';

export const BookmarkLandingButtonGroup = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('Custom');

  return (
    <ButtonGroupContainer>
      <SelectButton selected={selected} onClick={() => setSelected('Custom')}>
        {t('button.custom')}
      </SelectButton>
      <SelectButton
        selected={selected}
        onClick={() => setSelected('Bookmarks')}
      >
        {t('button.bookmarks')}
      </SelectButton>
    </ButtonGroupContainer>
  );
};
