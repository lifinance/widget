interface FontFile {
  url: string
  options: FontFaceDescriptors
}

type FontFiles = FontFile[]

export interface Font {
  family: string
  fallbackFonts?: string
  source: 'System fonts' | 'Google fonts' | 'Custom fonts'
  fontFiles?: FontFiles
}
