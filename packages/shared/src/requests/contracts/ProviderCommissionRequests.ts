import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  TCommissionProviderRuleReq,
  TGateCommissionRuleConditionPayload,
  TProviderCommissionRuleApiResponse,
  TProviderCommissionRulePayload,
  TUpdateProviderCommissionConditionResponse,
} from './Commissions.types';

const { api } = apiConfigInstance;

export const ProviderCommissionRequests = {
  getCommissionProviderRules(contractId: string, profileId: string, data: TCommissionProviderRuleReq): Promise<TProviderCommissionRuleApiResponse> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/view`, data);
  },

  createProviderCommissionRule(contractId: string, profileId: string, data: TProviderCommissionRulePayload): Promise<IApiResponse<any>> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule`, data);
  },

  updateProviderCommissionRule(
    contractId: string,
    profileId: string,
    ruleId: string,
    data: TProviderCommissionRulePayload,
  ): Promise<IApiResponse<any>> {
    return api.patch(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/${ruleId}`, data);
  },

  deleteProviderCommissionRule(contractId: string, profileId: string, ruleId: string): Promise<IApiResponse<any>> {
    return api.delete(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/${ruleId}`);
  },

  createProviderCommissionCondition(
    contractId: string,
    profileId: string,
    ruleId: string,
    data: TGateCommissionRuleConditionPayload,
  ): Promise<IApiResponse<any>> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/${ruleId}/condition`, data);
  },

  updateProviderCommissionCondition(
    contractId: string,
    profileId: string,
    ruleId: string,
    conditionId: string,
    data: TGateCommissionRuleConditionPayload,
  ): Promise<TUpdateProviderCommissionConditionResponse> {
    return api.put(
      `/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/${ruleId}/condition/${conditionId}`,
      data,
    );
  },

  deleteProviderCommissionCondition(contractId: string, profileId: string, ruleId: string, conditionId: string) {
    return api.delete(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-provider-rule/${ruleId}/condition/${conditionId}`);
  },
};
