<template>
  <div class="wallet-card">
    <div class="wallet-card__header">
      <app-form
        ref="form"
        class="wallet-card__form"
        :model="form"
        :rules="rules"
        @submit.native.prevent>
        <app-form-item
          prop="name">
          <app-input
            v-model="form.name"
            :disabled="!isUpdate"
            size="small"/>
        </app-form-item>
      </app-form>
      <div class="wallet-card__header-action">
        <button
          v-if="isUpdate"
          class="button-as-text el-icon-close"
          @click="resetForm"/>
        <button
          v-if="isUpdate"
          class="button-as-text el-icon-check"
          @click="handleForm"/>
        <button
          v-else
          class="button-as-text icon-pencil"
          @click="isUpdate = true"/>
      </div>
    </div>
    <div class="wallet-card__body">
      {{ getAmount(walletData.amount) }} {{ walletData.issuer.currency }}
    </div>
    <div class="wallet-card__footer">
      <div class="wallet-card__footer-title">
        {{ walletData.serial }}
      </div>
      <div class="wallet-card__footer-action">
        <button
          class="button-as-text icon-trash"
          @click="onDelete(walletData.serial)"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    AppForm,
    AppInput,
    AppFormItem,
  },
})
export default class WalletCard extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) readonly walletData!: any;

  protected isUpdate: boolean = false;

  protected form: { name: string } = {
    name: '',
  };

  readonly rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  @Emit('update')
  protected onSubmit(name: string, serial: string): { name: string; serial: string } {
    return { name, serial };
  }

  @Emit('delete')
  protected onDelete(serial: string): string {
    return serial;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;
    this.isUpdate = false;
    this.onSubmit(this.form.name, this.walletData.serial);
  }

  protected resetForm(): void {
    this.isUpdate = false;
    this.appForm.resetFields();
    this.form.name = this.walletData.name;
  }

  protected getAmount(amount: number): number {
    return Number(Number(amount).toFixed(2));
  }

  protected created(): void {
    this.form.name = this.walletData.name;
  }

}
</script>

<style lang="scss">
.wallet-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 278px;
  height: 160px;
  background: #2d2d2d;
  color: $white;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;

    &-title {
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      padding: 2px 4px;
    }

    &-action {
      display: flex;
      align-items: center;
      font-size: 10px;

      .el-icon-check {
        font-size: 18px;
        font-weight: bold;
        color: $success-color;
      }

      .el-icon-close {
        font-size: 18px;
        font-weight: bold;
        color: $red;
      }
    }
  }

  &__body {
    font-weight: 600;
    font-size: 24px;
    padding-bottom: 20px;
  }

  &__form {
    .el-form-item {
      margin-bottom: 0;
    }

    .el-input .el-input__inner, {
      font-weight: 600;
      font-size: 16px;
      color: $white;
      background: transparent;
      padding: 2px 4px;
      line-height: 1.2;
      border: 1px solid $primary-color;

      &:focus {
        background: transparent;
      }
    }

    .el-input.is-disabled .el-input__inner {
      background-color: transparent;
      border-color: transparent;
      color: white;
      cursor: text;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-title {
      font-weight: normal;
      font-size: 13px;
    }

    &-action {
      font-size: 10px;
      color: $red;
    }
  }
}
</style>
