<template>
  <div
    class="wallet-action-button"
    role="button"
    @click="$emit('click')">
    <div :class="['wallet-action-button__icon', icon]"/>
    <div class="wallet-action-button__title">
      {{ $t(title) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ActionButton extends Vue {

  @Prop({ type: String, default: '' }) readonly icon!: string;

  @Prop({ type: String, default: '' }) readonly title!: string;

}
</script>

<style lang="scss">
.wallet-action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4eaf3;
  border-radius: 8px;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  transition: box-shadow 0.5s;
  margin: 0 6px 12px;
  max-width: 135px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 16px #f0f7fd;
  }

  &__icon {
    color: $primary-color;
    margin-bottom: 16px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    color: $text-dark;
    height: calc(2em * 1.25);
    line-height: 1.25;
  }
}
</style>
