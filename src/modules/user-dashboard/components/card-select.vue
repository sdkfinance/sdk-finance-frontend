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
    :options="smartCardsList">
    <template #prefix="{ currentItem }">
      <app-select-custom-option
        v-if="currentItem"
        :title="currentItem.cardNumber"
        :additional="`${currentItem.availableAmount} ${currentItem.currencyCode}`"/>
    </template>
    <template #option="{ scope }">
      <app-select-custom-option
        v-if="scope"
        :title="scope.cardNumber"
        :additional="`${scope.availableAmount} ${scope.currencyCode}`"/>
    </template>
  </app-select>
</template>

<script lang="ts">

import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { ISmartCardRecord } from '@/services/requests/smart-cards/SmartCards.types';
import { SmartCardsRequests } from '@/services/requests/smart-cards/SmartCardsRequests';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppSelectCustomOption,
    AppSelect,
  },
})
export default class AccountSelect extends Vue {

  @Prop({ type: String, default: 'placeholder.select.choose_card' }) readonly placeholder!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Array, default: null }) readonly smartCards!: ISmartCardRecord[];

  @Prop() readonly value!: any;

  protected fetchedSmartCards: ISmartCardRecord[] = [];

  protected get smartCardsList(): ISmartCardRecord[] {
    return this.smartCards ? this.smartCards : this.fetchedSmartCards;
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
