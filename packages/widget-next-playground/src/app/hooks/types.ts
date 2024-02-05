export interface FontFile {
  family: string;
  url: string;
  options: FontFaceDescriptors;
}

export type FontFamilyDefinition = FontFile[];

export interface Font {
  fontName: string;
  fallbackFonts?: string;
  fontSource: 'System fonts' | 'Google fonts' | 'Custom fonts';
  fontDefinition?: FontFamilyDefinition;
}
