<template>
  <button
    type="button"
    class="btn-close"
    aria-label="Close modal"
    @click="onClickHandler"/>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {

  @Emit('click')
  onClickHandler(): boolean {
    return false;
  }

}
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

    content: "";
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
