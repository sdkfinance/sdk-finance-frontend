import api from '@/services/api';
import {
  ICommissionBody,
  ICommissionGateProfileApiResponse,
  ICommissionProfileApiResponse,
  ICommissionProfilesApiResponse,
  ICommissionRuleApiResponse,
  ICommissionRuleConditionPayload,
  ICommissionRulePayload, ICommissionRuleReq,
  ICommissionSettingsApiResponse,
  ICreateSystemCommission,
  ILimitBody,
  ILimitsApiResponse,
  IProviderCreateBody,
  IProvidersApiResponse,
} from '@/services/requests/contracts/Commissions.types';
import {
  ICustomContractBody,
  IGetContractsApiResponse,
  IGetContractsOptions,
  ILimitBodyUpdate,
  ISystemCommissionBodyUpdate,
  ISystemLimitBody,
} from '@/services/requests/contracts/Contracts.types';

export const ContractsRequests = {

  getRecords(data: IGetContractsOptions): Promise<IGetContractsApiResponse> {
    return api.post('/contracts/view', data);
  },

  createCustomContract(contractId: string, data: ICustomContractBody) {
    return api.post(`/contracts/${contractId}/copy`, data);
  },

  getGateCommissionProfiles(contractId: string): Promise<IProvidersApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles`);
  },

  getGateCommissionProfile(contractId: string, profileId: string): Promise<ICommissionGateProfileApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles/${profileId}`);
  },

  getGateCommissionSettings(contractId: string, profileId: string): Promise<ICommissionSettingsApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-settings-records`);
  },

  getGateCommissionLimits(contractId: string, profileId: string): Promise<ILimitsApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles/${profileId}/limit-profiles`);
  },

  createGateCommissionLimits(contractId: string, profileId: string, data: ILimitBody): Promise<ILimitsApiResponse> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/limit-profiles`, data);
  },

  updateGateCommissionLimits(contractId: string, profileId: string, limitId: string, data: ILimitBodyUpdate): Promise<ILimitsApiResponse> {
    return api.patch(`/contracts/${contractId}/gate-commission-profiles/${profileId}/limit-profiles/${limitId}`, data);
  },

  createGateCommissionProfiles(contractId: string, data: IProviderCreateBody): Promise<any> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles`, data);
  },

  createGateCommission(contractId: string, profileId: string, data: ICommissionBody): Promise<any> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-settings-records/set-up-commission-settings`, data);
  },

  getCommissionProfile(contractId: string, profileId: string): Promise<ICommissionProfileApiResponse> {
    return api.get(`/contracts/${contractId}/commission-profiles/${profileId}`);
  },

  getCommissionProfiles(contractId: string): Promise<ICommissionProfilesApiResponse> {
    return api.get(`/contracts/${contractId}/commission-profiles`);
  },

  getCommission(contractId: string, profileId: string): Promise<ICommissionProfileApiResponse> {
    return api.get(`/contracts/${contractId}/commission-profiles/${profileId}`);
  },

  getCommissionRules(contractId: string, profileId: string, data: ICommissionRuleReq): Promise<ICommissionRuleApiResponse> {
    return api.post(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/view`, data);
  },

  createCommissionRule(contractId: string, profileId: string, data: ICommissionRulePayload) {
    return api.post(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule`, data);
  },

  updateCommissionRule(contractId: string, profileId: string, ruleId: string, data: ICommissionRulePayload) {
    return api.patch(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/${ruleId}`, data);
  },

  deleteCommissionRule(contractId: string, profileId: string, ruleId: string) {
    return api.delete(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/${ruleId}`);
  },

  createCondition(contractId: string, profileId: string, ruleId: string, data: ICommissionRuleConditionPayload) {
    return api.post(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/${ruleId}/condition`, data);
  },

  updateCondition(contractId: string, profileId: string, ruleId: string, conditionId: string, data: ICommissionRuleConditionPayload) {
    return api.put(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/${ruleId}/condition/${conditionId}`, data);
  },

  deleteCondition(contractId: string, profileId: string, ruleId: string, conditionId: string) {
    return api.delete(`/contracts/${contractId}/commission-profiles/${profileId}/commission-rule/${ruleId}/condition/${conditionId}`);
  },

  createCommission(contractId: string, data: ICreateSystemCommission): Promise<any> {
    return api.post(`/contracts/${contractId}/commission-profiles`, data);
  },

  createCommissionMultiCurrency(contractId: string, data: ICreateSystemCommission): Promise<any> {
    return api.post(`/contracts/${contractId}/commission-profiles/multi-currency`, data);
  },

  updateCommission(contractId: string, profileId: string, data: ISystemCommissionBodyUpdate): Promise<any> {
    return api.patch(`/contracts/${contractId}/commission-profiles/${profileId}`, data);
  },

  getCommissionLimits(contractId: string, profileId: string): Promise<ILimitsApiResponse> {
    return api.get(`/contracts/${contractId}/commission-profiles/${profileId}/limit-profiles`);
  },

  createCommissionLimits(contractId: string, profileId: string, data: ISystemLimitBody): Promise<ILimitsApiResponse> {
    return api.post(`/contracts/${contractId}/commission-profiles/${profileId}/limit-profiles`, data);
  },

  updateCommissionLimits(contractId: string, profileId: string, limitId: string, data: ILimitBodyUpdate): Promise<ILimitsApiResponse> {
    return api.patch(`/contracts/${contractId}/commission-profiles/${profileId}/limit-profiles/${limitId}`, data);
  },

};
