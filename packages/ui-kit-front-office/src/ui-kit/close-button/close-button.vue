<template>
  <app-button
    only-icon
    transparent
    size="small"
    icon="icon-close"
    @click="onClickHandler" />
</template>

<script setup lang="ts">
import { AppButton } from '../../ui-framework/app-button';

const emit = defineEmits<{
  (event: 'click'): void;
}>();

const onClickHandler = () => {
  emit('click');
};
</script>

<style lang="scss">
.btn-close {
  position: relative;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background-color: $input-color;
  font-size: 18px;
  border: none;

  &::after,
  &::before {
    @extend %center;

    content: '';
    height: 16px;
    width: 2px;
    background-color: #8e9caf;
    transition: transform 0.3s;
  }

  &::after {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &:hover {
    background-color: $primary-color;

    &::after,
    &::before {
      background-color: #fff;
    }
  }
}
</style>
