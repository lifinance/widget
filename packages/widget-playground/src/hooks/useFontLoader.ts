import { useMutation } from '@tanstack/react-query';
import type { Font } from './types';
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
        if (font.fontFiles && !loadedFontsList.includes(font.family)) {
          const fontFaces = font.fontFiles.map(
            (fontFile) =>
              new FontFace(
                font.family,
                `url(${fontFile.url})`,
                fontFile.options,
              ),
          );

          await Promise.all(
            fontFaces.map((fontFace) => loadFontFace(fontFace)),
          );

          setLoadedFontsList([...loadedFontsList, font.family]);
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
