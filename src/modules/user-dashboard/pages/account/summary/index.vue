<template>
  <summary-spending>
    <template #default="{ dateFilter, highestOutflowRecord }">
      <summary-cards
        :date-filter="dateFilter"
        :highest-outflow-record="highestOutflowRecord"/>
    </template>
  </summary-spending>
</template>

<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';

import PageSubtitle from '@/modules/user-dashboard/components/page-subtitle.vue';
import CategoryCards from '@/modules/user-dashboard/components/summary/category-cards.vue';
import CategoryTable from '@/modules/user-dashboard/components/summary/category-table.vue';
import SummaryCards from '@/modules/user-dashboard/components/summary/summary-cards.vue';
import SummarySpending from '@/modules/user-dashboard/components/summary/summary-spending.vue';

@Component({
  components: {
    PageSubtitle,
    SummarySpending,
    SummaryCards,
    CategoryTable,
    CategoryCards,
  },
})
export default class SummaryPage extends Vue {}
</script>
