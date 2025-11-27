'use client'
import type { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { allFonts } from '../../components/DrawerControls/DesignControls/FontsControl/defaultFonts'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions'
import { useConfigFontFamily } from '../../store/widgetConfig/useConfigValues'
import type { Font } from './types'

interface FontLoadingContextProps {
  loadFont: UseMutateAsyncFunction<void, Error, Font, unknown>
  isLoadingFont: boolean
}

const FontLoadingContext = createContext<FontLoadingContextProps>({
  loadFont: (_font: Font): Promise<void> => {
    return new Promise(() => {})
  },
  isLoadingFont: false,
})

export const FontLoaderProvider = ({ children }: PropsWithChildren) => {
  const [loadedFonts, setLoadedFonts] = useState<string[]>([])

  const { mutateAsync: loadFont, isPending: isLoadingFont } = useMutation({
    mutationFn: async (font: Font) => {
      try {
        if (font.fontFiles && !loadedFonts.includes(font.family)) {
          const fontFaces = font.fontFiles.map(
            (fontFile) =>
              new FontFace(
                font.family,
                `url(${fontFile.url})`,
                fontFile.options
              )
          )

          await Promise.all(fontFaces.map((fontFace) => loadFontFace(fontFace)))

          setLoadedFonts([...loadedFonts, font.family])
        }

        return
      } catch (_e) {
        throw new Error('Problem loading font')
      }
    },
  })

  return (
    <FontLoadingContext.Provider value={{ loadFont, isLoadingFont }}>
      {children}
    </FontLoadingContext.Provider>
  )
}
const loadFontFace = async (fontFace: FontFace) => {
  const loadedFont = await fontFace.load()
  document.fonts.add(loadedFont)
}
export const useFontLoader = () => {
  const { loadFont, isLoadingFont } = useContext(FontLoadingContext)

  return {
    isLoadingFont,
    loadFont,
  }
}

export const useFontInitialisation = () => {
  const { fontFamily } = useConfigFontFamily()
  const { setSelectedFont } = useEditToolsActions()
  const { loadFont } = useFontLoader()

  useEffect(() => {
    if (fontFamily) {
      const family = fontFamily.includes(', ')
        ? fontFamily.substring(0, fontFamily.indexOf(', ')).trim()
        : fontFamily.trim()
      const fallbackFonts = fontFamily.includes(', ')
        ? fontFamily.substring(fontFamily.indexOf(', ') + 2).trim()
        : undefined

      const matchingFont = allFonts.find((font) => {
        return font.family === family && font.fallbackFonts === fallbackFonts
      })

      const font = matchingFont
        ? matchingFont
        : ({
            family,
            fallbackFonts,
            source: 'Custom fonts',
          } as Font)

      setSelectedFont(font)
      loadFont(font)
    }
  }, [fontFamily, setSelectedFont, loadFont])
}
