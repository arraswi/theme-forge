export interface Theme {
  name: string;
  base: string;
  colors: Record<string, string>;
  onBase: string;
  contrast: number;
  css: string;
}
export function normalizeHex(color: string): string;
export function contrastRatio(first: string, second: string): number;
export function generateTheme(color: string, name?: string): Theme;
