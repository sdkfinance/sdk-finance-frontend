import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  ICommissionGateProfileApiResponse,
  ICommissionProfileApiResponse,
  ICommissionProfilesApiResponse,
  ICommissionRuleApiResponse,
  ICommissionRuleConditionPayload,
  ICommissionRulePayload,
  ICommissionRuleReq,
  IContractBody,
  ICreateMultiCurrencySystemCommission,
  ICreateSystemCommission,
  IGetGateCommissionProfilesApiResponse,
  ILimitBody,
  ILimitsApiResponse,
  IProviderCreateBody,
  IUpdateGateCommissionProfilePayload,
  TViewCommissionProfilesRequestPayload,
  TViewGateCommissionProfilesPaginationResponse,
} from './Commissions.types';
import type {
  ICustomContractBody,
  IGetContractsApiResponse,
  IGetContractsOptions,
  ILimitBodyUpdate,
  ISystemCommissionBodyUpdate,
  ISystemLimitBody,
  TUpdateContractPayload,
} from './Contracts.types';
import { ProductCommissionRequests } from './ProductCommissionRequests';
import { ProviderCommissionRequests } from './ProviderCommissionRequests';

type IPlainObject = Record<string, any>;

const { api } = apiConfigInstance;

export const ContractsRequests = {
  getRecords(data: IGetContractsOptions): Promise<IGetContractsApiResponse> {
    return api.post('/contracts/view', data);
  },

  createCustomContract(contractId: string, data: ICustomContractBody) {
    return api.post(`/contracts/${contractId}/copy`, data);
  },

  getGateCommissionProfiles(contractId: string): Promise<IGetGateCommissionProfilesApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles`);
  },

  getGateCommissionProfile(contractId: string, profileId: string): Promise<ICommissionGateProfileApiResponse> {
    return api.get(`/contracts/${contractId}/gate-commission-profiles/${profileId}`);
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

  deleteGateCommissionLimit(contractId: string, profileId: string, limitId: string): Promise<IApiResponse<any>> {
    return api.delete(`/contracts/${contractId}/gate-commission-profiles/${profileId}/limit-profiles/${limitId}`);
  },

  createGateCommissionProfiles(contractId: string, data: IProviderCreateBody): Promise<IApiResponse<any>> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles`, data);
  },

  updateGateCommissionProfile(contractId: string, payload: IUpdateGateCommissionProfilePayload): Promise<IApiResponse<any>> {
    return api.patch(`/contracts/${contractId}/gate-commission-profiles`, payload);
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

  createCommissionMultiCurrency(contractId: string, data: ICreateMultiCurrencySystemCommission): Promise<any> {
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

  deleteLimitProfile(contractId: string, commissionProfileId: string, limitProfileId: string): Promise<IApiResponse<IPlainObject>> {
    return api.delete(`/contracts/${contractId}/commission-profiles/${commissionProfileId}/limit-profiles/${limitProfileId}`);
  },

  updateCommissionLimits(contractId: string, profileId: string, limitId: string, data: ILimitBodyUpdate): Promise<ILimitsApiResponse> {
    return api.patch(`/contracts/${contractId}/commission-profiles/${profileId}/limit-profiles/${limitId}`, data);
  },

  changeUserContract(data: IContractBody): Promise<IApiResponse<IPlainObject>> {
    return api.patch('/contracts', data);
  },

  viewGateCommissionProfiles(
    contractId: string,
    data: TViewCommissionProfilesRequestPayload,
  ): Promise<TViewGateCommissionProfilesPaginationResponse> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/view`, data);
  },

  modifyContract(contractId: string, payload: TUpdateContractPayload): Promise<IApiResponse<any>> {
    return api.patch(`/contracts/${contractId}`, payload);
  },

  ...ProviderCommissionRequests,
  ...ProductCommissionRequests,
};
