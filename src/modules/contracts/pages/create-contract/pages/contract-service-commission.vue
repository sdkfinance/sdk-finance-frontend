<template>
  <app-form
    ref="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handlerForm">
    <commission-type-table-form
      :data="form.commissionData"/>
    <range-commission-table-form
      :data="form.rangeData"
      class="mb-32"/>
    <app-switch
      v-model="isLimits"
      label="form.label.limits"
      secondary
      is-label-after/>
    <limit-type-table-form :data="form.limitData"/>
    <div class="flex justify-center mt-48 max-w-300 ml-auto mr-auto">
      <app-button class="w-full">
        {{ $t('action.save_commission') }}
      </app-button>
    </div>
  </app-form>
</template>

<script lang="ts">

import { Component, Ref, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import CommissionTypeTableForm
  from '@/modules/contracts/pages/create-contract/components/commission-type-table-form.vue';
import LimitTypeTableForm from '@/modules/contracts/pages/create-contract/components/limit-type-table-form.vue';
import RangeCommissionTableForm
  from '@/modules/contracts/pages/create-contract/components/range-commission-table-form.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    LimitTypeTableForm,
    RangeCommissionTableForm,
    CommissionTypeTableForm,
    AppForm,
    AppSwitch,
    AppButton,
  },
})
export default class ContractServiceCommission extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected isLimits: boolean = true;

  protected form: IPlainObject = {
    commissionData: [1, 2, 3, 4].map(() => ({
      amountFrom: 0,
      amountTo: 0,
      type: 'fixed',
      fixed: 2,
      percent: 1,
    })),
    rangeData: [{
      minAmount: 0,
      maxAmount: 0,
    }],
    limitData: [1, 2, 3].map(() => ({
      type: 'Number of transactions',
      period: 'Per day',
      limits: '',
    })),
  }

  protected rules: IPlainObject = {
    commissionData: {
      amountFrom: SimpleRequiredValidationRule(),
      amountTo: SimpleRequiredValidationRule(),
      type: SimpleRequiredValidationRule(),
      fixed: SimpleRequiredValidationRule(),
      percent: SimpleRequiredValidationRule(),
    },
    rangeData: {
      minAmount: SimpleRequiredValidationRule(),
      maxAmount: SimpleRequiredValidationRule(),
    },
    limitData: {
      limits: SimpleRequiredValidationRule(),
    },
  }

  protected async handlerForm(): Promise<void> {
    // const isValid = await this.appForm.validate();
  }

}
</script>
