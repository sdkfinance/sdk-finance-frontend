import type { ICoordinate, ICurrency, ITransactionsRecord } from '@sdk5/shared/requests';

export interface ICashDeskRecord {
  id: string;
  name: string;
  currencies: ICurrency[];
  address: string;
  type: string;
  coordinate: ICoordinate;
}

export interface ICashDeskBody {
  coin: string;
  amount: number;
  receiverName: string;
}

export type ICashDeskResponse = { records: ICashDeskRecord[] };
export type ICashDeskExecuteResponse = { process: ITransactionsRecord };
