<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-30">
    <information-details :info-list="professionList"/>

    <information-details :info-list="roleList"/>

    <information-details :info-list="addressList"/>

    <information-details :info-list="answeredList">
      <template #answeredQuestions="{ label, value }">
        <div class="flex">
          <div class="flex-grow">
            <p class="information-details__title">
              {{ label }}
            </p>
            <p class="information-details__subtitle">
              {{ value }}
            </p>
          </div>

          <app-button
            secondary
            :is-loading="isLoading"
            size="small">
            {{ $t('pages.customer.action.view_answer_list') }}
          </app-button>
        </div>
      </template>
    </information-details>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IInformationDetails } from '@/types/interfaces/InformationDetails.interface';

import InformationDetails from '@/modules/customers/pages/customer-details/components/information-details.vue';
import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: { AppButton, InformationDetails },
})
export default class AdditionalInformation extends Vue {

  protected isLoading: boolean = false;

  protected professionList: IInformationDetails[] = [
    { label: 'profession', value: 'merchant' },
    { label: 'marital status', value: 'Married' },
    { label: 'childrens', value: '0' },
    { label: 'TAX ID Country', value: 'Lithuania' },
    { label: 'car', value: 'Yes' },
    { label: 'real estate', value: 'Yes' },
    { label: 'time zone', value: 'GMT +3' },
  ]

  protected roleList: IInformationDetails[] = [
    { label: 'role', value: 'merchant' },
    { label: 'member since', value: '08.27.2019' },
    { label: 'login credentials', value: 'Phone number' },
    { label: 'system language', value: 'English' },
    { label: 'cohort', value: '64W' },
    { label: 'contract', value: 'Plus' },
    { label: 'pre-churn signal', value: 'No pre-churn signals' },
  ]

  protected addressList: IInformationDetails[] = [
    { label: 'address line', value: 'Gerosios Vilties g. 1-7' },
    { label: 'city', value: 'Vilnius' },
    { label: 'country', value: 'Lithuania' },
    { label: 'postal code', value: '03147' },
  ]

  protected answeredList: IInformationDetails[] = [
    { label: 'answered questions', value: '96 from 106', prop: 'answeredQuestions' },
    { label: 'segment groups', value: 'PC gamer, parents' },
  ]

}
</script>
