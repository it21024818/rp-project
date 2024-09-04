export const PoliticalLeaning = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  CENTER: 'CENTER',
} as const;

export type PoliticalLeaning = keyof typeof PoliticalLeaning;
