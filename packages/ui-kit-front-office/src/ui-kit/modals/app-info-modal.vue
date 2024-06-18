<template>
  <app-form-wrapper>
    <div class="app-info-modal">
      <img
        :src="currentType.icon"
        alt=""
        class="app-info-modal__icon" />
      <div class="app-info-modal__title">
        <slot name="title">
          {{ $t(title) }}
        </slot>
      </div>
      <div class="app-info-modal__subtitle">
        <slot name="subtitle">
          {{ $t(subtitle) }}
        </slot>
      </div>
      <slot />
      <div
        class="app-info-modal__buttons"
        :class="{ 'app-info-modal__buttons--row': isButtonsInRow }">
        <app-button @click="onConfirm">
          {{ $t(confirmText) }}
        </app-button>
        <app-button
          v-if="isCancelVisible"
          class="app-info-modal__cancel"
          secondary
          outlined
          @click="onCancel">
          {{ $t(cancelText) }}
        </app-button>
      </div>
    </div>
  </app-form-wrapper>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import errorIcon from '../../assets/icons/error.svg';
import successIcon from '../../assets/icons/success.svg';
import warningIcon from '../../assets/icons/warning.svg';
import { AppButton } from '../../ui-framework/app-button';
import AppFormWrapper from './app-form-wrapper.vue';
import { InfoModalTypes } from './app-info-modal/constants';
import type { TModalType, TModalTypes } from './app-info-modal/types';

const modalTypes: Record<TModalTypes, TModalType> = {
  [InfoModalTypes.warning]: {
    icon: warningIcon,
  },
  [InfoModalTypes.success]: {
    icon: successIcon,
  },
  [InfoModalTypes.error]: {
    icon: errorIcon,
  },
};

export default defineComponent({
  name: 'AppInfoModal',
  components: {
    AppFormWrapper,
    AppButton,
  },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    type: {
      type: String as PropType<TModalTypes>,
      required: true,
      validator: (value: string): boolean => {
        return Object.keys(modalTypes).includes(value);
      },
    },
    confirmText: { type: String, default: 'action.confirm' },
    cancelText: { type: String, default: 'action.cancel' },
    isCancelVisible: { type: Boolean, default: true },
    isButtonsInRow: { type: Boolean, default: false },
  },
  computed: {
    currentType(): TModalType {
      return modalTypes[this.type];
    },
  },
  methods: {
    onConfirm() {
      this.$emit('confirm', true);
    },
    onCancel() {
      this.$emit('cancel', true);
    },
  },
});
</script>

<style lang="scss">
.app-info-modal {
  @apply flex flex-col items-center justify-center text-center  w-full max-w-520;

  &__icon {
    @apply max-w-100 h-auto mb-48;
  }

  &__title {
    @apply font-semibold text-2xl text-gray-500 mb-16 whitespace-pre-line;
  }

  &__subtitle {
    @apply font-medium text-lg text-blue-500 mb-36 w-full max-w-300;
  }

  &__buttons {
    @apply grid grid-flow-row justify-center items-center w-full gap-y-[1rem];

    &--row {
      @apply flex flex-row-reverse justify-center;

      .app-info-modal__cancel {
        @apply mr-14 w-auto #{!important};
      }

      button {
        @apply max-w-240 mb-0 #{!important};
      }
    }

    button {
      @apply w-[230px];
      @apply mx-0 #{!important};
    }
  }
}
</style>
