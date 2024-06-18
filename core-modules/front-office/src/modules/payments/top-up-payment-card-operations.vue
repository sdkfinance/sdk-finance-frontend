<template>
  <top-up-operations-container>
    <template #default>
      <app-list-link
        :to="{ name: 'user-corefy-top-up', params: $route.params }"
        :icon-path="corefyIcon"
        title="pages.user_dashboard.payments.corefy" />
      <app-list-link
        :to="{ name: 'user-top-up-card', params: $route.params }"
        icon="icon-card"
        title="pages.user_dashboard.payments.debit_card" />
    </template>
  </top-up-operations-container>
</template>

<script lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import corefyIcon from '../../assets/icons/corefy.svg';
import TopUpOperationsContainer from './components/top-up-operations-container.vue';

const COMPONENTS = {
  AppListLink,
  TopUpOperationsContainer,
} as const;

@Component({
  name: 'top-up-payment-card-operations',
  components: COMPONENTS,
})
export default class TopUpCardOperations extends Vue {
  static components: typeof COMPONENTS;

  protected readonly corefyIcon = corefyIcon;
}
</script>
