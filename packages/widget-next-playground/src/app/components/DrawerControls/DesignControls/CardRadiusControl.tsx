import { ChangeEventHandler, useState } from 'react';
import { ExpandableCard } from '../../ExpandableCard';
import { useConfigActions, useConfigBorderRadius } from '../../../store';
import { CardValue } from '../../ExpandableCard';
import {
  TabButton,
  TabButtonsContainer,
  TabCustomInput,
} from './DesignControls.style';

const clickableValues = [8, 12, 16];

export const CardRadiusControl = () => {
  const { borderRadius } = useConfigBorderRadius();
  const { setBorderRadius, resetBorderRadius } = useConfigActions();
  const [focused, setFocused] = useState<'input' | 'button'>();
  const [customValue, setCustomValue] = useState('');
  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    const cleanedValue = value.replace(/[.,\s]/g, '');
    const radius = parseInt(cleanedValue, 10);

    if (Number.isFinite(radius) && Number.isFinite(Number(cleanedValue))) {
      setCustomValue(cleanedValue);
      setBorderRadius(radius);
    } else if (cleanedValue === '') {
      setCustomValue(cleanedValue);
      resetBorderRadius();
    }
  };

  const handleBlurInput = () => {
    setFocused(undefined);

    if (customValue && clickableValues.includes(parseInt(customValue, 10))) {
      setCustomValue('');
    }
  };

  const handleButtonClick = (radius: number) => {
    setBorderRadius(radius);
  };

  const handleFocusInput = () => {
    setFocused('input');
  };

  const handleFocusButton = () => {
    setFocused('button');
  };

  return (
    <ExpandableCard
      title={'Card Radius'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {borderRadius}
        </CardValue>
      }
    >
      <TabButtonsContainer sx={{ mt: 0.5 }}>
        {clickableValues.map((value) => {
          return (
            <TabButton
              key={value.toString()}
              selected={borderRadius === value && focused !== 'input'}
              onClick={() => handleButtonClick(value)}
              onFocus={handleFocusButton}
              disableRipple
            >
              {value}
            </TabButton>
          );
        })}

        <TabCustomInput
          selected={
            borderRadius !== undefined &&
            !clickableValues.includes(borderRadius)
          }
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
          inputProps={{ pattern: '[0-9]' }}
          onFocus={handleFocusInput}
          placeholder={focused === 'input' ? '' : 'Custom'}
          value={customValue}
        />
      </TabButtonsContainer>
    </ExpandableCard>
  );
};
