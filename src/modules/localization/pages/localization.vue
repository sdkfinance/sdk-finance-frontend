<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.localization.title') }}
      </template>
      <template #actions>
        <buttons-group>
          <app-button
            size="small"
            :is-loading="isLoadingExport"
            @click="exportFile">
            {{ $t('action.download_as_xls') }}
          </app-button>
          <file-upload @file-changed="importFile">
            <app-button
              size="small"
              :is-loading="isLoadingImport">
              {{ $t('action.upload_as_xls') }}
            </app-button>
          </file-upload>
          <app-button
            size="small"
            @click="openCreateModal">
            {{ $t('action.add_new') }}
          </app-button>
        </buttons-group>
      </template>
    </main-head>
    <app-data-table
      v-show="isOnLoad"
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <localization-table
        :data="tableData"
        :locales="locales"
        :is-loading="isLoading"
        @edit-record="openUpdateModal"
        @delete-record="onDelete"/>
    </app-data-table>
    <modal
      v-model="isCreateModalShow"
      :title="$t('pages.localization.view_modal_create_title')"
      width="380px">
      <localization-form
        :form-data="formData"
        :locales-object="localesObject"
        :locales="locales"
        :is-loading="isLoadingForm"
        @submit="onCreate"/>
    </modal>
    <modal
      v-model="isUpdateModalShow"
      :title="$t('pages.localization.view_modal_update_title')"
      width="380px">
      <localization-form
        :form-data="formData"
        :locales-object="localesObject"
        :locales="locales"
        :is-update="true"
        :is-loading="isLoadingForm"
        @submit="onUpdate"/>
    </modal>
    <confirm-modal
      ref="confirmDeleteModal"
      :title="$t('placeholder.delete_title', { word: deleteModalTitle })"/>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import ButtonsGroup from '@/components/ui-kit/app-buttons-group.vue';
import FileUpload from '@/components/file-upload.vue';
import MainHead from '@/components/main-head.vue';
import Modal from '@/components/modal.vue';
import ConfirmModal from '@/components/confirm-modal.vue';
import { LocalizationRequests } from '@/services/requests';
import { errorNotification, successNotification, exportTo } from '@/utils';
import { IPlainObject } from '@/types/interfaces';
import {
  ILocalization,
  ILocalizationRecord,
  ILocalizationCreateBody,
  ILocalizationUpdateBody,
  ILocalizationValue,
} from '@/services/requests/i18n-records/Localization.interface';
import LocalizationTable from '../components/localization-table.vue';
import LocalizationForm from '../components/localization-form.vue';
import { localizationFilters } from '../filters/filters';

@Component({
  components: {
    MainHead,
    Modal,
    AppDataTable,
    AppButton,
    ButtonsGroup,
    FileUpload,
    LocalizationTable,
    LocalizationForm,
    ConfirmModal,
  },
})
export default class LocalizationPage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Ref('confirmDeleteModal') readonly confirmDeleteModal!: ConfirmModal;

  private tableData: ILocalizationRecord[] = [];

  private locales: string[] = [];

  private filters = localizationFilters;

  private formData: ILocalization = this.getDefaultFormData();

  private isOnLoad: boolean = false;

  private isLoading: boolean = false;

  private isLoadingExport: boolean = false;

  private isLoadingImport: boolean = false;

  private isLoadingForm: boolean = false;

  private isCreateModalShow: boolean = false;

  private isUpdateModalShow: boolean = false;

  private get deleteModalTitle(): string {
    return this.formData?.key || '';
  }

  private get localesObject(): IPlainObject {
    return this.locales.reduce((acc, locale) => ({ ...acc, [locale]: '' }), {});
  }

  private getDefaultFormData(): ILocalization {
    return { id: 0, key: '', ...this.localesObject };
  }

  private async fetchData(params: any): Promise<any> {
    this.isLoading = true;
    const { response, error } = await LocalizationRequests.getRecords(params);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return {};
    }

    return { response, error };
  }

  private async fetchLocales(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await LocalizationRequests.getLocales();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.locales = response?.records || [];
    this.formData = this.getDefaultFormData();
  }

  private openCreateModal(): void {
    this.isCreateModalShow = true;
    this.formData = this.getDefaultFormData();
  }

  private openUpdateModal(form: ILocalization): void {
    this.isUpdateModalShow = true;
    this.formData = form;
  }

  private async onCreate(data: ILocalization): Promise<void> {
    this.isLoadingForm = true;

    const values = this.locales.map((locale: string): ILocalizationValue => ({ locale, value: data[locale] }));
    const sendData: ILocalizationCreateBody = {
      key: data.key,
      values,
    };
    const { error } = await LocalizationRequests.create(sendData);

    this.isLoadingForm = false;
    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isCreateModalShow = false;
    this.refDataTable.loadData();
  }

  private async onUpdate(data: ILocalization): Promise<void> {
    this.isLoadingForm = true;

    const values = this.locales.map((locale: string): ILocalizationValue => ({ locale, value: data[locale] }));
    const sendData: ILocalizationUpdateBody = { values };
    const { error } = await LocalizationRequests.update(data.id, sendData);

    this.isLoadingForm = false;
    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isUpdateModalShow = false;
    this.refDataTable.loadData();
  }

  private async onDelete(form: ILocalization): Promise<void> {
    const value = await this.confirmDeleteModal.open();
    if (!value) {
      return;
    }
    this.isLoadingForm = true;

    const { error } = await LocalizationRequests.delete(form.id);

    this.isLoadingForm = false;
    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isUpdateModalShow = false;
    this.refDataTable.loadData();
  }

  private async exportFile(): Promise<void> {
    this.isLoadingExport = true;
    const { error } = await exportTo('/i18n-records/export', 'i18n.xls');
    this.isLoadingExport = false;

    if (error) {
      errorNotification(error);
    }
  }

  private async importFile(file: FormData): Promise<void> {
    this.isLoadingImport = true;
    const { error } = await LocalizationRequests.import(file);
    this.isLoadingImport = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

  async created() {
    await this.fetchLocales();
    this.isOnLoad = true;
  }

}
</script>
