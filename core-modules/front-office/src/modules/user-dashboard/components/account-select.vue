<template>
  <app-select
    v-model="inputModel"
    full-width
    is-custom
    value-key="serial"
    :size="size"
    :placeholder="placeholder"
    :disabled="disabled"
    :label="label"
    :option-value="optionValue"
    :options="coinList"
    :option-label="() => ''">
    <template #prefix="{ currentItem }">
      <app-select-custom-option
        v-if="currentItem"
        :image="currentItem.image"
        :title="currentItem.name"
        :additional="getAmount(currentItem)" />
    </template>
    <template #option="{ scope }">
      <app-select-custom-option
        v-if="scope"
        :image="scope.image"
        :title="scope.name"
        :additional="getAmount(scope)" />
    </template>
  </app-select>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import { getDisplayAmount } from '@sdk5/shared/utils';
import type { TAppSelectSize } from '@sdk5/ui-kit-front-office';
import { APP_SELECT_SIZE, APP_SELECT_SIZES, AppSelect, AppSelectCustomOption } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../store/modules';

const sizeValidator = (size: string): boolean => APP_SELECT_SIZES.includes(size as TAppSelectSize);

const COMPONENTS = {
  AppSelectCustomOption,
  AppSelect,
} as const;
@Component({
  name: 'account-select',
  components: COMPONENTS,
})
export default class AccountSelect extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: String, default: 'placeholder.select.choose_account' }) readonly placeholder!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Array, default: null }) readonly coins!: ICoin[];

  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  @Prop({ type: String, default: null }) readonly optionValue!: string;

  @Prop({ default: APP_SELECT_SIZE.large, type: String as PropType<TAppSelectSize>, validator: sizeValidator }) readonly size!: TAppSelectSize;

  @Prop() readonly value!: any;

  $props!: {
    placeholder?: string;
    label?: string;
    coins?: ICoin[];
    disabled?: boolean;
    optionValue?: string;
    size?: TAppSelectSize;
    value?: any;
  };

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected get coinList(): ICoin[] {
    return this.coins ? this.coins : this.userCoinsModule.mappedCoins;
  }

  protected get inputModel(): any {
    return this.value;
  }

  protected set inputModel(value: any) {
    this.updateValue(value);
  }

  @Emit('input')
  @Emit('change')
  protected updateValue(value: any): any {
    return value;
  }

  protected getAmount(data: ICoin): string {
    const { currency, availableAmount } = data;
    const displayAmount = getDisplayAmount(availableAmount, 'displayAmount', { maximumFractionDigits: 2 });
    return currency ? `${currency.symbol}${displayAmount}` : '';
  }

  protected created(): void {
    if (!this.coins) {
      this.userCoinsModule.fetchCoins(true);
    }
  }
}
</script>
