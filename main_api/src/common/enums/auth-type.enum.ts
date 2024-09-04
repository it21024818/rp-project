export const AuthType = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  GOOGLE_OAUTH: 'GOOGLE_OAUTH',
  TWITTER_OAUTH: 'TWITTER_OAUTH',
} as const;

export type AuthType = keyof typeof AuthType;
