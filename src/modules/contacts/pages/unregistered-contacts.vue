<template>
  <base-tabs-layout
    title="pages.contacts.unregistered_contacts"
    :links="links">
    <contacts-table
      :data="tableData"
      :is-action-hidden="true"
      :is-loading="isLoading"/>
  </base-tabs-layout>
</template>

<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';
import BaseTabsLayout from '@/layouts/base-tabs-layout.vue';
import { CONTACTS_CHILDREN } from '@/modules/contacts/routes';
import ContactsTable from '@/modules/contacts/components/contacts-table.vue';
import {
  IContactRecord,
} from '@/services/requests/contact-book/Contacts.types';
import { ContactsRequests } from '@/services/requests/contact-book/ContactsRequests';
import { errorNotification } from '@/utils';

@Component({
  components: {
    BaseTabsLayout,
    ContactsTable,
  },
})
export default class InvoicesTemplates extends Vue {

  protected tableData: IContactRecord[] = [];

  protected readonly links = CONTACTS_CHILDREN;

  protected isLoading: boolean = false;

  protected created(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<any> {
    this.isLoading = true;
    const { response, error } = await ContactsRequests.getUnregisteredRecords();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.tableData = response?.contacts || [];

  }

}
</script>
