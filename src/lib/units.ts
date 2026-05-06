export const COMMON_UNITS = [
  'pièce',
  'kg',
  'L',
  'carton',
  'barquette',
  'sachet'
] as const;

export type CommonUnit = (typeof COMMON_UNITS)[number];

export function isCommonUnit(u: string): u is CommonUnit {
  return (COMMON_UNITS as readonly string[]).includes(u);
}
