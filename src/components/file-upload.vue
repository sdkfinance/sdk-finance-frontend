<template>
  <label
    class="file-upload"
    @click="$refs.input.click()">
    <input
      ref="input"
      type="file"
      :accept="accept"
      class="file-upload__input"
      @change="onChangeFile">
    <slot>
      <app-button
        size="small">
        {{ $t('action.upload_file') }}
      </app-button>
    </slot>
  </label>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: {
    AppButton,
  },
})
export default class FileUpload extends Vue {

  @Prop({
    type: String,
    default: '.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  }) accept!: string

  @Emit('file-changed')
  onChangeFile(e: Event): FormData {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const formData = new FormData();
    formData.append('file', file);
    target.value = '';

    return formData;
  }

}
</script>

<style lang="scss">
  .file-upload {
    display: inline-block;

    &__input {
      display: none;
    }
  }
</style>
