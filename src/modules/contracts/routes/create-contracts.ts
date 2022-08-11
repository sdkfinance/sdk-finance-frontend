import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const CreateContract: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract' */ '@/modules/contracts/pages/create-contract/index.vue'
);

const FirstStep: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-first-step' */ '@/modules/contracts/pages/create-contract/pages/first-step.vue'
);

const Main: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-main' */ '@/modules/contracts/pages/create-contract/pages/main.vue'
);

const Providers: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-providers' */ '@/modules/contracts/pages/create-contract/pages/providers.vue'
);

const ProvidersServices: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-provider-services' */
  '@/modules/contracts/pages/create-contract/pages/provider-services.vue'
);

const ProvidersServiceSettings: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-provider-service-settings' */
  '@/modules/contracts/pages/create-contract/pages/provider-service-commissions.vue'
);

const ContractServiceCommission: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-service-commission' */
  '@/modules/contracts/pages/create-contract/pages/contract-service-commission.vue'
);

const ProviderParameters: AsyncComponent = () => import(
  /* webpackChunkName: 'create-contract-provider-parameters' */
  '@/modules/contracts/pages/create-contract/pages/provider-parameters.vue'
);

export const CREATE_CONTRACT_CHILDREN: IRouteConfig[] = [
  {
    path: 'first-step',
    name: 'create-contract-first-step',
    component: FirstStep,
    meta: {
      translation: 'pages.contracts.first_step',
      layout: {
        props: {
          backName: 'contracts-main',
        },
        breadcrumbs: {
          parent: 'create-contract',
        },
      },
    },
  },
  {
    path: 'main',
    name: 'create-contract-main',
    component: Main,
    meta: {
      translation: 'pages.contracts.main',
      layout: {
        props: {
          backName: 'contracts-main',
        },
        breadcrumbs: {
          parent: 'create-contract',
        },
      },
    },
  },
  {
    path: 'providers',
    name: 'create-contract-providers',
    component: Providers,
    meta: {
      translation: 'pages.contracts.providers',
      layout: {
        props: {
          backName: 'contracts-main',
        },
        breadcrumbs: {
          parent: 'create-contract',
        },
      },
    },
  },
  {
    path: 'payment-gates',
    name: 'create-contract-payment-gates',
    component: FirstStep,
    meta: {
      translation: 'pages.contracts.payment_gates',
      layout: {
        props: {
          backName: 'contracts-main',
        },
      },
    },
  },
  {
    path: 'internal-commissions',
    name: 'create-contract-internal-commissions',
    component: FirstStep,
    meta: {
      translation: 'pages.contracts.internal_commissions',
      layout: {
        props: {
          backName: 'contracts-main',
        },
      },
    },
  },
  {
    path: 'currency-exchange',
    name: 'create-contract-currency-exchange',
    component: FirstStep,
    meta: {
      translation: 'pages.contracts.currency_exchange',
      layout: {
        props: {
          backName: 'contracts-main',
        },
      },
    },
  },
  {
    path: 'create-contract-approve',
    name: 'create-contract-approve',
    component: FirstStep,
    meta: {
      translation: 'pages.contracts.approve',
      layout: {
        props: {
          backName: 'contracts-main',
        },
      },
    },
  },
];
export const PROVIDERS_SERVICES_SETTINGS_CHILDREN: IRouteConfig[] = [
  {
    path: 'list',
    name: 'create-contract-provider-service-settings',
    component: ProviderParameters,
    meta: {
      translation: 'navigation.link.provider_parameters',
      layout: {
        props: {
          backName: 'create-contract-provider-services',
        },
        breadcrumbs: {
          parent: 'create-contract-provider-services',
        },
      },
    },
  },
  {
    path: 'setup',
    name: 'create-contract-provider-service-settings-setup',
    component: ContractServiceCommission,
    meta: {
      translation: 'navigation.link.contract_service_commission',
      layout: {
        props: {
          backName: 'create-contract-provider-services',
        },
        breadcrumbs: {
          parent: 'create-contract-provider-services',
        },
      },
    },
  },
];

export const CREATE_CONTRACT: IRouteConfig[] = [
  {
    path: 'create-contract',
    name: 'create-contract',
    component: CreateContract,
    children: CREATE_CONTRACT_CHILDREN,
    redirect: CREATE_CONTRACT_CHILDREN[0],
    meta: {
      translation: 'navigation.link.create_a_new_contract',
      layout: {
        props: {
          backName: 'contracts-main',
        },
        breadcrumbs: {
          parent: 'contracts',
        },
      },
    },
  },
  {
    path: 'create-contract/providers/:id',
    name: 'create-contract-provider-services',
    component: ProvidersServices,
    meta: {
      translation: 'navigation.link.services',
      layout: {
        props: {
          backName: 'create-contract-providers',
        },
        breadcrumbs: {
          parent: 'create-contract-providers',
        },
      },
    },
  },
  {
    path: 'create-contract/providers/:id/settings',
    component: ProvidersServiceSettings,
    children: PROVIDERS_SERVICES_SETTINGS_CHILDREN,
    redirect: PROVIDERS_SERVICES_SETTINGS_CHILDREN[0],
  },
];
