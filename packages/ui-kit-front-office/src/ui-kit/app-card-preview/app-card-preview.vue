<template>
  <div
    class="app-card-preview"
    :style="{ backgroundImage: `url('/images/card/card-bg-gray.svg')` }">
    <div class="app-card-preview__header">
      <img
        src="/images/icons/masterpass-lg.svg"
        alt="MC"
        class="app-card-preview__header-icon" />
    </div>
    <div class="app-card-preview__body">
      <span
        v-for="(num, i) in cardNumberArray"
        :key="i"
        >{{ num }}</span
      >
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppCardPreview',
  props: {
    cardNumber: { type: String, default: '' },
    fullName: { type: String, default: '' },
    expDate: { type: String, default: '' },
  },
  computed: {
    cardNumberArray(): string[] {
      return this.cardNumber.match(/.{1,4}/g) ?? [];
    },
  },
});
</script>

<style lang="scss">
.app-card-preview {
  @apply w-268 h-168 flex flex-col justify-between rounded-lg px-16 py-16 overflow-hidden bg-center bg-cover;

  box-shadow: 0 12px 25px 0 rgb(15 51 107 / 25%);

  &__haeder {
    &-icon {
      @apply max-w-40 h-auto;
    }
  }

  &__body {
    @apply text-center text-lg leading-[1.5rem] text-white font-bold flex items-center justify-between font-nunito;

    letter-spacing: 1.6px;
  }

  &__footer {
    @apply flex justify-between items-center text-base font-medium text-white;
  }

  &__name {
    @apply text-base leading-[1.5rem] font-medium;

    letter-spacing: 0.266px;
  }

  &__date {
    @apply font-nunito text-base leading-[1.5rem] font-semibold;

    letter-spacing: 1.4px;
  }
}
</style>
