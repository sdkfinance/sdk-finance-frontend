<template>
  <div>
    <app-buttons-mobile>
      <template #mobile-visible>
        <app-button
          v-if="ENV_VARIABLES.makePaymentOperationsVisible"
          :to="{ name: 'user-make-payment-operations', params }"
          :disabled="isBusinessProcessOperationsDisabled"
          icon="icon-make-payment">
          {{ $t('action.make_payment') }}
        </app-button>
        <app-button
          :to="{ name: 'user-top-up-operations', params }"
          :disabled="isBusinessProcessOperationsDisabled"
          icon="icon-top-up">
          {{ $t('action.top_up') }}
        </app-button>
      </template>
      <app-button
        icon="icon-withdraw"
        :disabled="isBusinessProcessOperationsDisabled"
        :to="{ name: 'user-withdrawal-operations', params }">
        {{ $t('action.withdrawal') }}
      </app-button>
      <app-button
        v-if="ENV_VARIABLES.userDashboardExchangeVisible"
        :disabled="coinList.length < 2 || isBusinessProcessOperationsDisabled"
        icon="icon-exchange-alt"
        :to="{ name: 'user-exchange-operations', params }">
        {{ $t('action.exchange') }}
      </app-button>
      <app-button
        v-if="ENV_VARIABLES.userDashboardCurrencyRatesVisible"
        icon="icon-graph-bar"
        :to="{ name: 'user-currency-rates', params }">
        {{ $t('pages.user_dashboard.currency_rates.title') }}
      </app-button>
    </app-buttons-mobile>
  </div>
</template>

<script setup lang="ts">
import type { ICoin } from '@sdk5/shared';
import { ORGANIZATION_STATUS_ENUM } from '@sdk5/shared';
import { ENV_VARIABLES, useGetCurrentUserProfileApi } from '@sdk5/shared';
import { AppButton, AppButtonsMobile } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

withDefaults(
  defineProps<{
    coinList?: ICoin[];
  }>(),
  {
    coinList: () => [],
  },
);

const { userProfileStatus } = useGetCurrentUserProfileApi();

const route = useRoute();

const isUserProfileApproved = computed(() => userProfileStatus.value === ORGANIZATION_STATUS_ENUM.approved);
const isBusinessProcessOperationsDisabled = computed(() => ENV_VARIABLES.businessOperationKycRestrictionsEnabled && !isUserProfileApproved.value);
const params = computed(() => ({
  backName: route.name,
  ...(route.params || {}),
}));
</script>
