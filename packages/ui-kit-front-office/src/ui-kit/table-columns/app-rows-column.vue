<template>
  <div class="app-rows-column">
    <div
      v-for="row in rows"
      :key="`row-${row}`"
      class="app-rows-column__row">
      <div class="app-rows-column__label">
        <slot :name="`label-${row}`" />
      </div>
      <div class="app-rows-column__value">
        <slot :name="`value-${row}`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppRowsColumn',
  props: {
    rows: { type: Number, default: 1 },
  },
});
</script>

<style lang="scss">
.app-rows-column {
  @apply text-gray-500 text-sm;

  &__row {
    @apply flex items-center mb-4;
  }

  &__label {
    @apply font-semibold mr-2;
  }
}
</style>
