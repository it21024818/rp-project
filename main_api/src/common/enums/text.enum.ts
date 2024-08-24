export const Text = {
  TWEET: "TWEET",
  NEWS: "NEWS",
} as const;

export type Text = keyof typeof Text;
