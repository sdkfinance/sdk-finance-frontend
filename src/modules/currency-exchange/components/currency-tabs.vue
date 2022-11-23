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
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import { IPlainObject, IRouteConfig } from '@/types/interfaces';

@Component
export default class CurrencyTabs extends Vue {

  @Prop({ required: true, type: Array }) readonly tabs!: IRouteConfig[];

  protected toQuery(tab: IPlainObject): IPlainObject {
    return { path: '/dashboard/currency-exchange', query: { currency: tab.sn } };
  }

}

</script>

<style lang="scss">
@import "~@/assets/styles/parts/tabs";
</style>
