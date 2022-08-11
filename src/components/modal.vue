<template>
  <transition name="modal-fade">
    <div
      v-show="visible"
      ref="overlay"
      class="modal-overlay">
      <div
        ref="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
        :style="`width: ${width}`"
        :class="['modal', { 'is-header-fixed': fixedHeader }]">
        <header class="modal__header">
          <slot name="title">
            <button
              type="button"
              class="modal__back-btn view-icon icon-back desktop-hidden btn-default"
              aria-label="Close modal"
              @click="closeModal"/>

            <h2
              v-if="title"
              class="modal__header-title">
              {{ $t(title) }}
            </h2>
          </slot>
          <close-button
            class="modal__close mobile-hidden"
            @click="closeModal"/>
        </header>

        <section class="modal__body">
          <slot v-if="visible"/>
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  Component, Prop, Watch, Model, Emit, Vue,
} from 'vue-property-decorator';
import CloseButton from '@/components/close-button.vue';

function preventDefault(e: Event) {
  const evt = e || window.event;

  if (evt.preventDefault) {
    evt.preventDefault();
  }

  evt.returnValue = false;
}

@Component({
  components: {
    CloseButton,
  },
})
export default class Modal extends Vue {

  @Model('change', { type: Boolean }) readonly visible!: boolean

  @Prop({ default: '375px', type: String }) private width!: string;

  @Prop({ default: '', type: String }) private title!: string;

  @Prop({ default: false, type: Boolean }) private fixedHeader!: boolean;

  get scrollWidth(): number {
    return window.innerWidth - document.body.clientWidth;
  }

  @Watch('visible')
  onVisibleChange(value: boolean) {
    const element: HTMLElement = document.body;

    if (value) {
      element.style.paddingRight = `${this.scrollWidth}px`;
      element.classList.add('scroll-hidden');
      document.addEventListener('touchmove', preventDefault, { passive: true });
      window.addEventListener('touchmove', preventDefault, { passive: true });
    } else {
      element.classList.remove('scroll-hidden');
      document.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      element.style.paddingRight = '0px';
    }

  }

  @Emit('change')
  closeModal(): boolean {
    return false;
  }

  onKeyUpHandler(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  created() {
    window.addEventListener('keyup', this.onKeyUpHandler);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.onKeyUpHandler);
  }

}

</script>

<style lang="scss">

.modal-overlay {
  overflow: hidden !important;
  transition: opacity 0.2s;
  backface-visibility: visible;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  background-color: rgba(#000, 0.5);
}

.modal {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  margin: 0;
  background-color: #fff;
  z-index: 20;
  transition: transform 0.5s;
  overflow: auto;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 767px) {
    width: 100% !important;
  }

  .btn-submit {
    &.el-button {
      font-size: 16px;
    }
  }

  &__body,
  &__header {
    padding-left: 24px;
    padding-right: 24px;
  }

  &__header {
    padding-top: 46px;
    padding-bottom: 9px;
    padding-right: 46px;
    background-color: #fff;
    font-size: 28px;
    flex-shrink: 0;

    @media only screen and (max-width: 767px) {
      display: flex;
      padding-top: 35px;
      font-size: 38px;
    }

    &-title {
      font-size: 28px;
      font-weight: 600;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 0;
      font-size: inherit;
      width: 315px;
      word-break: break-word;
    }
  }

  &__body {
    padding-top: 9px;
    padding-bottom: 30px;
    flex-grow: 1;

    .filter-range-wrap {
      padding-top: 0;
    }

    .data-filter {
      margin-bottom: 0;
    }

    .el-form {
      margin-top: 18px;
    }

    .el-form .el-form-item__content {
      line-height: 19px;
    }

    .el-form-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 24px;
    }

    .el-form-item__label {
      flex-basis: auto;
      padding: 0;
      margin: 0 0 12px 0;
    }
  }

  &.is-header-fixed {
    .modal__header {
      position: fixed;
      top: 0;
      width: inherit;
      z-index: 1002;
    }

    .modal__body {
      padding-top: 130px;
    }
  }

  &__back-btn {
    align-self: flex-start;
  }

  &__close {
    top: 20px;
    right: 20px;

    &.btn-close {
      position: absolute;
    }
  }

  @media only screen and (max-width: 767px) {
    .details {
      &__row {
        align-items: stretch;
      }

      &__label {
        width: 50%;
        min-width: auto;
      }
    }
  }

  .modal__body .el-form-item--switch {
    flex-direction: row;
    align-content: center;

    .switch-status {
      line-height: 20px;
      padding-left: 12px;
      font-weight: 500;
      font-size: 14px;
      color: $placeholder-color;

      &--active {
        color: $success-color;
      }
    }

    .el-form-item__label {
      width: 100px;
      margin: 0;
    }

    .el-form-item__content {
      display: flex;
      align-self: flex-end;
      justify-content: flex-end;
      align-content: center;
    }
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;

  .modal {
    transform: translateX(100%);
  }
}
</style>
