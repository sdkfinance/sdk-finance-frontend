<template>
  <div class="information-details">
    <div
      v-for="({ label, value, prop }) in infoList"
      :key="label"
      class="information-details__content">
      <slot
        :name="prop"
        v-bind="{ label, value }">
        <p class="information-details__title">
          {{ label }}
        </p>
        <p class="information-details__subtitle">
          {{ value }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IInformationDetails } from '@/types/interfaces/InformationDetails.interface';

@Component
export default class InformationDetails extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly infoList!: IInformationDetails[];

  @Prop({ type: String, default: '' }) readonly status!: string;

}
</script>

<style lang="scss">
.information-details {
  @apply px-32 py-24 bg-gray-350;

  &__content {
    @apply mb-10;
  }

  &__title {
    @apply mb-5 text-sm text-blue-500 font-medium capitalize;
  }

  &__subtitle {
    @apply text-gray-500 font-medium;
  }
}
</style>
