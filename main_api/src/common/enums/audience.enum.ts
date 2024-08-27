export const Audience = {
  WEB_APP: 'light-house-web-app',
  MOBILE_APP: 'light-house-mobile-app',
  ADMIN_APP: 'light-house-admin-app',
  EXTENSION: 'light-house-extension',
} as const;

export type AppType = keyof typeof Audience;
