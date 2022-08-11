import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';
import { PROVIDERS_ROUTES } from '@/modules/contracts/routes/providers';
import { PAYMENT_GATEWAYS_ROUTES } from '@/modules/contracts/routes/payment-gateways';
import { CREATE_CONTRACT } from '@/modules/contracts/routes/create-contracts';
import { INTERNAL_OPERATIONS } from '@/modules/contracts/routes/internal-operations';

const BasePageLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue'
);
const ContractsDashboard: AsyncComponent = () => import(
  /* webpackChunkName: 'contracts-dashboard' */ '@/modules/contracts/pages/contracts-dashboard.vue'
);

const IndividualContracts: AsyncComponent = () => import(
  /* webpackChunkName: 'individual-contract' */ '@/modules/contracts/pages/individual-contracts/index.vue'
);

const ArchiveIndividualContracts: AsyncComponent = () => import(
  /* webpackChunkName: 'archive-individual-contract' */ '@/modules/contracts/pages/individual-contracts/archive-page.vue'
);

const MerchantContracts: AsyncComponent = () => import(
  /* webpackChunkName: 'merchant-contract' */ '@/modules/contracts/pages/merchant-contracts/index.vue'
);

const ArchiveMerchantContracts: AsyncComponent = () => import(
  /* webpackChunkName: 'archive-merchant-contract' */ '@/modules/contracts/pages/merchant-contracts/archive-page.vue'
);

const CurrencyExchangeContracts: AsyncComponent = () => import(
  /* webpackChunkName: 'currency_exchange_contracts' */ '@/modules/contracts/pages/currency-exchange-contracts/index.vue'
);

export const CONTRACTS_CHILDREN: IRouteConfig[] = [
  {
    path: '',
    name: 'contracts-main',
    component: ContractsDashboard,
  },
  ...CREATE_CONTRACT,
  PROVIDERS_ROUTES,
  PAYMENT_GATEWAYS_ROUTES,
  ...INTERNAL_OPERATIONS,
  {
    path: 'currency-exchange',
    name: 'contract-currency-exchange',
    component: CurrencyExchangeContracts,
    meta: {
      root: true,
      translation: 'navigation.link.currency_exchange',
    },
  },
  {
    path: 'individual-contracts',
    name: 'contract-individual-contracts',
    component: IndividualContracts,
    meta: {
      root: true,
      translation: 'navigation.link.individual_contracts',
    },
  },
  {
    path: 'individual-contracts/archive',
    name: 'contract-archive-individual-contracts',
    component: ArchiveIndividualContracts,
    meta: {
      layout: {
        componentName: 'SimpleLayout',
        props: {
          backName: 'contract-individual-contracts',
        },
      },
    },
  },
  {
    path: 'merchant-contracts',
    name: 'contract-merchant-contracts',
    component: MerchantContracts,
    meta: {
      root: true,
      translation: 'navigation.link.merchant_contracts',
    },
  },
  {
    path: 'merchant-contracts/archive',
    name: 'contract-archive-merchant-contracts',
    component: ArchiveMerchantContracts,
    meta: {
      layout: {
        componentName: 'SimpleLayout',
        props: {
          backName: 'contract-merchant-contracts',
        },
      },
    },
  },
  {
    path: 'pricing-plan',
    name: 'contract-pricing-plan',
    component: ContractsDashboard,
    meta: {
      root: true,
      translation: 'navigation.link.pricing_plan',
    },
  },
];

export const CONTRACTS: IRouteConfig = {
  path: '/dashboard/contracts',
  component: BasePageLayout,
  name: 'contracts',
  meta: {
    permission: [ROLES.administrator, ROLES.compliance_manager, ROLES.cfo],
    translation: 'navigation.link.contracts',
    root: true,
    icon: 'icon-contracts',
  },
  redirect: CONTRACTS_CHILDREN[0],
  children: CONTRACTS_CHILDREN,
};
