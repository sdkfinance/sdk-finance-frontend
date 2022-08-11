<template>
  <div class="form-block">
    <div class="form-block__title">
      {{ $t(title) }}
    </div>
    <div class="form-block__separation"/>
    <div
      class="form-block__additional"
      :style="{ height: additionalHeight }">
      <slot name="additional"/>
    </div>
    <div class="form-block__body">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FormBlock extends Vue {

  @Prop({ default: '', type: String }) private title!: string;

  @Prop({ default: 'auto', type: String }) private additionalHeight!: string;

}

</script>

<style lang="scss">
  .form-block {
    &__title {
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
    }

    &__separation {
      width: 100%;
      height: 2px;
      background: $border-color;
      margin: 15px 0;
    }

    &__additional {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 10px;
    }
  }
</style>
