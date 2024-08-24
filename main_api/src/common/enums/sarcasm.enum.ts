export const Sarcasm = {
  GENERIC: "GENERIC",
	RHETORICAL_QUESTION: "RHETORICAL_QUESTION",
	HYPERBOLE: "HYPERBOLE"
} as const;

export type Sarcasm = keyof typeof Sarcasm;
