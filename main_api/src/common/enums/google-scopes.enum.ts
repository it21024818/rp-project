export const GoogleScope = {
  USER_PROFILE: 'https://www.googleapis.com/auth/userinfo.profile',
  USER_EMAIL: 'https://www.googleapis.com/auth/profile.emails.read',
  USER_BDAY: 'https://www.googleapis.com/auth/user.birthday.read',
  OPEN_ID: 'openid',
} as const;

export type GoogleScope = keyof typeof GoogleScope;
