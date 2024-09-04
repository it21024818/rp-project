export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
} as const;

export type SubscriptionStatus = keyof typeof SubscriptionStatus;
