<template>
  <div class="tabs">
    <router-link
      v-for="tab in tabs"
      :key="tab.id"
      class="tabs__link"
      :to="toQuery(tab)"
      exact>
      {{ tab.sn }}
    </router-link>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import type { IPlainObject, IRouteConfig } from '@sdk5/shared/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'currency-tabs',
})
export default class CurrencyTabs extends Vue {
  @Prop({ required: true, type: Array }) readonly tabs!: IRouteConfig[];

  protected toQuery(tab: IPlainObject): IPlainObject {
    return { path: '/dashboard/currency-exchange', query: { currency: tab.sn } };
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles/tabs';
</style>
