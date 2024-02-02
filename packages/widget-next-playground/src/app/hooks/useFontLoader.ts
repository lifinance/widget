import { useMutation } from '@tanstack/react-query';
import { Font } from './types';
import { useState } from 'react';

const loadFontFace = async (fontFace: FontFace) => {
  const loadedFont = await fontFace.load();
  document.fonts.add(loadedFont);
};
export const useFontLoader = () => {
  const [loadedFontsList, setLoadedFontsList] = useState<string[]>([]);

  const { mutateAsync: loadFont, isPending: isLoadingFont } = useMutation({
    mutationFn: async (font: Font) => {
      try {
        if (font.fontDefinition && !loadedFontsList.includes(font.fontName)) {
          const fontFaces = font.fontDefinition.map(
            (font) =>
              new FontFace(font.family, `url(${font.url})`, font.options),
          );

          await Promise.all(
            fontFaces.map((fontFace) => loadFontFace(fontFace)),
          );

          setLoadedFontsList([...loadedFontsList, font.fontName]);
        }

        return;
      } catch (e) {
        throw new Error('Problem loading font');
      }
    },
  });

  return {
    isLoadingFont,
    loadFont,
  };
};
