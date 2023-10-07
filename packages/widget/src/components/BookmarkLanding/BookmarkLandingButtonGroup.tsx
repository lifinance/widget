import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonContainer,
  SelectedButton,
} from './BookmarkLandingButtonGroup.styled';

export const BookmarkLandingButtonGroup = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('Custom');

  return (
    <ButtonContainer>
      <SelectedButton selected={selected} onClick={() => setSelected('Custom')}>
        {t('button.custom')}
      </SelectedButton>
      <SelectedButton
        selected={selected}
        onClick={() => setSelected('Bookmarks')}
      >
        {t('button.bookmarks')}
      </SelectedButton>
    </ButtonContainer>
  );
};
