import type { IExchangeRatesRecord } from '@sdk5/shared/requests';

export type TGoldRatesTableData = Pick<IExchangeRatesRecord, 'inCurrency' | 'outCurrency'> & {
  buyRate: number | null;
  sellRate: number | null;
};
