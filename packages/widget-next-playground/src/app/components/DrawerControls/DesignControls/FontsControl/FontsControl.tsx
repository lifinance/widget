import { SyntheticEvent, useEffect, useState } from 'react';
import { Alert, CircularProgress, TextField } from '@mui/material';
import { useConfigActions } from '../../../../store';
import { Font, useFontLoader } from '../../../../hooks';
import { ExpandableCard } from '../../../ExpandableCard';
import { Autocomplete } from '../DesignControls.style';
import { defaultFont, allFonts } from './fontDefinitions';

const getCompleteFontFamily = (font: Font) =>
  [font.fontName, font.fallbackFonts || 'sans-serif'].join(', ');
export const FontsControl = () => {
  const [selectedFont, setSelectedFont] = useState<Font | undefined>();
  const { setFontFamily } = useConfigActions();
  const { loadFont, isLoadingFont } = useFontLoader();

  const setAndLoadFont = (font: Font) => {
    setSelectedFont(font);
    loadFont(font);
    const webSafeFont = getCompleteFontFamily(font);
    setFontFamily(webSafeFont);
  };

  useEffect(() => {
    if (!selectedFont) {
      setAndLoadFont(defaultFont);
    }
  }, [defaultFont, selectedFont, setSelectedFont, loadFont, setFontFamily]);

  const handleAutocompleteChange = async (
    _: SyntheticEvent<Element, Event>,
    value: Font | string | null,
  ) => {
    if (typeof value === 'string') {
      setSelectedFont({ fontName: value, fontSource: 'Custom fonts' });
      setFontFamily(value);
    } else {
      const font = value ? value : defaultFont;
      setAndLoadFont(font);
    }
  };

  const handleAutocompleteBlur = async (
    event: SyntheticEvent<HTMLInputElement, FocusEvent>,
  ) => {
    const inputValue = (event.target as HTMLInputElement).value.trim();

    if (!selectedFont || inputValue !== getCompleteFontFamily(selectedFont)) {
      if (inputValue) {
        const matchingFont = allFonts.find(
          (font) =>
            inputValue.toLowerCase() ===
            getCompleteFontFamily(font).toLowerCase(),
        );
        if (matchingFont) {
          setAndLoadFont(matchingFont);
        } else {
          setSelectedFont({ fontName: inputValue, fontSource: 'Custom fonts' });
          setFontFamily(inputValue);
        }
      }
    }
  };

  const FontInfoMessage =
    selectedFont?.fontSource === 'System fonts'
      ? 'System font should be supported by the intended OS'
      : selectedFont?.fontSource === 'Custom fonts'
        ? 'Fonts should be loaded separately'
        : selectedFont?.fontSource === 'Google fonts' &&
            selectedFont?.fontName !== defaultFont.fontName
          ? 'Fonts should be loaded from Google Fonts separately'
          : 'Fonts should be loaded separately or be supported by OS';

  return (
    <ExpandableCard
      title={
        <>
          Font
          {isLoadingFont && (
            <CircularProgress size="1rem" sx={{ marginLeft: 1 }} />
          )}
        </>
      }
      value={selectedFont?.fontName}
    >
      {selectedFont && (
        <Autocomplete
          freeSolo
          sx={{ mt: 1 }}
          options={
            allFonts.sort((a, b) => {
              let order = b.fontSource.localeCompare(a.fontSource);
              if (order === 0) {
                order = b.fontName.localeCompare(a.fontName);
              }
              return -order;
            }) as Font[]
          }
          groupBy={(font) => font.fontSource}
          getOptionLabel={(font) => {
            if (typeof font === 'string') {
              return font;
            }
            return font.fontSource === 'Custom fonts'
              ? font.fontName
              : getCompleteFontFamily(font);
          }}
          value={selectedFont}
          isOptionEqualToValue={(option, value) =>
            option.fontName === value.fontName
          }
          onChange={handleAutocompleteChange}
          onBlur={handleAutocompleteBlur}
          renderInput={(params) => (
            <TextField {...params} aria-label="font selection" />
          )}
        />
      )}
      <Alert severity="info" sx={{ mt: 1 }}>
        {FontInfoMessage}
      </Alert>
    </ExpandableCard>
  );
};
