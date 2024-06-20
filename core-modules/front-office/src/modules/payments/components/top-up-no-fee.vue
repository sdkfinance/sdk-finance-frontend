<template>
  <div class="no-fee">
    <div class="no-fee__icon">i</div>
    {{ $t('other.no_fee') }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'top-up-no-fee',
})
export default class TopUpNoFee extends Vue {}
</script>

<style lang="scss" scoped>
.no-fee {
  @apply text-blue-600 text-base flex items-center;

  &__icon {
    @apply w-18 h-18 rounded-full flex justify-center items-center;
    @apply leading-none bg-blue-300 text-primary text-11 font-bold mr-8;
  }
}
</style>
