<template>
  <transition name="modal-fade">
    <div
      v-show="visible"
      ref="overlay"
      class="modal-overlay front-office-modal">
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
              @click="closeModal" />

            <h2
              v-if="title"
              class="modal__header-title">
              {{ $t(title) }}
            </h2>
          </slot>
          <close-button
            class="modal__close mobile-hidden"
            @click="closeModal" />
        </header>

        <section class="modal__body">
          <slot
            v-if="visible"
            v-bind="{ reject, confirm }" />
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';

import { CloseButton } from '../close-button';

function preventDefault(e: Event) {
  const evt = e || window.event;

  if (evt.preventDefault) {
    evt.preventDefault();
  }

  evt.returnValue = false;
}

export default defineComponent({
  name: 'Modal',
  components: {
    CloseButton,
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    width: { default: '340px', type: String as PropType<`${string}px`> },
    title: { default: '', type: String },
    fixedHeader: { default: false, type: Boolean },
    visible: { type: Boolean },
  },
  setup(props, { emit }) {
    const scrollWidth = computed(() => window.innerWidth - document.body.clientWidth);

    const rejectModal = ref(() => {});
    const confirmModal = ref(() => {});

    const closeModal = () => {
      emit('change', false);
    };

    const openModal = () => {
      emit('change', true);
      return new Promise<boolean>((resolve) => {
        rejectModal.value = () => {
          closeModal();
          resolve(false);
        };
        confirmModal.value = () => {
          closeModal();
          resolve(true);
        };
      });
    };

    const onKeyUpHandler = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };

    watch(
      () => props.visible,
      (value: boolean) => {
        const element: HTMLElement = document.body;

        if (value) {
          element.style.paddingRight = `${scrollWidth.value}px`;
          element.classList.add('scroll-hidden');
          document.addEventListener('touchmove', preventDefault, { passive: true });
          window.addEventListener('touchmove', preventDefault, { passive: true });
        } else {
          element.classList.remove('scroll-hidden');
          document.removeEventListener('touchmove', preventDefault);
          window.removeEventListener('touchmove', preventDefault);
          element.style.paddingRight = '0px';
        }
      },
    );

    onBeforeMount(() => {
      window.addEventListener('keyup', onKeyUpHandler);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keyup', onKeyUpHandler);
    });

    return {
      scrollWidth,
      closeModal,
      confirm: confirmModal,
      reject: rejectModal,
      openModal,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/tools/variables';

.front-office-modal {
  &.modal-overlay {
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
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

    &__close {
      @apply top-0 left-0 right-0 bottom-0;
    }

    @media only screen and (max-width: 767px) {
      width: 100% !important;
    }

    .btn-submit {
      &.el-button {
        font-size: 16px;
      }
    }

    &__header {
      @apply pt-[1.5rem] px-[1.5rem] text-[1.375rem] flex items-start justify-between bg-gray-100 mb-[1.5rem];

      flex-shrink: 0;

      @media only screen and (max-width: 767px) {
        display: flex;
        padding-top: 35px;
        font-size: 38px;
      }

      &-title {
        @apply text-[1.375rem] leading-[2rem] font-semibold text-gray-500;
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
      @apply px-[1.5rem] pb-[2rem] h-full overflow-auto;

      flex-grow: 1;

      .filter-range-wrap {
        padding-top: 0;
      }

      .data-filter {
        margin-bottom: 0;
      }

      .el-form {
        @apply mt-0;
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
        margin: 0 0 12px;
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
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;

  .modal {
    transform: translateX(100%);
  }
}
</style>
