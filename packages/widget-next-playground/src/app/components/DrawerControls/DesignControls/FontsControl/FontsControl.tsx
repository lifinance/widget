import { SyntheticEvent, useEffect, useState } from 'react';
import { Alert, CircularProgress, TextField } from '@mui/material';
import { useConfigActions } from '../../../../store';
import { Font, useFontLoader } from '../../../../hooks';
import { ExpandableCard } from '../../../ExpandableCard';
import { Autocomplete } from '../DesignControls.style';
import { defaultFont, allFonts } from './fontDefinitions';

export const FontsControl = () => {
  const [selectedFont, setSelectedFont] = useState<Font | undefined>();
  const { setFontFamily } = useConfigActions();
  const { loadFont, isLoadingFont } = useFontLoader();

  useEffect(() => {
    if (!selectedFont) {
      setSelectedFont(defaultFont);
      loadFont(defaultFont);
      setFontFamily(defaultFont.fontName);
    }
  }, [defaultFont, selectedFont, setSelectedFont, loadFont, setFontFamily]);

  const handleAutocompleteChange = async (
    _: SyntheticEvent<Element, Event>,
    value: Font | null,
  ) => {
    const font = value ? value : defaultFont;
    setSelectedFont(font);
    await loadFont(font);
    setFontFamily(font.fontName);
  };

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
          getOptionLabel={(font) => font.fontName}
          value={selectedFont}
          isOptionEqualToValue={(option, value) =>
            option.fontName === value.fontName
          }
          onChange={handleAutocompleteChange}
          renderInput={(params) => (
            <TextField {...params} aria-label="font selection" />
          )}
        />
      )}
      <Alert severity="info" sx={{ mt: 1 }}>
        Fonts should be loaded separately or be supported by OS
      </Alert>
    </ExpandableCard>
  );
};
