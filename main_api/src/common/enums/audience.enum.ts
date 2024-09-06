export const Audience = {
  WEB_APP: 'WEB_APP',
  MOBILE_APP: 'MOBILE_APP',
  ADMIN_APP: 'ADMIN_APP',
  EXTENSION: 'EXTENSION',
} as const;

export type Audience = keyof typeof Audience;
