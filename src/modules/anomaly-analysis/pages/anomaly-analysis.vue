<template>
  <section class="main-section anomaly-analysis">
    <iframe
      width="100%"
      height="100%"
      src="https://dash.sdk.finance/"
      frameborder="0"
      allowFullScreen="true"/>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AnomalyAnalysis extends Vue {}
</script>

<style lang="scss" scoped>
  .main-section.anomaly-analysis {
    padding: 37px 0 0 31px;
  }
</style>
