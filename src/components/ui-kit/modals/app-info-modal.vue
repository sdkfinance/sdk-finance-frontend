<template>
  <app-form-wrapper>
    <div class="app-info-modal">
      <img
        :src="currentType.icon"
        alt=""
        class="app-info-modal__icon">
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
      <slot/>
      <div
        class="app-info-modal__buttons"
        :class="{'app-info-modal__buttons--row': isButtonsInRow}">
        <app-button @click="onConfirm">
          {{ $t(confirmText) }}
        </app-button>
        <app-button
          v-if="isCancelVisible"
          class="app-info-modal__cancel"
          secondary
          @click="onCancel">
          {{ $t(cancelText) }}
        </app-button>
      </div>
    </div>
  </app-form-wrapper>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';

const warningIcon = require('@/assets/icons/warning.svg');
const successIcon = require('@/assets/icons/success.svg');

interface TModalType {
  icon: string;
}

export const InfoModalTypes = {
  warning: 'warning',
  success: 'success',
};

const modalTypes: { [key: string]: TModalType } = {
  [InfoModalTypes.warning]: {
    icon: warningIcon,
  },
  [InfoModalTypes.success]: {
    icon: successIcon,
  },
};

type TModalTypes = keyof typeof InfoModalTypes;

@Component({
  components: {
    AppFormWrapper,
    AppButton,
  },
})
export default class AppInfoModal extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: String, default: '' }) readonly subtitle!: string;

  @Prop({
    type: String,
    required: true,
    validator(value: string): boolean {
      return Object.keys(modalTypes).includes(value);
    },
  }) readonly type!: TModalTypes;

  @Prop({ type: String, default: 'action.confirm' }) readonly confirmText!: string;

  @Prop({ type: String, default: 'action.cancel' }) readonly cancelText!: string;

  @Prop({ type: Boolean, default: true }) readonly isCancelVisible!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isButtonsInRow!: boolean;

  protected get currentType(): TModalType {
    return modalTypes[this.type];
  }

  @Emit('confirm')
  protected onConfirm(): boolean {
    return true;
  }

  @Emit('cancel')
  protected onCancel(): boolean {
    return true;
  }

}
</script>

<style lang="scss">
.app-info-modal {
  @apply flex flex-col items-center justify-center text-center  w-full max-w-520;

  &__icon {
    @apply max-w-100 h-auto mb-48;
  }

  &__title {
    @apply font-semibold text-2xl text-gray-500 mb-16;
  }

  &__subtitle {
    @apply font-medium text-lg text-blue-500 mb-36 w-full max-w-300;
  }

  &__buttons {
    @apply flex flex-col items-center w-full;

    &--row {
      @apply flex-row-reverse justify-center;

      .app-info-modal__cancel {
        @apply mr-14 w-auto #{!important};
      }

      button {
        @apply max-w-240 mb-0 #{!important};
      }
    }

    button {
      @apply mx-0 #{!important};
      @apply mb-32;
    }
  }
}
</style>
