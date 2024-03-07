import { useMutation } from '@tanstack/react-query';
import type { Font } from './types';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface FontLoadingContextProps {
  loadedFonts: string[];
  setLoadedFonts: Dispatch<SetStateAction<string[]>>;
}

const FontLoadingContext = createContext<FontLoadingContextProps>({
  loadedFonts: [],
  setLoadedFonts: () => {},
});

export const FontLoadingProvider = ({ children }: PropsWithChildren) => {
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  return (
    <FontLoadingContext.Provider value={{ loadedFonts, setLoadedFonts }}>
      {children}
    </FontLoadingContext.Provider>
  );
};
const loadFontFace = async (fontFace: FontFace) => {
  const loadedFont = await fontFace.load();
  document.fonts.add(loadedFont);
};
export const useFontLoader = () => {
  const { loadedFonts, setLoadedFonts } = useContext(FontLoadingContext);
  // const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  const { mutateAsync: loadFont, isPending: isLoadingFont } = useMutation({
    mutationFn: async (font: Font) => {
      try {
        if (font.fontFiles && !loadedFonts.includes(font.family)) {
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

          setLoadedFonts([...loadedFonts, font.family]);
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
