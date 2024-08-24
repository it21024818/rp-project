export const YesNo = {
  YES: 'YES',
  NO: 'NO',
} as const;

export type YesNo = keyof typeof YesNo;