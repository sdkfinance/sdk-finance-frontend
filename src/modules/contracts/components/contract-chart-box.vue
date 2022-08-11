<template>
  <div class="contract-chart-box">
    <div class="contract-chart-box__header">
      <div class="contract-chart-box__header-title">
        <slot name="title"/>
      </div>
      <div class="contract-chart-box__header-value">
        <slot name="value"/>
      </div>
    </div>
    <div class="contract-chart-box__body">
      <div class="contract-chart-box__chart">
        <slot name="chart"/>
      </div>
      <div class="contract-chart-box__data">
        <div class="contract-chart-box__data-item">
          <slot name="data"/>
        </div>
        <div class="contract-chart-box__data-item">
          <slot name="data-bottom"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';

@Component
export default class ContractChartBox extends Vue {

}
</script>

<style lang="scss">
.contract-chart-box {
  @apply max-w-400 w-full;

  &__header {
    @apply flex items-center justify-between text-gray-500 text-lg mb-26;
  }

  &__body {
    @apply flex justify-between;
  }

  &__data {
    @apply flex flex-col justify-between;
  }
}
</style>
