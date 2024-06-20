<template>
  <summary-spending>
    <template #default="{ dateFilter, highestOutflowRecord }">
      <summary-cards
        :date-filter="dateFilter"
        :highest-outflow-record="highestOutflowRecord" />
    </template>
  </summary-spending>
</template>

<script setup lang="ts">
import SummaryCards from '../../../components/summary/summary-cards.vue';
import SummarySpending from '../../../components/summary/summary-spending.vue';
</script>
