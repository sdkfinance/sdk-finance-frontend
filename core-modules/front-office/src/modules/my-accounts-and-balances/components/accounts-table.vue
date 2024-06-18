<template>
  <base-table-with-filters
    :table-columns="accountsTableColumns"
    :table-data="walletsWithFormatAmountFiltered">
    <template #filters>
      <app-input-range v-model="inputRangeModel" />
      <app-select
        v-model="selectedAccountType"
        :options="accountTypesSelectOptions"
        clearable
        option-label="label"
        option-value="value"
        placeholder="table.label.account_type"
        label="table.label.account_type" />
    </template>
    <template #actions>
      <app-button
        :size="APP_BUTTON_SIZE.medium"
        outlined
        @click="addAccountButtonClickHandler">
        {{ $t('action.add_account') }}
      </app-button>
    </template>
  </base-table-with-filters>
</template>

<script lang="ts">
import { COIN_TYPE_ENUM, COIN_TYPES_ARRAY } from '@sdk5/shared/constants';
import type { IWalletRecord } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { APP_BUTTON_SIZE, APP_BUTTON_TYPES, AppButton, AppInputRange, AppSelect, type TInputRangeProp } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import BaseTableWithFilters from './base-table-with-filters.vue';

const COMPONENTS = {
  AppButton,
  AppInputRange,
  AppSelect,
  BaseTableWithFilters,
} as const;

@Component({
  name: 'accounts-table',
  components: COMPONENTS,
})
export default class AccountsTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({
    type: Array as PropType<IWalletRecord[]>,
    default: () => [] as IWalletRecord[],
  })
  readonly wallets!: IWalletRecord[];

  $props!: {
    wallets?: IWalletRecord[];
  };

  protected readonly MERCHANT_ACCEPTABLE_ACCOUNT_TYPES = [COIN_TYPE_ENUM.client, COIN_TYPE_ENUM.cash, COIN_TYPE_ENUM.prepaid] as string[];

  protected readonly APP_BUTTON_SIZE = APP_BUTTON_SIZE;

  protected readonly APP_BUTTON_TYPES = APP_BUTTON_TYPES;

  protected readonly accountsTableColumns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'form.label.account_name',
      width: '160px',
      resizable: true,
    },
    {
      prop: 'balance',
      label: 'entity.transaction_types.balance',
      width: '140px',
      resizable: true,
    },
    {
      prop: 'type',
      label: 'table.label.account_type',
      width: '140px',
      resizable: true,
    },
    {
      prop: 'serial',
      label: 'filter.account_number',
    },
    {
      prop: 'action',
      actions: [
        {
          label: 'action.edit',
          actionFn: (rowScope: { row: IWalletRecord }) => {
            this.editActionClickHandler(rowScope.row);
          },
          buttonOptions: {
            type: APP_BUTTON_TYPES.secondary,
            outlined: false,
          },
        },
      ],
    },
  ];

  protected get accountTypesSelectOptions() {
    return COIN_TYPES_ARRAY.filter(({ value }) => this.MERCHANT_ACCEPTABLE_ACCOUNT_TYPES.includes(value));
  }

  protected selectedAccountType = '';

  protected inputRangeModel: TInputRangeProp = {
    min: undefined,
    max: undefined,
  };

  protected get walletsWithFormatAmount() {
    return this.wallets.map((wallet) => ({
      ...wallet,
      balance: typeof wallet.amount === 'number' ? Intl.NumberFormat().format(wallet.amount) : wallet.amount,
    }));
  }

  protected get walletsWithFormatAmountFiltered() {
    const { max, min } = this.inputRangeModel;
    return this.walletsWithFormatAmount.filter((wallet) => {
      const amountNumber = Number(wallet.amount);
      return (
        (typeof min !== 'number' || amountNumber >= min) &&
        (typeof max !== 'number' || amountNumber <= max) &&
        (!this.selectedAccountType || wallet.type === this.selectedAccountType)
      );
    });
  }

  protected addAccountButtonClickHandler() {
    this.emitAddAccountEvent();
  }

  protected editActionClickHandler(wallet: IWalletRecord) {
    if (!wallet) {
      return;
    }

    this.emitEditAccountEvent(wallet);
  }

  @Emit('add-account')
  protected emitAddAccountEvent() {}

  @Emit('edit-account')
  protected emitEditAccountEvent(wallet: IWalletRecord) {
    return wallet;
  }
}
</script>
