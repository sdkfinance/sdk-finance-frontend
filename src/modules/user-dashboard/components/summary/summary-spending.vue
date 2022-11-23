<template>
  <div>
    <page-subtitle>
      {{ $t('pages.user_dashboard.summary.subtitle') }}
      <app-date-range-select
        v-model="date"
        :exclude-select-types="['all']"/>
    </page-subtitle>

    <slot v-bind="{ dateFilter, highestOutflowRecord }"/>

    <div v-resize:throttle="onResize">
      <page-subtitle>
        {{ $t('pages.user_dashboard.summary.spending_by_categories') }}
      </page-subtitle>
      <category-cards
        v-if="isMobile"
        v-loading="isCategoriesLoading"
        :data="transformedOutflowsRecords"/>
      <category-table
        v-else
        v-loading="isCategoriesLoading"
        :data="transformedOutflowsRecords"/>
    </div>
  </div>
</template>

<script lang="ts">

import dayjs, { Dayjs } from 'dayjs';
import {
  Component, Vue, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppDateRangeSelect from '@/components/ui-kit/app-date-range-select.vue';
import { categoryColors, getDynamicColor } from '@/components/ui-kit/colors';
import PageSubtitle from '@/modules/user-dashboard/components/page-subtitle.vue';
import CategoryCards from '@/modules/user-dashboard/components/summary/category-cards.vue';
import CategoryTable from '@/modules/user-dashboard/components/summary/category-table.vue';
import { ReportsRequests } from '@/services/requests';
import {
  IReportsCoinOutflowsRecord,
  IReportsCoinOutflowsRecordClient,
} from '@/services/requests/reports/Reports.types';
import { ITransactionCategoryRecord } from '@/services/requests/transaction-categories/TransactionCategories.types';
import { UserCoins } from '@/store/modules';
import Catalog from '@/store/modules/dynamic/Catalog';
import { IPlainObject } from '@/types/interfaces';
import { checkMobile, errorNotification } from '@/utils';

const DEFAULT_MONTH_PERIOD: [Dayjs, Dayjs] = [
  dayjs().startOf('month'),
  dayjs().endOf('month'),
];

@Component({
  components: {
    AppDateRangeSelect,
    PageSubtitle,
    CategoryTable,
    CategoryCards,
  },
})
export default class SummarySpending extends Vue {

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected catalogModule = getModule(Catalog, this.$store);

  protected serial: string = this.$route?.params?.serial || '';

  protected outflowsRecords: IReportsCoinOutflowsRecord[] = [];

  protected isMobile: boolean = false

  protected isCategoriesLoading: boolean = false;

  protected date: Array<Date|Dayjs> = DEFAULT_MONTH_PERIOD;

  protected get transactionCategories(): ITransactionCategoryRecord[] {
    return this.catalogModule.transactionCategories;
  }

  protected get currentCurrency(): string {
    return this.userCoinsModule.currentCurrency;
  }

  protected get dateFilter(): { from: string; to: string } | {} {
    const isDateValid = this.date.every((d: Date | Dayjs) => dayjs(d).isValid()) && this.date.length === 2;

    return isDateValid ? {
      from: dayjs(this.date[0]).format('YYYY-MM-DD'),
      to: dayjs(this.date[1]).format('YYYY-MM-DD'),
    } : {};
  }

  protected get transformedOutflowsRecords(): IReportsCoinOutflowsRecordClient[] {
    const getColor = getDynamicColor(categoryColors);

    return this.outflowsRecords.map((record) => ({
      ...record,
      color: getColor(),
      category: this.transactionCategories.find(({ id }) => id === record.categoryId) || {} as ITransactionCategoryRecord,
    }));
  }

  protected get highestOutflowRecord(): IReportsCoinOutflowsRecordClient | IPlainObject {
    return this.transformedOutflowsRecords.length
      ? this.transformedOutflowsRecords.sort((a, b) => b.sum - a.sum)[0]
      : {};
  }

  @Watch('currentCurrency', { immediate: true })
  @Watch('dateFilter')
  protected updateSummaryData() {
    this.fetchData();
  }

  protected async created(): Promise<void> {
    await this.catalogModule.fetchTransactionCategories();
    this.onResize();
  }

  protected onResize(): void {
    this.isMobile = checkMobile();
  }

  protected async fetchData(): Promise<void> {
    if (!this.currentCurrency) {
      return;
    }

    this.isCategoriesLoading = true;
    const { response, error } = this.serial
      ? await ReportsRequests.getCoinsOutflowsBySerial(this.serial, this.dateFilter)
      : await ReportsRequests.getCoinsOutflows({ currency: this.currentCurrency, ...this.dateFilter });
    this.isCategoriesLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.outflowsRecords = response?.records || [];
  }

}
</script>
