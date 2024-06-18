<template>
  <div class="api-list">
    <api-list-table
      :api-list="apiListRecords"
      :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import type { TApiRecordItem } from '@sdk5/shared/requests';
import { ActuatorRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { onBeforeMount, ref } from 'vue';

import ApiListTable from '../components/api-list-table.vue';

const isLoading = ref(false);
const apiListRecords = ref<TApiRecordItem[]>([]);

const fetchApiList = async () => {
  isLoading.value = true;
  const { response, error } = await ActuatorRequests.fetchApiList();
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  apiListRecords.value = response.records;
};

onBeforeMount(() => {
  fetchApiList();
});
</script>

<style lang="scss">
.api-list {
  @apply my-[2rem];
}
</style>
