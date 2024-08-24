export const PoliticalLeaning = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
} as const;
  
export type PoliticalLeaning = keyof typeof PoliticalLeaning;