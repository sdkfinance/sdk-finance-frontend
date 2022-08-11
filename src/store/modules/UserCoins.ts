import {
  Action,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { WalletsRequests, ReportsRequests } from '@/services/requests';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { IReportsCoinDetails } from '@/services/requests/reports/Reports.types';
import { IApiResponse } from '@/types/interfaces';
import { Store } from 'vuex';

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
  public async fetchCoins(forceUpdate: boolean = false): Promise<IApiResponse<any>> {
    if (this.coinList.length && !forceUpdate) {
      return { response: { coins: this.coinList }, error: null };
    }

    const { response, error } = await WalletsRequests.getWallets();

    if (response) {
      const { coins } = response;

      this.context.commit('SET_USER_COINS', coins);
    }

    return { response, error };
  }

  @Action
  public async fetchCoinDetails(currency: string) {
    const { response, error } = await ReportsRequests.getCoinDetails(currency);

    if (response) {
      const { roundedTotalAmount, coinsDetail, symbol } = response;

      this.context.commit('SET_USER_COIN_DETAILS', coinsDetail.map((coin) => ({ ...coin, symbol })));
      this.context.commit('SET_USER_COIN_TOTAL_AMOUNT', roundedTotalAmount);
      this.context.commit('SET_USER_COIN_CURRENCY', currency);
    }

    return { response, error };
  }

}
