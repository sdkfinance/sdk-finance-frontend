import api from '@/services/api';
import { IGetSubscriptionApiResponse, ISubscriptionsCreateBody } from '@/services/requests/subscriptions/Subscriptions.types';
import { IApiResponse } from '@/types/interfaces';

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
