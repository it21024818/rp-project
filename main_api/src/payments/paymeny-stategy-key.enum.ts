export const PaymentStrategyKey = {
  STRIPE: 'STRIPE',
} as const;

export type PaymentStrategyKey = keyof typeof PaymentStrategyKey;
