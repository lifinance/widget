export interface FontFile {
  family: string;
  url: string;
  options: FontFaceDescriptors;
}

export type FontFamilyDefinition = FontFile[];

export interface Font {
  fontName: string;
  fontSource: 'System fonts' | 'Google fonts';
  fontDefinition?: FontFamilyDefinition;
}
