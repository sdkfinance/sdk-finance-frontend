<template>
  <div class="switch-block">
    <h3 class="switch-block__title">
      {{ $t(title) }}
    </h3>
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SwitchBlock extends Vue {

  @Prop({ default: '', type: String }) private title!: string;

}

</script>

<style lang="scss">
  .switch-block {
    margin-top: 25px;
    margin-bottom: 20px;

    &__title {
      font-weight: 600;
      font-size: 12px;
      line-height: 15px;
      margin-top: 0;
      margin-bottom: 10px;
    }

    .app-switch {
      margin-bottom: 5px;
    }
  }
</style>
