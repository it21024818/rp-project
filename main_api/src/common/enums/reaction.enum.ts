export const Reaction = {
  GOOD: "GOOD",
  BAD: "BAD",
} as const;

export type Reaction = keyof typeof Reaction;
