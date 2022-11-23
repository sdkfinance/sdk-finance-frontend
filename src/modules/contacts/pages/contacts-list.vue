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
        @open-details-modal="onOpenUpdateModal"/>
    </app-data-table>
    <modal
      v-model="isCreateModalVisible"
      title="pages.contacts.create_contact"
      width="380px">
      <contact-form
        @submit="onContactSubmit"/>
    </modal>
    <modal
      v-model="isUpdateModalVisible"
      title="pages.contacts.update_contact"
      width="380px">
      <contact-form
        :form-data="formData"
        :is-update="true"
        @delete="onDelete"
        @submit="onContactSubmit"/>
    </modal>
    <confirm-modal
      ref="deleteContactModal"
      title="pages.contacts.confirm_delete_contact"/>
  </base-tabs-layout>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';

import ConfirmModal from '@/components/confirm-modal.vue';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import BaseTabsLayout from '@/layouts/base-tabs-layout.vue';
import ContactForm from '@/modules/contacts/components/contact-form.vue';
import ContactsTable from '@/modules/contacts/components/contacts-table.vue';
import { contactsFilters } from '@/modules/contacts/filters/filters';
import { CONTACTS_CHILDREN } from '@/modules/contacts/routes';
import {
  IContactRecord,
  IGetContactsOptions,
  IGetContactsPaginateResponse,
} from '@/services/requests/contact-book/Contacts.types';
import { ContactsRequests } from '@/services/requests/contact-book/ContactsRequests';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { errorNotification, successNotification } from '@/utils';

@Component({
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

  @Ref('dataTable') readonly refDataTable!: AppDataTable

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
    if (!value) return;

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
