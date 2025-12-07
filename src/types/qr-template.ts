export type DotStyle = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerStyle = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyle = 'square' | 'dot';
export type FrameType = 'none' | 'box' | 'blob';

export interface QRColors {
  background: string;
  dots: string;
  eyeFrame: string;
  eyeCenter: string;
}

export interface QRPatterns {
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  cornerDotStyle: CornerDotStyle;
}

export interface QRLogo {
  dataUrl: string | null;
  scale: number;
  margin: number;
}

export interface QRFrame {
  type: FrameType;
  blobIntensity: number;
  blobSeed: number;
  ctaText: string;
  ctaColor: string;
}

export interface QRTemplate {
  colors: QRColors;
  patterns: QRPatterns;
  logo: QRLogo;
  frame: QRFrame;
}

export interface QRTemplateDoc extends QRTemplate {
  userId: string;
  updatedAt: Date;
}

export const DEFAULT_TEMPLATE: QRTemplate = {
  colors: {
    background: '#ffffff',
    dots: '#000000',
    eyeFrame: '#000000',
    eyeCenter: '#000000',
  },
  patterns: {
    dotStyle: 'square',
    cornerStyle: 'square',
    cornerDotStyle: 'square',
  },
  logo: {
    dataUrl: null,
    scale: 0.4,
    margin: 10,
  },
  frame: {
    type: 'none',
    blobIntensity: 5,
    blobSeed: 12345,
    ctaText: 'SCAN ME',
    ctaColor: '#2563eb',
  },
};

export const DOT_STYLES: { id: DotStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy R' },
  { id: 'extra-rounded', label: 'Extra R' },
];

export const CORNER_STYLES: { id: CornerStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
  { id: 'extra-rounded', label: 'Rounded' },
];

export const CORNER_DOT_STYLES: { id: CornerDotStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
];

export const PRESET_COLORS = [
  '#2563eb',
  '#000000',
  '#ef4444',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
];
