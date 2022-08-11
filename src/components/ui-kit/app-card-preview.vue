<template>
  <div
    class="app-card-preview"
    :style="{backgroundImage: `url('/images/card/card-bg-gray.svg')`}">
    <div class="app-card-preview__header">
      <img
        src="/images/icons/masterpass-lg.svg"
        alt="MC"
        class="app-card-preview__header-icon">
    </div>
    <div class="app-card-preview__body">
      <span
        v-for="(num, i) in cardNumberArray"
        :key="i">{{ num }}</span>
    </div>
    <div class="app-card-preview__footer">
      <div class="app-card-preview__name">
        {{ fullName }}
      </div>
      <div class="app-card-preview__date">
        {{ expDate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppCardPreview extends Vue {

  @Prop({ type: String, default: '' }) readonly cardNumber!: string;

  @Prop({ type: String, default: '' }) readonly fullName!: string;

  @Prop({ type: String, default: '' }) readonly expDate!: string;

  protected get cardNumberArray(): string[] {
    return this.cardNumber.split('-');
  }

}
</script>

<style lang="scss">
.app-card-preview {
  @apply w-268 h-168 flex flex-col justify-between rounded-lg px-16 py-16 overflow-hidden bg-center bg-cover;

  filter: drop-shadow(0 12px 25px rgba(15, 51, 107, 0.25));

  &__haeder {
    &-icon {
      @apply max-w-40 h-auto;
    }
  }

  &__body {
    @apply text-center text-lg text-white font-semibold flex items-center justify-between;

    letter-spacing: 0.1em;
  }

  &__footer {
    @apply flex justify-between items-center text-base font-medium text-white;
  }

  &__date {
    letter-spacing: 0.1em;
  }
}
</style>
