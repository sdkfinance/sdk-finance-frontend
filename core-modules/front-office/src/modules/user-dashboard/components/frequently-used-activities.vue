<template>
  <div>
    <app-buttons-mobile>
      <template #mobile-visible>
        <app-button
          :to="{ name: 'user-make-payment-operations', params }"
          icon="icon-make-payment">
          {{ $t('action.make_payment') }}
        </app-button>
        <app-button
          :to="{ name: 'user-top-up-operations', params }"
          icon="icon-top-up">
          {{ $t('action.top_up') }}
        </app-button>
      </template>
      <app-button
        icon="icon-withdraw"
        :to="{ name: 'user-withdrawal-operations', params }">
        {{ $t('action.withdrawal') }}
      </app-button>
      <app-button
        :disabled="coinList.length < 2"
        icon="icon-exchange-alt"
        :to="{ name: 'user-exchange-operations', params }">
        {{ $t('action.exchange') }}
      </app-button>
      <app-button
        icon="icon-graph-bar"
        :to="{ name: 'user-currency-rates', params }">
        {{ $t('pages.user_dashboard.currency_rates.title') }}
      </app-button>
    </app-buttons-mobile>
  </div>
</template>

<script setup lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
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

const route = useRoute();

const params = computed(() => ({
  backName: route.name,
  ...(route.params || {}),
}));
</script>
