<template>
  <app-select
    v-model="form.to"
    full-width
    is-custom
    value-key="serial"
    placeholder="form.label.choose_account_or_recipient"
    label="form.label.choose_account_or_recipient"
    :options="recipientList"
    :option-label="() => ''">
    <template #prefix="{ inputModel }">
      <app-select-custom-option
        :image="inputModel.image"
        :title="inputModel.name"
        :additional="getAmount(inputModel)" />
    </template>
    <template #default="{ options }">
      <app-input
        v-model="search"
        class="px-10 my-15"
        prefix-icon="icon-search"
        placeholder="Search" />
      <app-select-group
        :options="options"
        group-classes="app-select-group"
        option-classes="app-select-option">
        <template #option="{ option, group }">
          <app-select-custom-option
            v-if="group.type === 'account'"
            class="min-h-40"
            :image="option.image"
            :title="option.name"
            :additional="getAmount(option)" />
          <app-contact-item
            v-else
            with-logo
            :first-name="option.firstName"
            :last-name="option.lastName"
            :subtitle="option.id" />
        </template>
      </app-select-group>
    </template>
  </app-select>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import { AppCustomSelectOption, AppInput, AppSelect, AppSelectCustomOption, AppSelectGroup } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../store/modules';

type IPlainObject = Record<string, unknown>;

const COMPONENTS = {
  AppSelectCustomOption,
  AppContactItem: AppCustomSelectOption,
  AppSelectGroup,
  AppInput,
  AppSelect,
} as const;

@Component({
  name: 'accounts-contacts-select',
  components: COMPONENTS,
})
export default class AccountsContactsSelect extends Vue {
  static components: typeof COMPONENTS;
  // ATTENTION
  // This is temperary solution for this component, we are waiting for the answers of our product owner.

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected search: string = '';

  protected form: IPlainObject = {
    to: '',
  };

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected get recipientList(): IPlainObject[] {
    return [
      {
        label: 'My account',
        type: 'account',
        options: this.coinList,
      },
      {
        label: 'Last transactions',
        type: 'list',
        options: [
          {
            firstName: 'John',
            lastName: 'Doe',
            id: 'AT483200000012345864',
          },
          {
            firstName: 'John',
            lastName: 'Doe',
            id: 'AT483200000012345864',
          },
          {
            firstName: 'John',
            lastName: 'Doe',
            id: 'AT483200000012345864',
          },
        ],
      },
    ];
  }

  protected getAmount(data: ICoin): string {
    if (data?.currency) {
      return `${data.currency.symbol}${data.availableAmount}`;
    }

    return '';
  }
}
</script>
