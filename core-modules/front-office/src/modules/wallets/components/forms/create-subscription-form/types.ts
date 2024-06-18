import type { ISubscriptionRecord } from '../../../../../requests';

export type TChangeSubscriptionStatusEmitPayload = {
  subscriptionId: string;
  status: ISubscriptionRecord['subscriptionStatus'];
};
