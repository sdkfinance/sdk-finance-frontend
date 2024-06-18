import type { TCommissionCollector } from '../contracts';
import type { ICurrency, ICurrencyShort } from '../currencies';
import type { ICoin } from '../types';

export type TGateProductCategory = 'MOBILE' | 'INTERNET_TV' | 'SIP' | 'COMMUNAL' | 'BANK' | 'WEB_MONEY' | 'ENTERTAINMENT' | 'OTHER';

export type TGateProductCurrency = {
  minAmount: number;
  maxAmount: number;
  currency: ICurrency & { fraction: number };
};

export type TGateProduct = {
  id: string;
  active: boolean;
  visible: boolean;
  externalId: string;
  name?: string;
  description?: string;
  category?: TGateProductCategory;
  icon?: string;
  gateProviderId: string;
  currencies?: TGateProductCurrency[];
  descriptionBundleKey?: string;
  iconBundleKey?: string;
  nameBundleKey?: string;
};

export type TGateProviderCoin = Required<
  Pick<ICoin, 'serial' | 'type' | 'amount' | 'availableAmount' | 'name'> & {
    collector: TCommissionCollector;
    currency: ICurrencyShort;
  }
>;

export type TGetGateProviderProductsResponse = {
  records: TGateProduct[];
};

export type TGetGateProviderCoinsResponse = {
  records: TGateProviderCoin[];
};
