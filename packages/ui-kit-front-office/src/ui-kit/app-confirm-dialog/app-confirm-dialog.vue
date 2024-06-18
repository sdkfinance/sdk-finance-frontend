<template>
  <el-dialog
    :visible="visibleValue"
    :width="width"
    :lock-scroll="lockScroll"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="false"
    top="0"
    modal-class="app-confirm-modal"
    custom-class="app-confirm-dialog"
    append-to-body
    destroy-on-close
    @open="openHandler"
    @opened="openedHandler"
    @close="closeHandler"
    @closed="closedHandler">
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template #footer>
      <slot name="footer">
        <app-button
          type="secondary"
          size="small"
          @click="cancelButtonClickHandler">
          {{ $t('action.cancel') }}
        </app-button>
        <app-button
          type="primary"
          size="small"
          @click="okButtonClickHandler">
          {{ $t('action.ok') }}
        </app-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Dialog } from 'element-ui';
import { defineComponent } from 'vue';

import { AppButton } from '../../ui-framework/app-button';

const DEFAULT_DIALOG_WIDTH = '19.8125rem';

export default defineComponent({
  name: 'AppConfirmDialog',
  components: { ElDialog: Dialog, AppButton },
  model: {
    prop: 'visible',
    event: 'update:visible',
  },
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, required: true },
    width: { type: String, default: DEFAULT_DIALOG_WIDTH },
    lockScroll: { type: Boolean, default: true },
    closeOnPressEscape: { type: Boolean, default: true },
    closeOnClickModal: { type: Boolean, default: true },
    closeOnCancelClick: { type: Boolean, default: true },
    closeOnOkClick: { type: Boolean, default: false },
  },
  computed: {
    visibleValue: {
      get() {
        return this.visible;
      },
      set(value: boolean) {
        this.emitChangeVisibleEvent(value);
      },
    },
  },
  methods: {
    cancelButtonClickHandler() {
      if (this.closeOnCancelClick) {
        this.visibleValue = false;
      }

      this.emitCancelEvent();
    },
    okButtonClickHandler() {
      if (this.closeOnOkClick) {
        this.visibleValue = false;
      }

      this.emitOkEvent();
    },
    openHandler() {
      this.emitOpenEvent();
    },
    openedHandler() {
      this.emitOpenedEvent();
    },
    closeHandler() {
      this.visibleValue = false;
      this.emitCloseEvent();
    },
    closedHandler() {
      this.emitClosedEvent();
    },
    emitOkEvent() {
      this.$emit('ok');
    },
    emitCancelEvent() {
      this.$emit('cancel');
    },
    emitOpenEvent() {
      this.$emit('open');
    },
    emitOpenedEvent() {
      this.$emit('opened');
    },
    emitCloseEvent() {
      this.$emit('close');
    },
    emitClosedEvent() {
      this.$emit('closed');
    },
    emitChangeVisibleEvent(visible: boolean) {
      this.$emit('update:visible', visible);
    },
  },
});
</script>

<style lang="scss">
.app-confirm-modal {
  @apply bg-gray-500 bg-opacity-20 opacity-100;
}

.el-dialog__wrapper:has(.app-confirm-dialog) {
  @apply flex flex-col justify-center items-center;
}

.app-confirm-dialog.el-dialog {
  @apply grid grid-flow-row gap-y-[1.5rem] m-0 rounded-[6px] bg-gray-100 p-[1rem];
  @apply shadow-[0_8px_20px_0_rgba(161,182,198,0.35)];

  .el-dialog {
    &__header,
    &__body,
    &__footer {
      @apply p-0;
    }

    &__body {
      @apply hidden;
    }

    &__header {
      @apply text-md leading-[20px] font-medium text-blue-600;
    }
  }
}
</style>
