export const EmailPurpose = {
  SIGN_UP: {
    subject: 'Lighthouse - Complete your registration',
    template: 'registration',
  },
  RESET_PASSWORD: {
    subject: 'Lighthouse - Reset your password',
    template: 'reset-password',
  },
} as const;
export type EmailPurpose = keyof typeof EmailPurpose;
