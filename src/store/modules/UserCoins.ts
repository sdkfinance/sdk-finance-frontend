import { Store } from 'vuex';
import {
  Action,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

import { ReportsRequests, WalletsRequests } from '@/services/requests';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { IReportsCoinDetails } from '@/services/requests/reports/Reports.types';

@Module({ namespaced: true, name: 'UserCoins', store: {} as Store<any> })
export class UserCoins extends VuexModule {

  public coinList: ICoin[] = [];

  public coinDetails: IReportsCoinDetails[] = [];

  public currency: string = '';

  public totalAmount: number = 0;

  public get coins(): ICoin[] {
    return this.coinList;
  }

  public get mappedCoins(): ICoin[] {
    return this.coinList.map((item) => {
      const { currency } = item.issuer;

      item.image = `/images/currencies/${currency.toLowerCase()}.svg`;

      return item;
    });
  }

  public get totalBalance(): number {
    return this.totalAmount;
  }

  public get currentCurrency(): string {
    return this.currency;
  }

  @Mutation
  public SET_USER_COINS(coins: ICoin[]) {
    this.coinList = coins;
  }

  @Mutation
  public RESET_USER_COINS_DATA() {
    this.coinList = [];
    this.coinDetails = [];
    this.currency = '';
    this.totalAmount = 0;
  }

  @Mutation
  public SET_USER_COIN_DETAILS(coinDetails: IReportsCoinDetails[]) {
    this.coinDetails = coinDetails;
  }

  @Mutation
  public SET_USER_COIN_TOTAL_AMOUNT(amount: number) {
    this.totalAmount = amount;
  }

  @Mutation
  public SET_USER_COIN_CURRENCY(currency: string) {
    this.currency = currency;
  }

  @Action
  public async fetchCoins(forceUpdate: boolean = false) {
    if (this.coinList.length && !forceUpdate) {
      return { response: { coins: this.coinList }, error: null };
    }

    const request = await WalletsRequests.getWallets();

    if (request.response) {
      const { coins } = request.response;

      this.context.commit('SET_USER_COINS', coins);
    }

    return request;
  }

  @Action
  public async fetchCoinDetails(currency: string) {
    const request = await ReportsRequests.getCoinDetails(currency);

    if (request.response) {
      const { roundedTotalAmount, coinsDetail, symbol } = request.response;

      this.context.commit('SET_USER_COIN_DETAILS', coinsDetail.map((coin) => ({ ...coin, symbol })));
      this.context.commit('SET_USER_COIN_TOTAL_AMOUNT', roundedTotalAmount);
      this.context.commit('SET_USER_COIN_CURRENCY', currency);
    }

    return request;
  }

}
