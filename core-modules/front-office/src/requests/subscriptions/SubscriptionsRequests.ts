import apiConfigInstance from '@sdk5/shared/api';
import type { IApiResponse } from '@sdk5/shared/types';

import type { IGetSubscriptionApiResponse, ISubscriptionsCreateBody } from './Subscriptions.types';

const { api } = apiConfigInstance;
export const SubscriptionsRequests = {
  getSubscription(): Promise<IGetSubscriptionApiResponse> {
    return api.get('/subscriptions');
  },

  createSubscription(data: ISubscriptionsCreateBody): Promise<IGetSubscriptionApiResponse> {
    return api.post('/subscriptions', data);
  },

  deleteSubscription(id: string): Promise<IApiResponse<any>> {
    return api.delete(`/subscriptions/${id}`);
  },

  activateSubscription(id: string): Promise<IApiResponse<any>> {
    return api.patch(`/subscriptions/${id}/activate`);
  },

  stopSubscription(id: string): Promise<IApiResponse<any>> {
    return api.patch(`/subscriptions/${id}/stop`);
  },
};
