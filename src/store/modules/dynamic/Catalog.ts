import {
  VuexModule, Module, Mutation, Action, getModule,
} from 'vuex-module-decorators';
import {
  CurrencyRequests, GateProviderRequests, IssuersRequests, CatalogsRequests, GateRequests,
} from '@/services/requests';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import { IGateSetting } from '@/services/requests/gate-providers/GateProviders.types';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { IOperationFlowRecord } from '@/services/requests/catalogs/Catalogs.types';
import store from '@/store';
import { IApiResponse } from '@/types/interfaces';
import { IPaymentProviderBody, IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';
import { TransactionCategoriesRequests } from '@/services/requests/transaction-categories/TransactionCategoriesRequests';
import {
  ITransactionCategoryRecord,
} from '@/services/requests/transaction-categories/TransactionCategories.types';

@Module({
  dynamic: true, namespaced: true, store, name: 'Catalog',
})
export default class Catalog extends VuexModule {

    public currencyList: ICurrency[] = [];

    public providerAccountsList: IGateSetting[] = [];

    public paymentProviderList: IPaymentProviderRecord[] = [];

    public issuerList: Required<IIssuer>[] = [];

    public operationFlowsList: IOperationFlowRecord[] = [];

    public transactionCategories: ITransactionCategoryRecord[] = [];

    @Mutation
    public SET_CURRENCY(payload: ICurrency[]): void {
      this.currencyList = payload;
    }

    @Mutation
    public SET_PROVIDER_ACCOUNTS(payload: IGateSetting[]): void {
      this.providerAccountsList = payload;
    }

    @Mutation
    public SET_ISSUERS(payload: Required<IIssuer>[]): void {
      this.issuerList = payload;
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
    public async fetchCurrency(): Promise<IApiResponse<any>> {
      const { response, error } = await CurrencyRequests.getCurrencies();

      const payload = response?.currencies || [];
      this.context.commit('SET_CURRENCY', payload);

      return { response, error };
    }

    @Action
    public async fetchProvidersAccounts(): Promise<IApiResponse<any>> {
      const { response, error } = await GateProviderRequests.getProviders();

      const payload = response?.records || [];
      this.context.commit('SET_PROVIDER_ACCOUNTS', payload);

      return { response, error };
    }

    @Action
    public async fetchIssuers(): Promise<IApiResponse<any>> {
      const { response, error } = await IssuersRequests.getIssuers();

      const payload = response?.records || [];
      this.context.commit('SET_ISSUERS', payload);

      return { response, error };
    }

    @Action
    public async fetchOperationFlows(): Promise<IApiResponse<any>> {
      const { response, error } = await CatalogsRequests.getOperationFlows();

      const payload = response?.records || [];
      this.context.commit('SET_OPERATION_FLOWS', payload);

      return { response, error };
    }

    @Action
    public async fetchPaymentProviders(data: IPaymentProviderBody): Promise<IApiResponse<any>> {
      const { response, error } = await GateRequests.getPaymentProviders(data);

      const payload = response?.records || [];
      this.context.commit('SET_PAYMENT_PROVIDERS', payload);

      return { response, error };
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

export const CatalogModule = getModule(Catalog);
