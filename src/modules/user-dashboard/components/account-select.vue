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
        :additional="getAmount(currentItem)"/>
    </template>
    <template #option="{ scope }">
      <app-select-custom-option
        v-if="scope"
        :image="scope.image"
        :title="scope.name"
        :additional="getAmount(scope)"/>
    </template>
  </app-select>
</template>

<script lang="ts">

import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { UserCoins } from '@/store/modules';

const sizeValidator = (size: string): boolean => ['medium', 'small', 'mini', ''].includes(size);

@Component({
  components: {
    AppSelectCustomOption,
    AppSelect,
  },
})
export default class AccountSelect extends Vue {

  @Prop({ type: String, default: 'placeholder.select.choose_account' }) readonly placeholder!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Array, default: null }) readonly coins!: ICoin[];

  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  @Prop({ type: String, default: null }) readonly optionValue!: string;

  @Prop({ default: 'medium', type: String, validator: sizeValidator }) readonly size!: string;

  @Prop() readonly value!: any;

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
    return data?.issuer ? `${data.issuer.symbol}${data.availableAmount}` : '';
  }

  protected created(): void {
    if (!this.coins) {
      this.userCoinsModule.fetchCoins(true);
    }
  }

}
</script>
