import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';
import { generateNestedRoutes } from '@/utils';

const ContractPage: AsyncComponent = () => import(/* webpackChunkName: 'contracts' */
  '@/modules/contracts-old/pages/index.vue'
);

const ContractMerchantPage: AsyncComponent = () => import(/* webpackChunkName: 'contracts-merchant' */
  '@/modules/contracts-old/pages/merchant/index.vue'
);

const ContractIndividualPage: AsyncComponent = () => import(/* webpackChunkName: 'contracts-individual' */
  '@/modules/contracts-old/pages/individual/index.vue'
);

const ContractProviderCommissionPage: AsyncComponent = () => import(/* webpackChunkName: 'contracts-provider-commission' */
  '@/modules/contracts-old/pages/provider-commission/index.vue'
);

const ContractSystemCommissionPage: AsyncComponent = () => import(/* webpackChunkName: 'contracts-system-commission' */
  '@/modules/contracts-old/pages/system-commission/index.vue'
);

const ContractGateDetails: AsyncComponent = () => import(/* webpackChunkName: 'contract-gate-details' */
  '@/modules/contracts-old/pages/details/gate-details.vue'
);

const ContractSystemDetailsRules: AsyncComponent = () => import(/* webpackChunkName: 'contract-system-details-rules' */
  '@/modules/contracts-old/pages/details/system-details-rules.vue'
);

const ContractSystemDetailsLimits: AsyncComponent = () => import(/* webpackChunkName: 'contract-system-details-limits' */
  '@/modules/contracts-old/pages/details/system-details-limits.vue'
);

export const SYSTEM_DETAILS_CHILDREN: IRouteConfig[] = [
  {
    path: ':profileId/rules',
    name: 'system-details-view',
    component: ContractSystemDetailsRules,
    meta: {
      translation: 'pages.contracts.navigation.commissions',
      level: 3,
    },
  },
  {
    path: ':profileId/limits',
    name: 'system-details-limits-view',
    component: ContractSystemDetailsLimits,
    meta: {
      translation: 'pages.contracts.navigation.limits',
      level: 3,
    },
  },
];

export const CONTRACT_DETAILS: IRouteConfig[] = [
  {
    path: ':profileId',
    name: 'gate-details-view',
    component: ContractGateDetails,
  },
  ...SYSTEM_DETAILS_CHILDREN,
];

export const CONTRACT_CHILDREN: IRouteConfig[] = [
  {
    path: ':contractId/provider-commission',
    name: 'provider-commission',
    component: ContractProviderCommissionPage,
    meta: {
      level: 2,
      translation: 'pages.contracts.navigation.provider_commission',
    },
  },
  {
    path: ':contractId/system-commission',
    name: 'system-commission',
    component: ContractSystemCommissionPage,
    meta: {
      level: 2,
      translation: 'pages.contracts.navigation.system_commission',
    },
  },
  ...generateNestedRoutes(
    'provider-commission',
    ':contractId/provider-commission',
    [CONTRACT_DETAILS[0]],
  ),
  ...generateNestedRoutes(
    'system-commission',
    ':contractId/system-commission',
    SYSTEM_DETAILS_CHILDREN,
  ),
];

export const CONTRACTS_CHILDREN: IRouteConfig[] = [
  {
    path: 'merchant',
    name: 'merchant',
    component: ContractMerchantPage,
    meta: {
      level: 1,
      translation: 'pages.contracts.navigation.merchant',
    },
  },
  {
    path: 'individual',
    name: 'individual',
    component: ContractIndividualPage,
    meta: {
      level: 1,
      translation: 'pages.contracts.navigation.individual',
    },
  },
  ...generateNestedRoutes(
    'merchant',
    'merchant',
    CONTRACT_CHILDREN,
  ),
  ...generateNestedRoutes(
    'individual',
    'individual',
    CONTRACT_CHILDREN,
  ),

];

export const CONTRACTS_OLD: IRouteConfig = {
  path: '/dashboard/contracts-old',
  component: ContractPage,
  meta: {
    permission: [ROLES.administrator, ROLES.compliance_manager, ROLES.cfo],
    translation: 'navigation.link.contracts',
    root: true,
    icon: 'icon-contracts',
  },
  redirect: CONTRACTS_CHILDREN[0],
  children: CONTRACTS_CHILDREN,
};
