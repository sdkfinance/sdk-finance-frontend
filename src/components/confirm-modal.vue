<template>
  <modal
    :visible="visible"
    :title="title"
    width="375px"
    @change="onCancel">
    <div v-loading="loading">
      <slot/>
      <div class="confirm-controls">
        <app-button
          class="btn-submit"
          type="primary"
          @click="onConfirm">
          {{ $t(submitText) }}
        </app-button>
        <app-button
          type="success"
          class="btn-submit"
          @click="onCancel">
          {{ $t('action.cancel') }}
        </app-button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: {
    Modal,
    AppButton,
  },
})
export default class ConfirmModal extends Vue {

  @Prop({ type: String, default: 'placeholder.confirm_title' }) readonly title!: string;

  @Prop({ type: String, default: 'action.confirm' }) readonly submitText!: string;

  @Prop({ type: Boolean, default: false }) readonly loading!: boolean;

  protected visible: boolean = false;

  protected onConfirm: Function = () => true;

  protected onCancel: Function = () => false;

  @Emit('confirm')
  protected confirm<T>(payload: T): T {
    return payload;
  }

  public open<T>(payload: T|boolean = true): Promise<T|boolean> {
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
  }

}
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
