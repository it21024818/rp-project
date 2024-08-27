export const StripeEvent = {
  CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: 'customer.subscription.trial_will_end',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_PAUSED: 'customer.subscription.paused',
  CUSTOMER_SUBSCRIPTION_RESUMED: 'customer.subscription.resumed',
  CUSTOMER_SUBSCRIPTION_UPDATE: 'customer.subscription.updated',
  ENTITLEMENTS_ACTIVE_ENTITLEMENT_SUMMARY_UPDATED: 'entitlements.active_entitlement_summary.updated',
} as const;

export type StripeEvent = keyof typeof StripeEvent;
