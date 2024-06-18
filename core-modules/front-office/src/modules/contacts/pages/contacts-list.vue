<template>
  <base-tabs-layout
    title="pages.contacts.contacts_list"
    :links="links">
    <template #actions>
      <app-button
        size="small"
        @click="isCreateModalVisible = true">
        {{ $t('action.create_contact') }}
      </app-button>
    </template>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="contactsFilters"
      :on-load="fetchData">
      <contacts-table
        :data="tableData"
        :is-loading="isLoading"
        @open-details-modal="onOpenUpdateModal" />
    </app-data-table>
    <modal
      v-model="isCreateModalVisible"
      title="pages.contacts.create_contact"
      width="380px">
      <contact-form @submit="onContactSubmit" />
    </modal>
    <modal
      v-model="isUpdateModalVisible"
      title="pages.contacts.update_contact"
      width="380px">
      <contact-form
        :form-data="formData"
        :is-update="true"
        @delete="onDelete"
        @submit="onContactSubmit" />
    </modal>
    <confirm-modal
      ref="deleteContactModal"
      title="pages.contacts.confirm_delete_contact" />
  </base-tabs-layout>
</template>

<script lang="ts">
import type { ITableFilter } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';

import BaseTabsLayout from '../../../layouts/base-tabs-layout.vue';
import type { IContactRecord, IGetContactsOptions, IGetContactsPaginateResponse } from '../../../requests';
import { ContactsRequests } from '../../../requests';
import ContactForm from '../components/contact-form.vue';
import ContactsTable from '../components/contacts-table.vue';
import { contactsFilters } from '../filters/filters';
import { CONTACTS_CHILDREN } from '../routes';

@Component({
  name: 'contacts-list',
  components: {
    BaseTabsLayout,
    Modal,
    AppDataTable,
    AppButton,
    ContactsTable,
    ContactForm,
    ConfirmModal,
  },
})
export default class ContactsList extends Vue {
  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Ref('deleteContactModal') readonly deleteContactModal!: ConfirmModal;

  protected readonly links = CONTACTS_CHILDREN;

  protected tableData: IContactRecord[] = [];

  protected formData: Partial<IContactRecord> = {};

  protected contactsFilters: ITableFilter[] = contactsFilters;

  protected isLoading: boolean = false;

  protected isCreateModalVisible: boolean = false;

  protected isUpdateModalVisible: boolean = false;

  protected async fetchData(options: IGetContactsOptions): Promise<IGetContactsPaginateResponse> {
    this.isLoading = true;
    const request = await ContactsRequests.getRecords(options);
    this.isLoading = false;

    if (request.error) {
      errorNotification(request.error);
    }

    return request;
  }

  protected async onDelete(id: string): Promise<void> {
    const value = await this.deleteContactModal.open();

    if (!value) {
      return;
    }

    const { error } = await ContactsRequests.deleteRecord(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onContactSubmit();
  }

  protected onContactSubmit(): void {
    this.isCreateModalVisible = false;
    this.isUpdateModalVisible = false;
    this.refDataTable.loadData();
  }

  protected onOpenUpdateModal(record: IContactRecord): void {
    this.formData = record;
    this.isUpdateModalVisible = true;
  }
}
</script>
