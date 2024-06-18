<template>
  <modal
    :visible="visible"
    :title="title"
    :width="width"
    @change="onCancel">
    <div v-loading="loading">
      <slot />
      <div class="confirm-controls">
        <app-button
          class="btn-submit"
          type="primary"
          @click="onConfirm">
          {{ $t(submitText) }}
        </app-button>
        <app-button
          type="secondary"
          class="btn-submit"
          @click="onCancel">
          {{ $t('action.cancel') }}
        </app-button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppButton } from '../../ui-framework/app-button';
import { Modal } from '../modal';

export default defineComponent({
  name: 'ConfirmModal',
  components: {
    Modal,
    AppButton,
  },
  props: {
    title: { type: String, default: 'placeholder.confirm_title' },
    submitText: { type: String, default: 'action.confirm' },
    loading: { type: Boolean, default: false },
    width: { type: String, default: '375px' },
  },
  data() {
    const onCancel: (...args: any[]) => any = () => false;
    const onConfirm: (...args: any[]) => any = () => true;
    const visible: boolean = false;

    return {
      visible,
      onConfirm,
      onCancel,
    };
  },
  methods: {
    open<T>(payload: T | boolean = true): Promise<T | boolean> {
      this.visible = true;
      return new Promise((resolve) => {
        this.onConfirm = () => {
          this.confirm(payload);
          this.visible = false;
          resolve(payload);
        };
        this.onCancel = () => {
          this.visible = false;
          resolve(false);
        };
      });
    },
    confirm<T>(payload: T) {
      this.$emit('confirm', payload);
    },
  },
});
</script>

<style lang="scss" scoped>
.confirm-controls {
  display: flex;
  justify-content: space-around;

  .confirm-controls__btn {
    width: 50%;
  }
}
</style>
