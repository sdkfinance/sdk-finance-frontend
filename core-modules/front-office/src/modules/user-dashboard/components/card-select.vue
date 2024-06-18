<template>
  <app-select
    v-model="inputModel"
    full-width
    is-custom
    value-key="id"
    :placeholder="placeholder"
    :label="label"
    option-value="id"
    option-label="cardNumber"
    :size="size"
    :options="smartCardsWithFormatAmount">
    <template #prefix="{ currentItem }">
      <app-select-custom-option
        v-if="currentItem"
        :title="currentItem.cardNumber"
        :additional="`${currentItem.displayAmount} ${currentItem.currencyCode}`" />
    </template>
    <template #option="{ scope }">
      <app-select-custom-option
        v-if="scope"
        :title="scope.cardNumber"
        :additional="`${scope.displayAmount} ${scope.currencyCode}`" />
    </template>
  </app-select>
</template>

<script lang="ts">
import { SmartCardsRequests } from '@sdk5/shared/requests';
import type { ISmartCardRecord } from '@sdk5/shared/types';
import { errorNotification, getDisplayAmount } from '@sdk5/shared/utils';
import type { TAppSelectSize } from '@sdk5/ui-kit-front-office';
import { APP_SELECT_SIZE, AppSelect, AppSelectCustomOption } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppSelectCustomOption,
  AppSelect,
} as const;

@Component({
  name: 'card-select',
  components: COMPONENTS,
})
export default class AccountSelect extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: String, default: 'placeholder.select.choose_card' }) readonly placeholder!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Array, default: null }) readonly smartCards!: ISmartCardRecord[];

  @Prop({ type: String as PropType<TAppSelectSize>, default: APP_SELECT_SIZE.large }) readonly size!: TAppSelectSize;

  @Prop() readonly value!: any;

  $props!: {
    placeholder?: string;
    label?: string;
    smartCards?: ISmartCardRecord[];
    size?: TAppSelectSize;
    value?: any;
  };

  protected fetchedSmartCards: ISmartCardRecord[] = [];

  protected get smartCardsList(): ISmartCardRecord[] {
    return this.smartCards ? this.smartCards : this.fetchedSmartCards;
  }

  protected get smartCardsWithFormatAmount() {
    return this.smartCardsList.map((card) => ({
      ...card,
      displayAmount: getDisplayAmount(card.availableAmount, 'displayAmount', { maximumFractionDigits: 2 }),
    }));
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

  protected async getUserSmartCards() {
    const { response, error } = await SmartCardsRequests.getUserCards();

    if (error) {
      errorNotification(error);
      return;
    }

    this.fetchedSmartCards = response?.records?.filter(({ active }) => active) || [];
  }

  protected created(): void {
    if (!this.smartCards) {
      this.getUserSmartCards();
    }
  }
}
</script>
