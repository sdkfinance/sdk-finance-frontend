<template>
  <div
    v-loading="isLoading"
    class="app-upload"
    :class="{'app-upload--full': isWidthFull}">
    <label
      v-if="label"
      class="app-input__label">{{ $t(label) }}</label>

    <el-upload
      ref="upload"
      :drag="drag"
      :auto-upload="autoUpload"
      :multiple="multiple"
      :action="action"
      :disabled="disabled"
      :limit="limit"
      :headers="requestHeaders"
      :accept="accept"
      :on-change="onChangeHandler"
      :on-success="onSuccessHandler"
      :on-preview="onPreview"
      :before-remove="onBeforeRemove"
      :on-exceed="onExceedFile">
      <img
        v-if="file"
        :src="file"
        class="max-h-300 h-300 w-full m-auto object-contain p-20"
        :class="{'cursor-not-allowed': disabled}"
        alt="">

      <template v-else>
        <i class="el-icon-upload app-upload__icon"/>

        <div class="app-upload__text">
          <slot name="text">
            {{ $t('pages.user_profile.labels.drop_file_or') }}
            <span class="text-blue-accent">{{ $t('action.click_to_upload') }}</span>
          </slot>
        </div>
        <div
          v-if="tip"
          class="app-upload__tip mb-40">
          {{ $t(tipData.message, tipData.params) }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';
import { Upload } from 'element-ui';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';
import { getAuthHeader } from '@/services/api';

@Component({
  components: {
    [Upload.name]: Upload,
  },
})
export default class AppUpload extends Vue {

  @Ref('upload') readonly uploadButton!: Upload;

  @Prop({ type: [String, Object], default: '' }) readonly tip!: string | object;

  @Prop({ type: String, default: '' }) readonly action!: string;

  @Prop({ type: String, default: 'image/jpeg, image/png' }) readonly accept!: string;

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Boolean, default: true }) readonly autoUpload!: boolean;

  @Prop({ type: Boolean, default: true }) readonly drag!: boolean;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Boolean, default: false }) readonly multiple!: boolean;

  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isWidthFull!: boolean;

  @Prop({ type: Number, default: 1 }) readonly limit!: number;

  @Prop({ type: Function, default: () => ({}) }) readonly onPreview!: Function;

  @Prop({ type: Function, default: () => ({}) }) readonly onBeforeRemove!: Function;

  @Prop({ type: Function, default: () => ({}) }) readonly onSuccess!: Function;

  @Prop({ type: String, default: '' }) readonly fileType!: string;

  @Prop({ type: String, default: '' }) fileUrl!: string;

  @Watch('fileUrl')
  setFile(newFile: string) {
    this.file = newFile;
  }

  protected file: string | null = null;

  protected onSuccessHandler(response: IPlainObject): void {
    this.onSuccess(response, this.fileType);
  }

  protected get tipData(): IPlainObject {
    return typeof this.tip !== 'string' ? this.tip : { message: this.tip, params: {} };
  }

  protected get requestHeaders(): IPlainObject {
    return getAuthHeader();
  }

  protected onChangeHandler(file: IPlainObject): void {
    const reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = () => { this.file = String(reader.result); };
    reader.onerror = () => { errorNotification('entity.error.FILE_UPLOAD'); };
  }

  protected onExceedFile(): void {
    errorNotification('validation.upload_image_with_restrictions', { size: 5, extensions: 'PNG, JPEG' });
  }

  public submitUpload(): void {
    this.uploadButton.submit();
  }

}
</script>

<style lang="scss">
.app-upload {
  &--full .el-upload,
  &--full .el-upload-dragger {
    @apply w-full;
  }

  .el-upload-dragger {
    @apply border-none h-auto #{!important};

    background-image: url("~@/assets/images/dashed-border.svg");
  }

  &__label {
    @apply font-semibold mb-8 text-black inline-block;
  }

  &__text,
  &__tip {
    @apply text-blue-600;
  }

  &__text {
    @apply text-lg;
  }

  &__tip {
    @apply mt-10 text-sm;
  }

  &__icon {
    @apply text-60 mb-0 leading-none #{!important};
  }
}
</style>
