import apiConfigInstance from '../../api';
import type {
  TCommissionProviderRuleReq,
  TProductCommissionRuleApiResponse,
  TProductCommissionRuleConditionPayload,
  TProductCommissionRulePayload,
} from './Commissions.types';

const { api } = apiConfigInstance;
export const ProductCommissionRequests = {
  getProductCommissionRules(contractId: string, profileId: string, data: TCommissionProviderRuleReq): Promise<TProductCommissionRuleApiResponse> {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/view`, data);
  },

  createProductCommissionRule(contractId: string, profileId: string, data: TProductCommissionRulePayload) {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule`, data);
  },

  updateProductCommissionRule(contractId: string, profileId: string, ruleId: string, data: TProductCommissionRulePayload) {
    return api.patch(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/${ruleId}`, data);
  },

  deleteProductCommissionRule(contractId: string, profileId: string, ruleId: string) {
    return api.delete(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/${ruleId}`);
  },

  createProductCommissionRuleCondition(contractId: string, profileId: string, ruleId: string, data: TProductCommissionRuleConditionPayload) {
    return api.post(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/${ruleId}/condition`, data);
  },

  updateProductCommissionRuleCondition(
    contractId: string,
    profileId: string,
    ruleId: string,
    conditionId: string,
    data: TProductCommissionRuleConditionPayload,
  ) {
    return api.put(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/${ruleId}/condition/${conditionId}`, data);
  },

  deleteProductCommissionRuleCondition(contractId: string, profileId: string, ruleId: string, conditionId: string) {
    return api.delete(`/contracts/${contractId}/gate-commission-profiles/${profileId}/commission-product-rule/${ruleId}/condition/${conditionId}`);
  },
};
