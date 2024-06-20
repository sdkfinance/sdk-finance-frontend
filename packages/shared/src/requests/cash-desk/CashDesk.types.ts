import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, TSortType } from '../../types';
import type { ICurrency } from '../currencies';
import type { IUserAddress, IUserLogin } from '../profiles';
import type { ITransactionsRecord } from '../transactions';
import type { ICoin, ICoordinate } from '../types';
import type { IUserContractInfo, TUserRecordShort } from '../users';

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

export interface ICashDeskWorkingDay {
  id: string;
  cashier: TUserRecordShort;
  status: string;
  createdAt: string;
  start: string;
}

export interface ICashDeskRecordMock extends Pick<ICashDeskRecord, 'id' | 'name' | 'type' | 'coordinate'> {
  organizationStatus: string;
  contract_info: IUserContractInfo;
  coins: ICoin[];
  contact: IUserLogin;
  address: IUserAddress;
  addressLine: string;
  workingDay: ICashDeskWorkingDay;
  cashiers: TUserRecordShort[];
}

export interface ICurrencyDataMockRecord {
  currencyCode: string;
  accountAmount: number;
  startDayCashAmount: number;
  endDayCashAmount: number;
}

export interface ICashDeskWorkingHoursMock {
  id: string;
  start: string;
  end: string;
  workingHoursStatus: string;
  operationRequests?: number;
  closeDayRequests: string;
  reconciliationStatus: string;
  currenciesData: ICurrencyDataMockRecord[];
}

export interface ICashierMockRecord {
  id: string;
  cashierName: string;
  workingDays: number;
  phone: string;
  email: string;
}

export interface ICashierWorkingHoursMockRecord {
  currency: string;
  cashAmount: number;
  currentCashAmount: number;
}

export interface ICurrencyDataMockRecord {
  currencyCode: string;
  accountAmount: number;
  startDayCashAmount: number;
  endDayCashAmount: number;
}

export interface ICashDeskWorkingHoursMock {
  id: string;
  start: string;
  end: string;
  workingHoursStatus: string;
  operationRequests?: number;
  closeDayRequests: string;
  reconciliationStatus: string;
  currenciesData: ICurrencyDataMockRecord[];
}

export interface IViewCashDesksRequestFilters {
  sessionStatuses: string[];
  coinSerials: string[];
  name: string;
  address: string;
}

export interface IViewCashDesksRequestSort {
  createdAt: TSortType;
}

export interface ICreateCashDeskPayloadMock {
  cashierLogin: string;
}

export interface ICashDeskDetailsMock {
  organization: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
}

export type TViewCashDesksApiRequestPayload = IPaginationRequestOptions<Partial<IViewCashDesksRequestFilters>, Partial<IViewCashDesksRequestSort>>;
export type TViewCashDesksResponseMock = IPaginationResponse<ICashDeskRecordMock>;
export type TViewCashDesksApiResponseMock = IApiResponse<TViewCashDesksResponseMock>;
