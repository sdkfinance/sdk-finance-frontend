<template>
  <div class="max-w-510">
    <app-upload
      class="mb-20"
      :is-loading="isLoading"
      :action="config.action"
      :disabled="isLoading || !!passportFileUrl"
      :tip="config.tip"
      :file-url="passportFileUrl"
      file-type="passport"
      label="form.label.identity_document"
      :on-success="onSuccessHandler"/>

    <app-upload
      v-if="!isTxManual"
      class="mb-20"
      :is-loading="isLoading"
      :action="config.action"
      :disabled="isLoading || !!taxIdFileUrl"
      :tip="config.tip"
      :file-url="taxIdFileUrl"
      file-type="tax_id"
      label="form.label.tax_id_number"
      :on-success="onSuccessHandler"/>

    <app-form
      v-else
      ref="form"
      :loading="isLoading"
      class="my-15 w-full"
      :model="form"
      :rules="rules"
      @submit.native.prevent="saveTaxIdManually">
      <app-form-item prop="taxId">
        <app-input
          v-model="form.taxId"
          :disabled="isTxAlreadyPresent"
          name="taxId"
          label="form.label.input_tax_id"
          placeholder="placeholder.input.tax_id"/>
      </app-form-item>
    </app-form>

    <app-switch
      v-if="!isTxAlreadyPresent"
      v-model="isTxManual"
      class="mb-48"
      is-label-after
      label="form.label.input_tx_id_manually"/>

    <app-button
      v-if="isTxManual"
      :disabled="!isUpdateButtonAvailable"
      @click="saveTaxIdManually">
      {{ $t('action.update') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import AppUpload from '@/components/ui-framework/app-upload.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { apiConfig } from '@/services/api';
import { ProfileDocumentsRequests } from '@/services/requests';
import { UserData } from '@/store/modules';
import { IPlainObject, IUploadConfig } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppFormItem,
    AppForm,
    AppButton,
    AppInput,
    AppUpload,
    AppSwitch,
  },
})
export default class ProfileDocuments extends Vue {

  private userData = getModule(UserData, this.$store);

  protected form: { taxId: string } = {
    taxId: '',
  };

  protected rules: IPlainObject = {
    taxId: SimpleRequiredValidationRule(),
  }

  protected isLoading: boolean = false;

  protected files: IPlainObject[] | null = null;

  protected isTxManual = false;

  protected config: IUploadConfig = {
    action: `${apiConfig.baseURL}/media-files`,
    tip: {
      message: 'validation.upload_image_with_restrictions',
      params: {
        size: 5,
        extensions: 'JPEG, PNG',
      },
    },
  };

  protected get passportFileUrl(): string | undefined {
    const [passportFile] = this.files?.filter(({ type }) => type === 'passport') || [];

    return passportFile?.url;
  }

  protected get taxIdFileUrl(): string | undefined {
    const [taxIdFile] = this.files?.filter(({ type }) => type === 'tax_id') || [];

    return taxIdFile?.url;
  }

  protected get isUpdateButtonAvailable(): boolean {
    return !this.isTxAlreadyPresent;
  }

  protected created(): void {
    this.fetchDocuments();
  }

  protected isTxAlreadyPresent: boolean = false;

  protected async fetchDocuments(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await ProfileDocumentsRequests.getProfileDocuments();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    const availableFiles = response?.documents
      .filter((doc) => ['tax_id', 'passport'].includes(doc.type) && doc?.file?.id)
      .map((doc) => ({
        id: doc?.file?.id,
        type: doc?.type,
        status: doc?.status,
      }));

    const taxIdNumber = response?.documents.find((item) => item.type === 'tax_id' && !item?.file?.id)?.documentIdentifier;
    if (taxIdNumber) {
      this.form.taxId = taxIdNumber;
      this.isTxManual = true;
      this.isTxAlreadyPresent = true;
    }

    await this.getDocumentsUrls(availableFiles || []);
  }

  protected getDocumentsUrls(fileIds: IPlainObject[]): void {
    this.files = fileIds.map((file) => ({
      url: ProfileDocumentsRequests.getSingleProfileDocumentUrl(file.id, String(this.userData.token)),
      ...file,
    }));
  }

  protected async saveTaxIdManually(): Promise<void> {
    this.isLoading = true;
    const { error } = await ProfileDocumentsRequests.updateProfileTaxIdWithNumber(this.form.taxId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

  protected async onSuccessHandler(response: any, type: string): Promise<void> {
    this.isLoading = true;
    const { error } = await ProfileDocumentsRequests.linkPhotoToProfileDocuments(response.file.id, type);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>
