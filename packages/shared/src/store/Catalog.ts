import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import type {
  ICurrency,
  IGateSetting,
  IOperationFlowRecord,
  IPaymentProviderBody,
  IPaymentProviderRecord,
  ITransactionCategoryRecord,
} from '../requests';
import { CatalogsRequests, CurrencyRequests, GateProviderRequests, GateRequests, TransactionCategoriesRequests } from '../requests';
import type { IApiResponse } from '../types';

@Module({ namespaced: true, name: 'Catalog' })
export class Catalog extends VuexModule {
  public currencyList: ICurrency[] = [];

  public providerAccountsList: IGateSetting[] = [];

  public paymentProviderList: IPaymentProviderRecord[] = [];

  public operationFlowsList: IOperationFlowRecord[] = [];

  public transactionCategories: ITransactionCategoryRecord[] = [];

  public get currencyListWithDisplayName(): (ICurrency & { displayName: string })[] {
    return this.currencyList.map((currency) => ({
      ...currency,
      displayName: `${currency.name}(${currency.code})`,
    }));
  }

  @Mutation
  public SET_CURRENCY(payload: ICurrency[]): void {
    this.currencyList = payload;
  }

  @Mutation
  public SET_PROVIDER_ACCOUNTS(payload: IGateSetting[]): void {
    this.providerAccountsList = payload;
  }

  @Mutation
  public SET_OPERATION_FLOWS(payload: IOperationFlowRecord[]): void {
    this.operationFlowsList = payload;
  }

  @Mutation
  public SET_PAYMENT_PROVIDERS(payload: IPaymentProviderRecord[]): void {
    this.paymentProviderList = payload;
  }

  @Mutation
  public SET_TRANSACTION_CATEGORIES(payload: ITransactionCategoryRecord[]): void {
    this.transactionCategories = payload;
  }

  @Action
  public async fetchCurrency() {
    const request = await CurrencyRequests.getCurrencies();

    const payload = request.response?.records || [];
    this.context.commit('SET_CURRENCY', payload);

    return request;
  }

  @Action
  public async fetchProvidersAccounts() {
    const request = await GateProviderRequests.getProviders();

    const payload = request.response?.records || [];
    this.context.commit('SET_PROVIDER_ACCOUNTS', payload);

    return request;
  }

  @Action
  public async fetchOperationFlows(): Promise<IApiResponse<any>> {
    const data = await CatalogsRequests.getOperationFlows();

    const payload = data.response?.records || [];
    this.context.commit('SET_OPERATION_FLOWS', payload);

    return data;
  }

  @Action
  public async fetchPaymentProviders(data: IPaymentProviderBody) {
    const request = await GateRequests.getPaymentProviders(data);

    const payload = request.response?.records || [];
    this.context.commit('SET_PAYMENT_PROVIDERS', payload);

    return request;
  }

  @Action
  public async fetchTransactionCategories(forceUpdate: boolean = false): Promise<void> {
    if (this.transactionCategories.length && !forceUpdate) {
      return;
    }

    const { response, error } = await TransactionCategoriesRequests.getRecords({ all: true });

    if (error) {
      return;
    }

    const payload = response?.records || [];
    this.context.commit('SET_TRANSACTION_CATEGORIES', payload);
  }
}
