<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.transactions.title') }}
    </template>

    <tab-links
      :tabs="tabs"
      secondary/>

    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import MainHead from '@/components/main-head.vue';
import TabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';

@Component({
  components: {
    MainHead,
    DashboardContentLayout,
    TabLinks,
  },
})
export default class TransactionsPage extends Vue {

  @Prop({ type: Boolean, default: false }) readonly fullWidth!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isTitleVisible!: boolean;

  protected tabs = [
    {
      name: 'transactions-individuals',
      meta: {
        translation: 'pages.transactions.individuals',
      },
    },
    {
      name: 'transactions-corporate',
      meta: {
        translation: 'pages.transactions.corporate',
      },
    },
  ]

}
</script>
